import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, default: '' },
    subject: { type: String, required: true },
    courseCode: { type: String, default: '' },
    semester: { type: String, default: '1st Semester' },
    internalMarks: { type: Number, required: true, default: 0 },
    externalMarks: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    grade: { type: String, default: 'F' },
    gpa: { type: Number, default: 0.0 }
  },
  { timestamps: true }
);

const Mark = mongoose.model('Mark', markSchema);
export default Mark;
