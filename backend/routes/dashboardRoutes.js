import express from 'express';
import {
  getDashboardStats,
  getSalesGraph,
  getRecentActivities,
  getActiveSalesPeople,
  searchTeamMember
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);
router.get('/graph', getSalesGraph);
router.get('/activities', getRecentActivities);
router.get('/sales-people', getActiveSalesPeople);
router.get('/search-team', searchTeamMember);

export default router;
