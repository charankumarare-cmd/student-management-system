import express from 'express';
import { getReportData, exportExcel } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:type', protect, getReportData);
router.get('/export/excel/:type', protect, exportExcel);

export default router;
