import express from 'express';
import {
  uploadCSVLeads,
  createLead,
  updateLeadStatus,
  getAllLeads,
  getLeadsByUser
} from '../controllers/leadController.js';
import { authMiddleware, adminOnly } from '../middleware/authMiddleware.js';
import { uploadCSV } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Admin routes
router.post('/upload-csv', adminOnly, uploadCSV.single('file'), uploadCSVLeads);
router.get('/all', adminOnly, getAllLeads);
router.post('/', adminOnly, createLead);

// User routes
router.get('/my-leads', getLeadsByUser);
router.put('/:id/status', updateLeadStatus);

export default router;
