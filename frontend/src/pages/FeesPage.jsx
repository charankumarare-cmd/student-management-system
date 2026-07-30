import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { CreditCard, DollarSign, Plus, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';

const FeesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Online');

  const [newFeeData, setNewFeeData] = useState({
    studentId: '',
    title: 'Tuition Fee - Fall Semester',
    amount: 2500,
    dueDate: '2026-08-30'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feeRes, sumRes, stdRes] = await Promise.all([
        API.get('/fees', { params: { status: statusFilter } }),
        API.get('/fees/summary'),
        API.get('/students')
      ]);
      setFees(feeRes.data);
      setSummary(sumRes.data);
      setStudents(stdRes.data);
    } catch (err) {
      console.error('Error fetching fees data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleOpenPay = (fee) => {
    setSelectedFee(fee);
    setPayAmount(fee.amount - fee.paidAmount);
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/fees/${selectedFee._id}/pay`, {
        paidAmount: payAmount,
        paymentMethod: payMethod
      });
      setIsPayModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording payment');
    }
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      const std = students.find(s => s.studentId === newFeeData.studentId);
      await API.post('/fees', {
        ...newFeeData,
        studentName: std ? std.name : 'Student',
        department: std ? std.department : 'General'
      });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Error creating fee record');
    }
  };

  const downloadReceiptPDF = (fee) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('OFFICIAL COLLEGE FEE RECEIPT', 14, 22);
    doc.setFontSize(10);
    doc.text(`Receipt ID: ${fee.transactionId || 'TXN-OFFICIAL'}`, 14, 30);
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 14, 36);

    doc.autoTable({
      startY: 44,
      head: [['Student Name', 'ID', 'Department', 'Fee Description', 'Total', 'Paid Amount', 'Status']],
      body: [[
        fee.studentName,
        fee.studentId,
        fee.department || 'General',
        fee.title,
        `$${fee.amount}`,
        `$${fee.paidAmount}`,
        fee.status
      ]],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.text('Thank you for your payment.', 14, doc.lastAutoTable.finalY + 15);
    doc.save(`fee_receipt_${fee.studentId}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Fee Collections & Invoices</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track tuition fee structures, record payments, and issue official receipts.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Fee Invoice</span>
          </button>
        )}
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <p className="text-xs font-bold uppercase tracking-wider">Total Collected</p>
          <h3 className="text-3xl font-extrabold mt-1">${summary.totalCollected || 0}</h3>
        </div>
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
          <p className="text-xs font-bold uppercase tracking-wider">Total Pending</p>
          <h3 className="text-3xl font-extrabold mt-1">${summary.totalPending || 0}</h3>
        </div>
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
          <p className="text-xs font-bold uppercase tracking-wider">Total Invoiced</p>
          <h3 className="text-3xl font-extrabold mt-1">${summary.totalInvoiced || 0}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase">Payment Status Filter</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-white font-semibold"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Fees Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading fee records...</div>
        ) : fees.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No fee records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Fee Details</th>
                  <th className="px-6 py-4">Amount / Paid</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{fee.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{fee.studentId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{fee.title}</td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 dark:text-white">${fee.amount}</span>
                      <span className="block text-[11px] text-emerald-500">Paid: ${fee.paidAmount}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{fee.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                        fee.status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {fee.status !== 'Paid' && (
                          <button
                            onClick={() => handleOpenPay(fee)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                          >
                            Record Pay
                          </button>
                        )}
                        {fee.paidAmount > 0 && (
                          <button
                            onClick={() => downloadReceiptPDF(fee)}
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition"
                            title="Download Official Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {selectedFee && (
        <Modal
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          title={`Record Payment for ${selectedFee.studentName}`}
        >
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
              <p><strong className="text-slate-400">Invoice:</strong> {selectedFee.title}</p>
              <p><strong className="text-slate-400">Total Amount:</strong> ${selectedFee.amount}</p>
              <p><strong className="text-slate-400">Remaining Balance:</strong> ${selectedFee.amount - selectedFee.paidAmount}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Amount ($)</label>
              <input
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
              >
                <option value="Online">Online / Credit Card</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
                <option value="Cash">Cash Counter</option>
                <option value="UPI">UPI Payment</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Generate Fee Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Generate New Fee Invoice"
      >
        <form onSubmit={handleCreateFee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Student</label>
            <select
              required
              value={newFeeData.studentId}
              onChange={(e) => setNewFeeData({ ...newFeeData, studentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s._id} value={s.studentId}>{s.name} ({s.studentId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Description</label>
            <input
              type="text"
              required
              value={newFeeData.title}
              onChange={(e) => setNewFeeData({ ...newFeeData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Fee Amount ($)</label>
              <input
                type="number"
                required
                value={newFeeData.amount}
                onChange={(e) => setNewFeeData({ ...newFeeData, amount: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={newFeeData.dueDate}
                onChange={(e) => setNewFeeData({ ...newFeeData, dueDate: e.target.value })}
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
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeesPage;
