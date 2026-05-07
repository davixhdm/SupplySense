import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import AdminUser from '../../models/admin/AdminUserModel.js';

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Not an admin token.' });
    }

    const admin = await AdminUser.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    if (admin.isLocked()) {
      return res.status(403).json({ message: 'Account is locked. Try again later.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export default adminAuthMiddleware;