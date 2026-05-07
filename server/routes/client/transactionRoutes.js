import { Router } from 'express';
import { getTransactions, getTransactionById, createTransaction, updateTransaction, getTransactionSummary } from '../../controllers/client/transactionController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['transactions']), getTransactions);
router.get('/summary', clientAuthMiddleware, planAccessMiddleware(['transactions']), getTransactionSummary);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['transactions']), getTransactionById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['transactions']), createTransaction);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['transactions']), updateTransaction);

export default router;