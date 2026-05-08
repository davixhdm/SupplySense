import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import AuditLog from '../../models/admin/AuditLogModel.js';
import { sendEmail } from '../../services/notification/emailService.js';
import multer from 'multer';
import SystemSettings from '../../models/admin/SystemSettingsModel.js';

const backupDir = path.join(process.cwd(), 'backups', 'client');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const upload = multer({ dest: path.join(process.cwd(), 'backups', 'temp') });

const CLIENT_COLLECTIONS = ['products', 'orders', 'suppliers', 'customers', 'transactions', 'employees', 'alerts', 'devices', 'clientusers'];

const createBackup = async (req, res) => {
  try {
    const tenantId = req.user.organizationId.toString();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${tenantId}-${timestamp}.json`;
    const filePath = path.join(backupDir, filename);

    const data = { exportedAt: new Date().toISOString(), version: '1.0.0', organizationId: tenantId, organizationName: req.organization.organizationName };

    for (const colName of CLIENT_COLLECTIONS) {
      const docs = await mongoose.connection.db.collection(colName)
        .find({ organizationId: req.user.organizationId })
        .toArray();
      if (docs.length > 0) data[colName] = docs;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Backup created',
      actionType: 'backup_created',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `Backup created (${sizeMB} MB)`,
      severity: 'info'
    });

    res.json({ message: 'Backup created successfully.', filename, size: `${sizeMB} MB`, createdAt: new Date() });
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
        return { filename: f, size: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`, createdAt: stats.mtime };
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
    const tenantId = req.user.organizationId.toString();
    if (!filename.startsWith(`backup-${tenantId}`)) return res.status(403).json({ message: 'Access denied.' });

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });
    res.download(filePath);
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const tenantId = req.user.organizationId.toString();
    if (!filename.startsWith(`backup-${tenantId}`)) return res.status(403).json({ message: 'Access denied.' });

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });
    fs.unlinkSync(filePath);

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Backup deleted',
      actionType: 'admin_action',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `Deleted backup: ${filename}`,
      severity: 'info'
    });

    res.json({ message: 'Backup deleted.' });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const emailBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const tenantId = req.user.organizationId.toString();
    if (!filename.startsWith(`backup-${tenantId}`)) return res.status(403).json({ message: 'Access denied.' });

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    await sendEmail({
      to: req.user.email,
      subject: `SupplySense Backup - ${req.organization.organizationName}`,
      htmlContent: `
        <h2>Backup File</h2>
        <p>Organization: ${req.organization.organizationName}</p>
        <p>Filename: ${filename}</p>
        <p>Size: ${sizeMB} MB</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        <p>Download the backup from your dashboard.</p>
      `
    });

    res.json({ message: 'Backup emailed successfully.' });
  } catch (error) {
    console.error('Email backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const shareBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Recipient email is required.' });

    const tenantId = req.user.organizationId.toString();
    if (!filename.startsWith(`backup-${tenantId}`)) return res.status(403).json({ message: 'Access denied.' });

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    await sendEmail({
      to: email,
      subject: `SupplySense Backup Shared - ${req.organization.organizationName}`,
      htmlContent: `
        <h2>Shared Backup</h2>
        <p>Organization: ${req.organization.organizationName}</p>
        <p>Filename: ${filename}</p>
        <p>Size: ${sizeMB} MB</p>
        <p>Shared by: ${req.user.fullName} (${req.user.email})</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      `
    });

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Backup shared',
      actionType: 'admin_action',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `Shared backup ${filename} with ${email}`,
      severity: 'info'
    });

    res.json({ message: 'Backup shared successfully.' });
  } catch (error) {
    console.error('Share backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const restoreBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const tenantId = req.user.organizationId.toString();
    if (!filename.startsWith(`backup-${tenantId}`)) return res.status(403).json({ message: 'Access denied.' });

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const [collectionName, docs] of Object.entries(data)) {
      if (['exportedAt', 'version', 'organizationId', 'organizationName'].includes(collectionName)) continue;
      if (!Array.isArray(docs)) continue;

      const collection = mongoose.connection.db.collection(collectionName);
      await collection.deleteMany({ organizationId: req.user.organizationId });
      if (docs.length > 0) {
        await collection.insertMany(docs);
      }
    }

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Backup restored',
      actionType: 'backup_restored',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      description: `Restored from ${filename}`,
      severity: 'warning'
    });

    res.json({ message: 'Backup restored successfully.' });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const importBackup = async (req, res) => {
  try {
    const uploadMiddleware = upload.single('backup');

    uploadMiddleware(req, res, async (err) => {
      if (err) return res.status(400).json({ message: 'File upload failed.' });

      const file = req.file;
      if (!file) return res.status(400).json({ message: 'No file uploaded.' });

      const data = JSON.parse(fs.readFileSync(file.path, 'utf-8'));

      for (const [collectionName, docs] of Object.entries(data)) {
        if (['exportedAt', 'version', 'organizationId', 'organizationName'].includes(collectionName)) continue;
        if (!Array.isArray(docs)) continue;

        const collection = mongoose.connection.db.collection(collectionName);
        await collection.deleteMany({ organizationId: req.user.organizationId });
        if (docs.length > 0) {
          const tenantDocs = docs.map(d => ({ ...d, organizationId: req.user.organizationId }));
          await collection.insertMany(tenantDocs);
        }
      }

      fs.unlinkSync(file.path);

      await AuditLog.create({
        organizationId: req.user.organizationId,
        action: 'Backup imported',
        actionType: 'backup_restored',
        performedBy: req.user._id,
        performedByModel: 'ClientUser',
        description: `Imported from file: ${file.originalname}`,
        severity: 'warning'
      });

      res.json({ message: 'Backup imported and restored successfully.' });
    });
  } catch (error) {
    console.error('Import backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  createBackup,
  getBackupHistory,
  downloadBackup,
  deleteBackup,
  emailBackup,
  shareBackup,
  restoreBackup,
  importBackup
};