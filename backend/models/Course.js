import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true, default: 3 },
    semester: { type: String, default: '1st Semester' },
    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    assignedTeacherName: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
