import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, default: '' },
    department: { type: String, default: '' },
    title: { type: String, required: true }, // e.g. 'Tuition Fee - Semester 1'
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: String, required: true },
    paymentDate: { type: String, default: '' },
    status: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    paymentMethod: { type: String, default: 'Online' },
    transactionId: { type: String, default: '' }
  },
  { timestamps: true }
);

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
