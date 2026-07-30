import express from 'express';
import { getFees, createFeeRecord, recordPayment, getFeeSummary } from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getFees);
router.post('/', protect, authorize('admin'), createFeeRecord);
router.post('/:id/pay', protect, recordPayment);
router.get('/summary', protect, getFeeSummary);

export default router;
