const planAccessMiddleware = (requiredModules = []) => {
  return (req, res, next) => {
    const plan = req.organization.plan;

    const moduleAccess = {
      trial: [
        'dashboard', 'orders', 'inventory', 'suppliers',
        'customers', 'settings', 'alerts'
      ],
      standard: [
        'dashboard', 'transactions', 'orders', 'inventory',
        'suppliers', 'customers', 'employees', 'ai_insights',
        'alerts', 'settings'
      ],
      proplus: [
        'dashboard', 'transactions', 'orders', 'inventory',
        'suppliers', 'customers', 'employees', 'ai_insights',
        'alerts', 'settings'
      ]
    };

    const allowedModules = moduleAccess[plan] || moduleAccess.trial;

    if (requiredModules.length > 0) {
      const hasAccess = requiredModules.every(module => allowedModules.includes(module));
      if (!hasAccess) {
        return res.status(403).json({
          message: 'Your plan does not include access to this feature. Upgrade to access.'
        });
      }
    }

    req.allowedModules = allowedModules;
    next();
  };
};

export default planAccessMiddleware;