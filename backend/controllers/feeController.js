import Fee from '../models/Fee.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getFees = async (req, res) => {
  try {
    const { studentId, status } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.fees];
      if (studentId) filtered = filtered.filter(f => f.studentId === studentId);
      if (status) filtered = filtered.filter(f => f.status.toLowerCase() === status.toLowerCase());
      return res.json(filtered);
    }

    let query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = new RegExp(status, 'i');

    const fees = await Fee.find(query);
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFeeRecord = async (req, res) => {
  try {
    const { studentId, studentName, department, title, amount, dueDate } = req.body;

    if (getIsInMemory()) {
      const newFee = {
        _id: 'fee_' + Date.now(),
        studentId,
        studentName: studentName || 'Student',
        department: department || 'General',
        title,
        amount: Number(amount),
        paidAmount: 0,
        dueDate,
        paymentDate: '',
        status: 'Pending',
        paymentMethod: '',
        transactionId: ''
      };
      mockData.fees.push(newFee);
      return res.status(201).json(newFee);
    }

    const fee = await Fee.create({
      studentId,
      studentName,
      department,
      title,
      amount: Number(amount),
      dueDate,
      status: 'Pending'
    });
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod } = req.body;

    if (getIsInMemory()) {
      const idx = mockData.fees.findIndex(f => f._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Fee record not found' });

      const fee = mockData.fees[idx];
      const newPaid = fee.paidAmount + Number(paidAmount);
      fee.paidAmount = newPaid;
      fee.paymentMethod = paymentMethod || 'Online';
      fee.paymentDate = new Date().toISOString().split('T')[0];
      fee.transactionId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

      if (newPaid >= fee.amount) {
        fee.status = 'Paid';
      } else if (newPaid > 0) {
        fee.status = 'Partial';
      }

      return res.json(fee);
    }

    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    fee.paidAmount += Number(paidAmount);
    fee.paymentMethod = paymentMethod || 'Online';
    fee.paymentDate = new Date().toISOString().split('T')[0];
    fee.transactionId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

    if (fee.paidAmount >= fee.amount) {
      fee.status = 'Paid';
    } else if (fee.paidAmount > 0) {
      fee.status = 'Partial';
    }

    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeeSummary = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const fees = mockData.fees;
      const totalCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
      const totalPending = fees.reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);
      const totalInvoiced = fees.reduce((acc, f) => acc + f.amount, 0);

      return res.json({ totalCollected, totalPending, totalInvoiced });
    }

    const fees = await Fee.find();
    const totalCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
    const totalPending = fees.reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);
    const totalInvoiced = fees.reduce((acc, f) => acc + f.amount, 0);

    res.json({ totalCollected, totalPending, totalInvoiced });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
