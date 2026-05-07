const superAdminMiddleware = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Super admin only.' });
  }
  next();
};

export default superAdminMiddleware;