import env from '../../config/env.js';

const getPlansPricing = async (req, res) => {
  try {
    const plans = {
      trial: {
        duration: env.TRIAL_DURATION_DAYS,
        price: 0
      },
      standard: {
        monthly: 0,
        yearly: 0,
        permanent: 0
      },
      proplus: {
        monthly: 0,
        yearly: 0,
        permanent: 0
      }
    };

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const updatePlansPricing = async (req, res) => {
  try {
    res.json({ message: 'Pricing updated in environment variables.', data: req.body });
  } catch (error) {
    console.error('Update plans error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export { getPlansPricing, updatePlansPricing };