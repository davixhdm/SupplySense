import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import AuditLog from '../../models/admin/AuditLogModel.js';
import SystemSettings from '../../models/admin/SystemSettingsModel.js';
import { sendEmail } from '../../services/notification/emailService.js';

const backupDir = path.join(process.cwd(), 'backups', 'system');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

const upload = multer({ dest: path.join(process.cwd(), 'backups', 'temp') });

const createSystemBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `system-backup-${timestamp}.json`;
    const filePath = path.join(backupDir, filename);

    const collections = await mongoose.connection.db.listCollections().toArray();
    const data = { exportedAt: new Date().toISOString(), version: '1.0.0' };

    for (const col of collections) {
      const docs = await mongoose.connection.db.collection(col.name).find({}).toArray();
      data[col.name] = docs;
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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

    const settings = await SystemSettings.findOne();
    if (settings?.backupSchedule?.enabled && settings.backupSchedule.sendOnBackup && settings.backupSchedule.email) {
      try {
        await sendEmail({
          to: settings.backupSchedule.email,
          subject: `SupplySense Backup - ${filename}`,
          htmlContent: `<p>Automated backup created on ${new Date().toLocaleString()}</p><p>Filename: ${filename}</p><p>Size: ${sizeMB} MB</p>`
        });
      } catch (emailErr) {
        console.warn('Failed to send backup email:', emailErr.message);
      }
    }

    res.json({ message: 'Backup created.', filename, size: `${sizeMB} MB`, createdAt: new Date() });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getBackups = async (req, res) => {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.json'))
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

const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });
    fs.unlinkSync(filePath);

    await AuditLog.create({
      action: 'Backup deleted',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
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
    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    await sendEmail({
      to: req.admin.email,
      subject: `SupplySense Backup - ${filename}`,
      htmlContent: `
        <h2>Backup File</h2>
        <p>Filename: ${filename}</p>
        <p>Size: ${sizeMB} MB</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        <p>Download the backup from the admin panel.</p>
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

    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    await sendEmail({
      to: email,
      subject: `SupplySense Backup Shared - ${filename}`,
      htmlContent: `
        <h2>Shared Backup</h2>
        <p>Filename: ${filename}</p>
        <p>Size: ${sizeMB} MB</p>
        <p>Shared by: ${req.admin.fullName} (${req.admin.email})</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        <p>Download the backup from the admin panel.</p>
      `
    });

    await AuditLog.create({
      action: 'Backup shared',
      actionType: 'admin_action',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
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
    const filePath = path.join(backupDir, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const [collectionName, docs] of Object.entries(data)) {
      if (['exportedAt', 'version'].includes(collectionName)) continue;
      if (!Array.isArray(docs)) continue;

      const collection = mongoose.connection.db.collection(collectionName);
      if (docs.length > 0) {
        await collection.deleteMany({});
        await collection.insertMany(docs);
      }
    }

    await AuditLog.create({
      action: 'Backup restored',
      actionType: 'backup_restored',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      description: `Restored from ${filename}`,
      severity: 'warning'
    });

    res.json({ message: 'Backup restored successfully.' });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) settings = await SystemSettings.create({});

    settings.backupSchedule = {
      enabled: req.body.enabled || false,
      frequency: req.body.frequency || 'daily',
      time: req.body.time || '02:00',
      email: req.body.email || '',
      sendOnBackup: req.body.sendOnBackup || false
    };

    await settings.save();

    await AuditLog.create({
      action: 'Backup schedule updated',
      actionType: 'settings_updated',
      performedBy: req.admin._id,
      performedByModel: 'AdminUser',
      description: `Backup schedule ${settings.backupSchedule.enabled ? 'enabled' : 'disabled'} (${settings.backupSchedule.frequency})`,
      severity: 'info'
    });

    res.json(settings.backupSchedule);
  } catch (error) {
    console.error('Update schedule error:', error);
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
        if (['exportedAt', 'version'].includes(collectionName)) continue;
        if (!Array.isArray(docs)) continue;

        const collection = mongoose.connection.db.collection(collectionName);
        if (docs.length > 0) {
          await collection.deleteMany({});
          await collection.insertMany(docs);
        }
      }

      fs.unlinkSync(file.path);

      await AuditLog.create({
        action: 'Backup imported',
        actionType: 'backup_restored',
        performedBy: req.admin._id,
        performedByModel: 'AdminUser',
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
  createSystemBackup,
  getBackups,
  downloadBackup,
  deleteBackup,
  emailBackup,
  shareBackup,
  restoreBackup,
  updateSchedule,
  importBackup
};