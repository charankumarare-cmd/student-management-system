import express from 'express';
import { getAttendance, markAttendance, getAttendanceReport } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAttendance);
router.post('/mark', protect, authorize('admin', 'teacher'), markAttendance);
router.get('/report', protect, getAttendanceReport);

export default router;
