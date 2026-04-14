import express from 'express';
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkDeleteEmployees,
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getBreakLogs,
  getTodayAttendance,
  getRecentActivities
} from '../controllers/employeeController.js';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Employee-specific routes (available to all authenticated users)
router.post('/attendance/checkin', checkIn);
router.post('/attendance/checkout', checkOut);
router.post('/attendance/break-start', startBreak);
router.post('/attendance/break-end', endBreak);
router.get('/attendance/break-logs', getBreakLogs);
router.get('/attendance/today', getTodayAttendance);
router.get('/activities/recent', getRecentActivities);

// Admin-only routes
router.use(adminOnly);

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/bulk-delete', bulkDeleteEmployees);

export default router;
