import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Award, Plus, Search, FileText, Download, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';

const MarksPage = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'Data Structures & Algorithms',
    courseCode: 'CS301',
    semester: '1st Semester',
    internalMarks: 45,
    externalMarks: 45
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [marksRes, stdRes] = await Promise.all([
        API.get('/marks', { params: { studentId: selectedStudentId, semester: semesterFilter } }),
        API.get('/students')
      ]);
      setMarks(marksRes.data);
      setStudents(stdRes.data);
    } catch (err) {
      console.error('Error fetching marks data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStudentId, semesterFilter]);

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    try {
      const foundStudent = students.find(s => s.studentId === formData.studentId);
      await API.post('/marks/save', {
        ...formData,
        studentName: foundStudent ? foundStudent.name : 'Student'
      });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving marks');
    }
  };

  const downloadReportCard = (markItem) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('OFFICIAL ACADEMIC RESULT STATEMENT', 14, 22);
    doc.setFontSize(10);
    doc.text(`Student Name: ${markItem.studentName}`, 14, 32);
    doc.text(`Student ID: ${markItem.studentId}`, 14, 38);
    doc.text(`Semester: ${markItem.semester}`, 14, 44);

    doc.autoTable({
      startY: 52,
      head: [['Subject', 'Internal (50)', 'External (50)', 'Total (100)', 'Grade', 'GPA']],
      body: [[
        markItem.subject,
        markItem.internalMarks,
        markItem.externalMarks,
        markItem.total,
        markItem.grade,
        markItem.gpa
      ]],
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`result_${markItem.studentId}_${markItem.subject}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Marks & GPA Results</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Grade calculation, internal/external evaluations, and semester result sheets.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Subject Marks</span>
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3">
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-white font-medium flex-1"
        >
          <option value="">All Students</option>
          {students.map(s => (
            <option key={s._id} value={s.studentId}>{s.name} ({s.studentId})</option>
          ))}
        </select>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-white font-medium"
        >
          <option value="">All Semesters</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="3rd Semester">3rd Semester</option>
          <option value="5th Semester">5th Semester</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading evaluation scores...</div>
        ) : marks.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No marks entered for selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Internal (50)</th>
                  <th className="px-6 py-4">External (50)</th>
                  <th className="px-6 py-4">Total (100)</th>
                  <th className="px-6 py-4">Grade & GPA</th>
                  <th className="px-6 py-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {marks.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {m.studentName || m.studentId}
                      <span className="block text-[10px] text-slate-400 font-mono">{m.studentId}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                      {m.subject}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{m.internalMarks}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{m.externalMarks}</td>
                    <td className="px-6 py-4 font-extrabold text-sm text-slate-900 dark:text-white">{m.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black mr-2 ${
                        m.grade.startsWith('A') ? 'bg-emerald-500/10 text-emerald-500' :
                        m.grade.startsWith('B') ? 'bg-blue-500/10 text-blue-500' :
                        m.grade === 'F' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {m.grade}
                      </span>
                      <span className="text-slate-400 font-mono">{m.gpa} GPA</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => downloadReportCard(m)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition"
                        title="Download PDF Result Statement"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Subject Evaluation Marks"
      >
        <form onSubmit={handleSaveMarks} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Student</label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
            >
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s._id} value={s.studentId}>{s.name} ({s.studentId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Title</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Internal Marks (Max 50)</label>
              <input
                type="number"
                max={50}
                required
                value={formData.internalMarks}
                onChange={(e) => setFormData({ ...formData, internalMarks: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">External Marks (Max 50)</label>
              <input
                type="number"
                max={50}
                required
                value={formData.externalMarks}
                onChange={(e) => setFormData({ ...formData, externalMarks: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
            >
              Save Marks & Compute Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MarksPage;
