import { Router } from 'express';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier, getSupplierPerformance } from '../../controllers/client/supplierController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['suppliers']), getSuppliers);
router.get('/performance', clientAuthMiddleware, planAccessMiddleware(['suppliers']), getSupplierPerformance);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['suppliers']), getSupplierById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['suppliers']), createSupplier);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['suppliers']), updateSupplier);
router.delete('/:id', clientAuthMiddleware, planAccessMiddleware(['suppliers']), deleteSupplier);

export default router;