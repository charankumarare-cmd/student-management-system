import express from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('admin'), upload.single('photo'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorize('admin'), upload.single('photo'), updateStudent)
  .delete(protect, authorize('admin'), deleteStudent);

export default router;
