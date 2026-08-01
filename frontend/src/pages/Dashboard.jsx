import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { AttendanceChart, DepartmentChart, FeeChart } from '../components/Charts';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  Calendar,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/dashboard/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const role = user?.role || 'student';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Role Banner */}
      <div className={`relative rounded-3xl p-8 text-white shadow-xl overflow-hidden ${
        role === 'admin' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' :
        role === 'teacher' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600' :
        'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
      }`}>
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{role.toUpperCase()} DASHBOARD</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{user?.name}</h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              {role === 'admin' && 'Central control panel for school analytics, faculty management, and system reports.'}
              {role === 'teacher' && 'Manage your assigned subjects, mark daily attendance, and submit student grades.'}
              {role === 'student' && 'View your GPA performance, attendance records, course schedule, and fee invoices.'}
            </p>
          </div>
          <div className="flex space-x-3">
            {role === 'admin' && (
              <>
                <Link to="/students" className="px-4 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow transition">
                  Manage Students
                </Link>
                <Link to="/reports" className="px-4 py-2.5 bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-xs rounded-xl border border-white/20 transition">
                  Export Reports
                </Link>
              </>
            )}
            {role === 'teacher' && (
              <>
                <Link to="/attendance" className="px-4 py-2.5 bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow transition">
                  Mark Attendance
                </Link>
                <Link to="/marks" className="px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-white/20 transition">
                  Enter Marks
                </Link>
              </>
            )}
            {role === 'student' && (
              <>
                <Link to="/marks" className="px-4 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow transition">
                  View Results
                </Link>
                <Link to="/timetable" className="px-4 py-2.5 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl border border-white/20 transition">
                  Class Schedule
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={stats.totalStudents || 0} icon={Users} color="blue" trend="+12%" subtext="Active Enrolled" />
          <StatCard title="Faculty Members" value={stats.totalTeachers || 0} icon={GraduationCap} color="purple" trend="+3" subtext="Across Departments" />
          <StatCard title="Courses Offered" value={stats.totalCourses || 0} icon={BookOpen} color="emerald" subtext="Active Semesters" />
          <StatCard title="Avg Attendance Rate" value={`${stats.attendancePercentage || 95}%`} icon={CalendarCheck} color="amber" trend="+2.4%" subtext="This Month" />
        </div>
      )}

      {role === 'teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Assigned Classes" value="3 Subjects" icon={BookOpen} color="emerald" subtext="CS301, CS302, AI" />
          <StatCard title="Total Students" value={stats.totalStudents || 0} icon={Users} color="blue" subtext="In Your Batches" />
          <StatCard title="Today's Attendance" value={`${stats.attendancePercentage || 94}%`} icon={CalendarCheck} color="amber" subtext="CS301 Morning" />
          <StatCard title="Pending Grading" value="12 Papers" icon={Award} color="purple" subtext="Semester 3 Evaluation" />
        </div>
      )}

      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Cumulative GPA" value="3.90 GPA" icon={Award} color="purple" trend="Grade A+" subtext="Semester 5" />
          <StatCard title="Attendance Rate" value="96.5%" icon={CalendarCheck} color="emerald" trend="+1.2%" subtext="Good Standing" />
          <StatCard title="Enrolled Courses" value="5 Subjects" icon={BookOpen} color="blue" subtext="Current Term" />
          <StatCard title="Fee Payment" value="Paid ($2500)" icon={DollarSign} color="amber" subtext="Fall 2026 Cleared" />
        </div>
      )}

      {/* Analytics Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Weekly Attendance Analytics</h3>
              <p className="text-xs text-slate-400">Class participation percentage breakdown</p>
            </div>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500 font-medium text-xs">
              Live Tracker
            </span>
          </div>
          <div className="h-64">
            <AttendanceChart data={data?.attendanceTrends} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Department Overview</h3>
              <p className="text-xs text-slate-400">Student enrollment distribution</p>
            </div>
          </div>
          <div className="h-64">
            <DepartmentChart data={data?.departmentDistribution} />
          </div>
        </div>
      </div>

      {/* Fee Overview & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Fee Collection Overview</h3>
              <p className="text-xs text-slate-400">Total collected vs outstanding fees</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Collected</span>
              <p className="text-base font-bold text-emerald-500">${stats.totalFeesCollected || 0}</p>
            </div>
          </div>
          <div className="h-56">
            <FeeChart collected={stats.totalFeesCollected} pending={stats.totalFeesPending} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Notice Board</h3>
              </div>
              <Link to="/notices" className="text-xs text-blue-500 font-semibold hover:underline flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentNotices?.map((notice) => (
                <div
                  key={notice._id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:border-blue-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      notice.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {notice.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-400">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1.5">{notice.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{notice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
