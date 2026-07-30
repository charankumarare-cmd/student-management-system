import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    qualification: { type: String, default: '' },
    subjects: [{ type: String }],
    designation: { type: String, default: 'Assistant Professor' }
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
