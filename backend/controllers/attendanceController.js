import Attendance from '../models/Attendance.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getAttendance = async (req, res) => {
  try {
    const { studentId, date, courseCode } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.attendance];
      if (studentId) filtered = filtered.filter(a => a.studentId === studentId);
      if (date) filtered = filtered.filter(a => a.date === date);
      if (courseCode) filtered = filtered.filter(a => a.courseCode === courseCode);
      return res.json(filtered);
    }

    let query = {};
    if (studentId) query.studentId = studentId;
    if (date) query.date = date;
    if (courseCode) query.courseCode = courseCode;

    const records = await Attendance.find(query);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body; // Array of { studentId, studentName, courseCode, date, status }

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ message: 'No attendance records provided' });
    }

    if (getIsInMemory()) {
      attendanceRecords.forEach(rec => {
        const existingIdx = mockData.attendance.findIndex(
          a => a.studentId === rec.studentId && a.date === rec.date && a.courseCode === rec.courseCode
        );
        if (existingIdx !== -1) {
          mockData.attendance[existingIdx].status = rec.status;
        } else {
          mockData.attendance.push({
            _id: 'att_' + Date.now() + Math.random().toString(36).substr(2, 4),
            studentId: rec.studentId,
            studentName: rec.studentName || 'Student',
            courseCode: rec.courseCode || 'GENERAL',
            date: rec.date || new Date().toISOString().split('T')[0],
            status: rec.status || 'Present',
            markedBy: req.user?.role || 'Admin'
          });
        }
      });
      return res.json({ message: 'Attendance marked successfully' });
    }

    for (const rec of attendanceRecords) {
      await Attendance.findOneAndUpdate(
        { studentId: rec.studentId, date: rec.date, courseCode: rec.courseCode },
        {
          studentId: rec.studentId,
          studentName: rec.studentName,
          courseCode: rec.courseCode,
          date: rec.date,
          status: rec.status,
          markedBy: req.user?.role || 'Admin'
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const records = mockData.attendance;
      const total = records.length;
      const present = records.filter(r => r.status === 'Present').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 100;

      return res.json({ total, present, absent, percentage });
    }

    const total = await Attendance.countDocuments();
    const present = await Attendance.countDocuments({ status: 'Present' });
    const absent = await Attendance.countDocuments({ status: 'Absent' });
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 100;

    res.json({ total, present, absent, percentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
