import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/roleCheck';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport
} from '../controllers/report.controller';

const router = express.Router();

// Public routes
router.post('/', authenticateToken, createReport);

// Admin routes
router.get('/', authenticateToken, isAdmin, getReports);
router.get('/:id', authenticateToken, isAdmin, getReportById);
router.patch('/:id/status', authenticateToken, isAdmin, updateReportStatus);
router.delete('/:id', authenticateToken, isAdmin, deleteReport);

export default router;