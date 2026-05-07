const moderatorMiddleware = (req, res, next) => {
  if (!req.admin || (req.admin.role !== 'superadmin' && req.admin.role !== 'moderator')) {
    return res.status(403).json({ message: 'Access denied. Moderator or higher required.' });
  }
  next();
};

export default moderatorMiddleware;