import Device from '../../models/client/DeviceModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';

const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({
      organizationId: req.user.organizationId
    }).populate('userId', 'fullName email').sort({ lastActive: -1 });

    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    }).populate('userId', 'fullName email');

    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }
    res.json(device);
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deactivateDevice = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    if (!device.isActive) {
      return res.status(400).json({ message: 'Device already deactivated.' });
    }

    await device.deactivate(req.user._id, 'ClientUser', req.body.reason || 'Admin deactivation');

    await AuditLog.create({
      organizationId: req.user.organizationId,
      action: 'Device deactivated',
      actionType: 'device_deactivated',
      performedBy: req.user._id,
      performedByModel: 'ClientUser',
      targetId: device._id,
      deviceId: device.deviceId,
      description: `Device ${device.deviceName} deactivated`,
      ipAddress: req.ip,
      severity: 'info'
    });

    res.json({ message: 'Device deactivated.' });
  } catch (error) {
    console.error('Deactivate device error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getDeviceActivity = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found.' });
    }

    res.json({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      lastActive: device.lastActive,
      ipAddress: device.ipAddress,
      browser: device.browser,
      operatingSystem: device.operatingSystem,
      trustLevel: device.trustLevel,
      isVerified: device.isVerified,
      isActive: device.isActive
    });
  } catch (error) {
    console.error('Device activity error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  getDevices,
  getDeviceById,
  deactivateDevice,
  getDeviceActivity
};