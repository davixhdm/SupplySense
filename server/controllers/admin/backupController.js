import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import AuditLog from '../../models/admin/AuditLogModel.js';
import env from '../../config/env.js';

const backupDir = path.join(process.cwd(), 'backups', 'system');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const createSystemBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `system-backup-${timestamp}.gz`;
    const filePath = path.join(backupDir, filename);

    const uri = env.MONGO_URI;
    const command = `mongodump --uri="${uri}" --gzip --archive=${filePath}`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error('Backup error:', stderr);
        return res.status(500).json({ message: 'Backup failed.' });
      }

      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      await AuditLog.create({
        action: 'System backup created',
        actionType: 'backup_created',
        performedBy: req.admin._id,
        performedByModel: 'AdminUser',
        description: `Full system backup (${sizeMB} MB)`,
        severity: 'info'
      });

      res.json({ message: 'Backup created.', filename, size: `${sizeMB} MB` });
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getBackups = async (req, res) => {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.gz'))
      .map(f => {
        const stats = fs.statSync(path.join(backupDir, f));
        return { filename: f, size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`, createdAt: stats.mtime };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.json(files);
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });
    res.download(filePath);
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { createSystemBackup, getBackups, downloadBackup };