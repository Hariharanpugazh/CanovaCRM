import express from 'express';
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkDeleteEmployees
} from '../controllers/employeeController.js';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/bulk-delete', bulkDeleteEmployees);

export default router;
