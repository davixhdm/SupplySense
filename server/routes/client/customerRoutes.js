import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, getCustomerStats } from '../../controllers/client/customerController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['customers']), getCustomers);
router.get('/stats', clientAuthMiddleware, planAccessMiddleware(['customers']), getCustomerStats);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['customers']), getCustomerById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['customers']), createCustomer);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['customers']), updateCustomer);
router.delete('/:id', clientAuthMiddleware, planAccessMiddleware(['customers']), deleteCustomer);

export default router;