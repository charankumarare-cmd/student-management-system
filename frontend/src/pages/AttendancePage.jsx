import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Save, Sparkles } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [courseCode, setCourseCode] = useState('CS301');
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [stdRes, attRes] = await Promise.all([
        API.get('/students'),
        API.get('/attendance', { params: { date, courseCode } })
      ]);

      setStudents(stdRes.data);

      const map = {};
      stdRes.data.forEach(s => {
        const found = attRes.data.find(a => a.studentId === s.studentId);
        map[s.studentId] = found ? found.status : 'Present';
      });
      setAttendanceMap(map);
    } catch (err) {
      console.error('Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [date, courseCode]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const map = {};
    students.forEach(s => (map[s.studentId] = 'Present'));
    setAttendanceMap(map);
  };

  const handleSaveAttendance = async () => {
    setSaveStatus('Saving...');
    try {
      const records = students.map(s => ({
        studentId: s.studentId,
        studentName: s.name,
        courseCode,
        date,
        status: attendanceMap[s.studentId] || 'Present'
      }));

      await API.post('/attendance/mark', { attendanceRecords: records });
      setSaveStatus('Saved Successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Error saving attendance');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daily Attendance Register</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mark, view, and audit daily student class attendance.</p>
        </div>
        {canEdit && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleMarkAllPresent}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-xs transition"
            >
              Mark All Present
            </button>
            <button
              onClick={handleSaveAttendance}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
            >
              <Save className="w-4 h-4" />
              <span>Submit Attendance</span>
            </button>
          </div>
        )}
      </div>

      {saveStatus && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center">
          {saveStatus}
        </div>
      )}

      {/* Control Bar: Date & Course Pickers */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Attendance Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Course</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white font-semibold"
            >
              <option value="CS301">CS301 - Data Structures & Algorithms</option>
              <option value="CS302">CS302 - Web Engineering</option>
              <option value="EE201">EE201 - Digital Circuits</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs font-semibold">
          <div className="flex items-center space-x-2 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
            <span>Present: {Object.values(attendanceMap).filter(v => v === 'Present').length}</span>
          </div>
          <div className="flex items-center space-x-2 text-rose-500">
            <XCircle className="w-4 h-4" />
            <span>Absent: {Object.values(attendanceMap).filter(v => v === 'Absent').length}</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-500">
            <Clock className="w-4 h-4" />
            <span>Late: {Object.values(attendanceMap).filter(v => v === 'Late').length}</span>
          </div>
        </div>
      </div>

      {/* Register List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading register...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Department & Year</th>
                  <th className="px-6 py-4 text-center">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => {
                  const status = attendanceMap[student.studentId] || 'Present';
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img
                          src={student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{student.name}</span>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-blue-500">{student.studentId}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {student.department} ({student.year})
                      </td>
                      <td className="px-6 py-4 text-center">
                        {canEdit ? (
                          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl space-x-1">
                            <button
                              onClick={() => handleStatusChange(student.studentId, 'Present')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                status === 'Present' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.studentId, 'Absent')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                status === 'Absent' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.studentId, 'Late')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                status === 'Late' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' :
                            status === 'Absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
