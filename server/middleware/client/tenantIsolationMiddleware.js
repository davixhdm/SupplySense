const tenantIsolationMiddleware = (req, res, next) => {
  if (!req.organization) {
    return res.status(403).json({ message: 'Tenant not identified.' });
  }

  req.tenantId = req.organization._id;
  next();
};

export default tenantIsolationMiddleware;