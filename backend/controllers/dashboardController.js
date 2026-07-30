import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Notice from '../models/Notice.js';
import ActivityLog from '../models/ActivityLog.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const totalStudents = mockData.students.length;
      const totalTeachers = mockData.teachers.length;
      const totalCourses = mockData.courses.length;

      const attRecords = mockData.attendance;
      const attPresent = attRecords.filter(r => r.status === 'Present').length;
      const attendancePercentage = attRecords.length > 0 ? Number(((attPresent / attRecords.length) * 100).toFixed(1)) : 95;

      const fees = mockData.fees;
      const totalFeesCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
      const totalFeesPending = fees.reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);

      const recentActivities = mockData.activityLogs;
      const recentNotices = mockData.notices.slice(0, 5);

      // Department breakdown data for charts
      const deptCounts = mockData.students.reduce((acc, s) => {
        acc[s.department] = (acc[s.department] || 0) + 1;
        return acc;
      }, {});

      return res.json({
        stats: {
          totalStudents,
          totalTeachers,
          totalCourses,
          attendancePercentage,
          totalFeesCollected,
          totalFeesPending
        },
        departmentDistribution: Object.keys(deptCounts).map(dept => ({ name: dept, count: deptCounts[dept] })),
        attendanceTrends: [
          { month: 'Mon', percentage: 92 },
          { month: 'Tue', percentage: 94 },
          { month: 'Wed', percentage: 91 },
          { month: 'Thu', percentage: 96 },
          { month: 'Fri', percentage: 95 }
        ],
        feeAnalytics: {
          collected: totalFeesCollected,
          pending: totalFeesPending
        },
        recentActivities,
        recentNotices
      });
    }

    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalCourses = await Course.countDocuments();

    const attTotal = await Attendance.countDocuments();
    const attPresent = await Attendance.countDocuments({ status: 'Present' });
    const attendancePercentage = attTotal > 0 ? Number(((attPresent / attTotal) * 100).toFixed(1)) : 95;

    const fees = await Fee.find();
    const totalFeesCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
    const totalFeesPending = fees.reduce((acc, f) => acc + (f.amount - (f.paidAmount || 0)), 0);

    const recentActivities = await ActivityLog.find().sort({ createdAt: -1 }).limit(6);
    const recentNotices = await Notice.find().sort({ createdAt: -1 }).limit(5);

    const students = await Student.find();
    const deptCounts = students.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        attendancePercentage,
        totalFeesCollected,
        totalFeesPending
      },
      departmentDistribution: Object.keys(deptCounts).map(dept => ({ name: dept, count: deptCounts[dept] })),
      attendanceTrends: [
        { month: 'Mon', percentage: 92 },
        { month: 'Tue', percentage: 94 },
        { month: 'Wed', percentage: 91 },
        { month: 'Thu', percentage: 96 },
        { month: 'Fri', percentage: 95 }
      ],
      feeAnalytics: {
        collected: totalFeesCollected,
        pending: totalFeesPending
      },
      recentActivities,
      recentNotices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
