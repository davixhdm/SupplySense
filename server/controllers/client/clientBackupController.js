import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import AuditLog from '../../models/admin/AuditLogModel.js';
import env from '../../config/env.js';

const backupDir = path.join(process.cwd(), 'backups', 'client');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const createBackup = async (req, res) => {
  try {
    const tenantId = req.user.organizationId.toString();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${tenantId}-${timestamp}.gz`;
    const filePath = path.join(backupDir, filename);

    const uri = env.MONGO_URI;
    const dbName = uri.split('/').pop().split('?')[0] || 'supplysense';

    const command = `mongodump --uri="${uri}" --collection=products --collection=orders --collection=suppliers --collection=customers --collection=transactions --collection=employees --collection=alerts --collection=devices --collection=clientusers --query='{"organizationId":"${tenantId}"}' --gzip --archive=${filePath}`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error('Backup exec error:', stderr);
        return res.status(500).json({ message: 'Backup failed.' });
      }

      const stats = fs.statSync(filePath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      await AuditLog.create({
        organizationId: req.user.organizationId,
        action: 'Backup created',
        actionType: 'backup_created',
        performedBy: req.user._id,
        performedByModel: 'ClientUser',
        description: `Backup created (${sizeInMB} MB)`,
        severity: 'info'
      });

      res.json({
        message: 'Backup created successfully.',
        filename,
        size: `${sizeInMB} MB`,
        createdAt: new Date()
      });
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getBackupHistory = async (req, res) => {
  try {
    const tenantId = req.user.organizationId.toString();
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith(`backup-${tenantId}`))
      .map(f => {
        const stats = fs.statSync(path.join(backupDir, f));
        return {
          filename: f,
          size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          createdAt: stats.mtime
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(files);
  } catch (error) {
    console.error('Backup history error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Backup file not found.' });
    }

    if (!filename.includes(req.user.organizationId.toString())) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  createBackup,
  getBackupHistory,
  downloadBackup
};