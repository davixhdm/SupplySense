import { Router } from 'express';
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, recordPerformance, deactivateEmployee, getDepartmentPerformance } from '../../controllers/client/employeeController.js';
import clientAuthMiddleware from '../../middleware/client/clientAuthMiddleware.js';
import planAccessMiddleware from '../../middleware/client/planAccessMiddleware.js';

const router = Router();

router.get('/', clientAuthMiddleware, planAccessMiddleware(['employees']), getEmployees);
router.get('/departments', clientAuthMiddleware, planAccessMiddleware(['employees']), getDepartmentPerformance);
router.get('/:id', clientAuthMiddleware, planAccessMiddleware(['employees']), getEmployeeById);
router.post('/', clientAuthMiddleware, planAccessMiddleware(['employees']), createEmployee);
router.put('/:id', clientAuthMiddleware, planAccessMiddleware(['employees']), updateEmployee);
router.put('/:id/performance', clientAuthMiddleware, planAccessMiddleware(['employees']), recordPerformance);
router.delete('/:id', clientAuthMiddleware, planAccessMiddleware(['employees']), deactivateEmployee);

export default router;