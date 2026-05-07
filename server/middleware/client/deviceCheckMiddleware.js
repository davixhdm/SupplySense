import Device from '../../models/client/DeviceModel.js';

const deviceCheckMiddleware = async (req, res, next) => {
  try {
    const deviceId = req.headers['x-device-id'];
    
    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required.' });
    }

    const device = await Device.findOne({
      deviceId,
      organizationId: req.organization._id,
      userId: req.user._id,
      isActive: true,
      isVerified: true
    });

    if (!device) {
      return res.status(403).json({ message: 'Device not authorized. Please verify this device.' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    await device.updateActivity(ipAddress, userAgent);

    req.device = device;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Device verification failed.' });
  }
};

export default deviceCheckMiddleware;