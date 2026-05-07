import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, adjustStock, deleteProduct, getCategories, getLowStockProducts } from '../../controllers/client/inventoryController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['inventory']), getProducts);
router.get('/categories', clientAuthMiddleware, planAccessMiddleware(['inventory']), getCategories);
router.get('/low-stock', clientAuthMiddleware, planAccessMiddleware(['inventory']), getLowStockProducts);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['inventory']), getProductById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['inventory']), createProduct);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['inventory']), updateProduct);
router.put('/:id/stock', clientAuthMiddleware, planAccessMiddleware(['inventory']), adjustStock);
router.delete('/:id', clientAuthMiddleware, planAccessMiddleware(['inventory']), deleteProduct);

export default router;