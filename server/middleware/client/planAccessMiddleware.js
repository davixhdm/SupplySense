const planAccessMiddleware = (requiredModules = []) => {
  return (req, res, next) => {
    const plan = req.organization.plan;
    const enabledModules = req.organization.enabledModules || {};

    const moduleAccess = {
      trial: ['dashboard', 'orders', 'inventory', 'suppliers', 'customers', 'settings', 'alerts'],
      standard: ['dashboard', 'transactions', 'orders', 'inventory', 'suppliers', 'customers', 'employees', 'ai_insights', 'alerts', 'settings'],
      proplus: ['dashboard', 'transactions', 'orders', 'inventory', 'suppliers', 'customers', 'employees', 'ai_insights', 'alerts', 'settings']
    };

    const allowedModules = moduleAccess[plan] || moduleAccess.trial;

    if (requiredModules.length > 0) {
      const hasPlanAccess = requiredModules.every(module => allowedModules.includes(module));
      if (!hasPlanAccess) {
        return res.status(403).json({
          message: 'Your plan does not include access to this feature. Upgrade to access.'
        });
      }

      const hasModuleEnabled = requiredModules.every(module => {
        const key = module === 'ai_insights' ? 'aiInsights' : module;
        return enabledModules[key] !== false;
      });
      if (!hasModuleEnabled) {
        return res.status(403).json({
          message: 'This module is disabled. Enable it in Settings.'
        });
      }
    }

    req.allowedModules = allowedModules;
    next();
  };
};

export default planAccessMiddleware;