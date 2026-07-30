import express from 'express';
import { getDashboardAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', protect, getDashboardAnalytics);

export default router;
