import { Router } from 'express';
import { chat } from '../../controllers/client/landingController.js';

const router = Router();

router.post('/chat', chat);

export default router;