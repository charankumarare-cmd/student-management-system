import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true }, // e.g. '1st Year', '2nd Year', '3rd Year', '4th Year'
    section: { type: String, required: true }, // e.g. 'A', 'B', 'C'
    address: { type: String, default: '' },
    dob: { type: String, default: '' },
    photo: { type: String, default: '' },
    guardianName: { type: String, default: '' },
    guardianPhone: { type: String, default: '' }
  },
  { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
