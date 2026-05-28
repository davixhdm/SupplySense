import { Router } from 'express';
import { getConnections, addConnection, testConnection, syncConnection, unsyncConnection, deleteConnection } from '../../controllers/client/erpController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getConnections);
router.post('/', clientAuthMiddleware, addConnection);
router.post('/:id/test', clientAuthMiddleware, testConnection);
router.post('/:id/sync', clientAuthMiddleware, syncConnection);
router.post('/:id/unsync', clientAuthMiddleware, unsyncConnection);
router.delete('/:id', clientAuthMiddleware, deleteConnection);

export default router;