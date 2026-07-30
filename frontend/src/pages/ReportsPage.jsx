import React, { useState } from 'react';
import API from '../services/api';
import { FileBarChart, Download, FileSpreadsheet, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportsPage = () => {
  const [downloading, setDownloading] = useState('');

  const handleExportPDF = async (type) => {
    setDownloading(`pdf_${type}`);
    try {
      const res = await API.get(`/reports/${type}`);
      const data = res.data;

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Official Academic Report - ${type.toUpperCase()}`, 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

      if (data && data.length > 0) {
        const keys = Object.keys(data[0]).filter(k => k !== '_id' && k !== '__v' && k !== 'password');
        const head = [keys.map(k => k.toUpperCase())];
        const body = data.map(item => keys.map(k => String(item[k] ?? '')));

        doc.autoTable({
          startY: 34,
          head,
          body,
          theme: 'striped',
          headStyles: { fillColor: [37, 99, 235] }
        });
      }

      doc.save(`${type}_academic_report.pdf`);
    } catch (err) {
      alert(`Error exporting ${type} PDF: ` + err.message);
    } finally {
      setDownloading('');
    }
  };

  const handleExportExcel = async (type) => {
    setDownloading(`excel_${type}`);
    try {
      const res = await API.get(`/reports/${type}`);
      const data = res.data;

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, type.toUpperCase());

      XLSX.writeFile(workbook, `${type}_academic_report.xlsx`);
    } catch (err) {
      alert(`Error exporting ${type} Excel: ` + err.message);
    } finally {
      setDownloading('');
    }
  };

  const reportModules = [
    { type: 'students', title: 'Students Master Directory', desc: 'Complete list of registered students, department info, and contact details.' },
    { type: 'attendance', title: 'Attendance Audit Logs', desc: 'Daily class attendance logs, present/absent history, and monthly totals.' },
    { type: 'marks', title: 'Marks & Academic Results', desc: 'Semester-wise marks, GPA evaluation scores, and internal/external grades.' },
    { type: 'fees', title: 'Fee Transactions & Receipts', desc: 'Payment transactions, collected amounts, outstanding dues, and payment methods.' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reports & Data Exporter</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate and download official PDF and Excel reports for institution audit.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportModules.map((module) => (
          <div
            key={module.type}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-lg mb-4">
                <FileBarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{module.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{module.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
              <button
                onClick={() => handleExportPDF(module.type)}
                disabled={downloading === `pdf_${module.type}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition"
              >
                <FileText className="w-4 h-4" />
                <span>{downloading === `pdf_${module.type}` ? 'Generating...' : 'Export PDF'}</span>
              </button>

              <button
                onClick={() => handleExportExcel(module.type)}
                disabled={downloading === `excel_${module.type}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{downloading === `excel_${module.type}` ? 'Exporting...' : 'Export Excel'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
