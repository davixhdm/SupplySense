import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import ClientUser from '../../models/client/ClientUserModel.js';
import ClientOrg from '../../models/admin/ClientOrgModel.js';

const clientAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    if (decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Use client token.' });
    }

    const user = await ClientUser.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    if (user.isLocked()) {
      return res.status(403).json({ message: 'Account is locked. Try again later.' });
    }

    const organization = await ClientOrg.findById(user.organizationId);
    if (!organization || !organization.isActive || organization.isSuspended) {
      return res.status(403).json({ message: 'Organization is not active.' });
    }

    if (organization.plan === 'trial' && organization.isTrialExpired()) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade.' });
    }

    if (organization.isPlanExpired()) {
      return res.status(403).json({ message: 'Subscription expired. Please renew.' });
    }

    req.user = user;
    req.organization = organization;
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

export default clientAuthMiddleware;