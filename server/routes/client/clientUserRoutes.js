import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../../controllers/client/clientUserController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, getUsers);
router.get('/:id', clientAuthMiddleware, getUserById);
router.post('/', clientAuthMiddleware, createUser);
router.put('/:id', clientAuthMiddleware, updateUser);
router.delete('/:id', clientAuthMiddleware, deleteUser);

export default router;