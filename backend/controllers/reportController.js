import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Mark from '../models/Mark.js';
import Fee from '../models/Fee.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';
import ExcelJS from 'exceljs';

export const getReportData = async (req, res) => {
  try {
    const { type } = req.params; // 'students', 'attendance', 'marks', 'fees'

    if (getIsInMemory()) {
      if (type === 'students') return res.json(mockData.students);
      if (type === 'attendance') return res.json(mockData.attendance);
      if (type === 'marks') return res.json(mockData.marks);
      if (type === 'fees') return res.json(mockData.fees);
      return res.status(400).json({ message: 'Invalid report type' });
    }

    if (type === 'students') {
      const data = await Student.find();
      return res.json(data);
    } else if (type === 'attendance') {
      const data = await Attendance.find();
      return res.json(data);
    } else if (type === 'marks') {
      const data = await Mark.find();
      return res.json(data);
    } else if (type === 'fees') {
      const data = await Fee.find();
      return res.json(data);
    }

    res.status(400).json({ message: 'Invalid report type' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    if (getIsInMemory()) {
      data = mockData[type] || [];
    } else {
      if (type === 'students') data = await Student.find().lean();
      else if (type === 'attendance') data = await Attendance.find().lean();
      else if (type === 'marks') data = await Mark.find().lean();
      else if (type === 'fees') data = await Fee.find().lean();
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(type.toUpperCase());

    if (data.length > 0) {
      const headers = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v' && k !== 'password');
      worksheet.columns = headers.map(h => ({ header: h.toUpperCase(), key: h, width: 20 }));
      data.forEach(row => worksheet.addRow(row));
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
