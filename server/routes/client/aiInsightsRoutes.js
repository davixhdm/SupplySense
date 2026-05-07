import { Router } from 'express';
import { getGeneralInsights, searchInsights, getPrediction } from '../../controllers/client/aiInsightsController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['ai_insights']), getGeneralInsights);
router.get('/search', clientAuthMiddleware, planAccessMiddleware(['ai_insights']), searchInsights);
router.get('/prediction', clientAuthMiddleware, planAccessMiddleware(['ai_insights']), getPrediction);

export default router;