import express from 'express';
import { getMarks, addOrUpdateMarks, getStudentResults } from '../controllers/markController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMarks);
router.post('/save', protect, authorize('admin', 'teacher'), addOrUpdateMarks);
router.get('/student/:studentId', protect, getStudentResults);

export default router;
