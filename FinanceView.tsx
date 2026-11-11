import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  X, 
  Check, 
  AlertCircle,
  Receipt,
  Download,
  IndianRupee,
  QrCode
} from 'lucide-react';
import { FeeInvoice, Student } from '../types/school';
import { ASSETS } from '../data/assets';

interface FinanceViewProps {
  invoices: FeeInvoice[];
  students: Student[];
  onAddInvoice: (invoice: FeeInvoice) => void;
  onRecordPayment: (invoiceId: string, amount: number) => void;
  isGenerateModalOpen: boolean;
  setIsGenerateModalOpen: (open: boolean) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  invoices,
  students,
  onAddInvoice,
  onRecordPayment,
  isGenerateModalOpen,
  setIsGenerateModalOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Payment Modal
  const [paymentInvoice, setPaymentInvoice] = useState<FeeInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Net Banking (NEFT/RTGS)' | 'Demand Draft' | 'Cheque'>('UPI');
  const [upiRefId, setUpiRefId] = useState('UPI-' + Math.floor(1000000000 + Math.random() * 9000000000));

  // Receipt Modal
  const [receiptInvoice, setReceiptInvoice] = useState<FeeInvoice | null>(null);

  // New Invoice form
  const [newInvoiceStudentId, setNewInvoiceStudentId] = useState(students[0]?.id || '');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState(38500);
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState('2026-11-25');
  const [newInvoiceDesc, setNewInvoiceDesc] = useState('Quarter 4 Tuition & Laboratory Development Fund');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inv.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Aggregates
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const outstanding = totalBilled - totalCollected;
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice || paymentAmount <= 0) return;
    onRecordPayment(paymentInvoice.id, paymentAmount);
    setPaymentInvoice(null);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newInvoiceStudentId) || students[0];
    const invoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `DPIA-FEE-2026-Q4-${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      grade: `${student.class || `Class ${student.grade}`} - ${student.section}`,
      term: 'Quarter 4 (Jan - Mar 2027)',
      issueDate: '2026-11-06',
      dueDate: newInvoiceDueDate,
      totalAmount: Number(newInvoiceAmount),
      amountPaid: 0,
      status: 'Pending',
      items: [
        { description: newInvoiceDesc, amount: Number(newInvoiceAmount) }
      ]
    };

    onAddInvoice(invoice);
    setIsGenerateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Accounts & Fee Collection Office</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
              INR (₹) Ledger
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Delhi Public International Academy · Pushp Vihar, New Delhi · UPI, NEFT & NetBanking
          </p>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue Term Fee Challan</span>
        </button>
      </div>

      {/* Financial Metrics in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Fee Billed (YTD)</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-2 block">
            ₹{totalBilled.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500">Gross Term Assessment</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Fee Realized & Deposited</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2 block">
            ₹{totalCollected.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {((totalCollected / (totalBilled || 1)) * 100).toFixed(1)}% Realized in Bank
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Outstanding Dues</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-700 dark:text-slate-300 mt-2 block">
            ₹{outstanding.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500">Quarter 3 & 4 Pending</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Overdue Defaulters</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-2 block">
            {overdueCount} Scholars
          </span>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Auto-SMS reminder dispatched</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Challan/Invoice No or Scholar Name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {['all', 'paid', 'partial', 'pending', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                selectedStatus === status
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Invoice Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
            No fee challans found matching criteria.
          </div>
        ) : (
          filteredInvoices.map((inv) => {
            const balance = inv.totalAmount - inv.amountPaid;
            return (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
                      {inv.invoiceNo}
                    </span>
                    <span className="text-[11px] text-slate-400">Due {inv.dueDate}</span>
                  </div>

                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                    inv.status === 'Paid'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : inv.status === 'Partial'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : inv.status === 'Overdue'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {inv.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {inv.studentName}
                  </h4>
                  <p className="text-[11px] text-slate-400">{inv.grade} · {inv.term}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Deposited</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ₹{inv.amountPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Balance</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      ₹{balance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => {
                        setPaymentInvoice(inv);
                        setPaymentAmount(inv.totalAmount - inv.amountPaid);
                      }}
                      className="flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Collect Fee</span>
                    </button>
                  )}
                  <button
                    onClick={() => setReceiptInvoice(inv)}
                    className="flex-1 min-h-[40px] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Invoices Table (>= md) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Challan No & Due Date</th>
                <th className="py-3 px-4">Scholar Details</th>
                <th className="py-3 px-4 text-right">Fee Billed</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No billing records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const balance = inv.totalAmount - inv.amountPaid;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {inv.invoiceNo}
                        </span>
                        <span className="text-[11px] text-slate-400">Due: {inv.dueDate}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {inv.studentName}
                        </span>
                        <span className="text-[11px] text-slate-400">{inv.grade} · {inv.term}</span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        ₹{inv.totalAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                        ₹{inv.amountPaid.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
                        ₹{balance.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : inv.status === 'Partial'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : inv.status === 'Overdue'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== 'Paid' && (
                            <button
                              onClick={() => {
                                setPaymentInvoice(inv);
                                setPaymentAmount(inv.totalAmount - inv.amountPaid);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded transition-colors"
                            >
                              Collect Fee
                            </button>
                          )}
                          <button
                            onClick={() => setReceiptInvoice(inv)}
                            className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Official CBSE Fee Receipt"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL (WITH INDIAN UPI / NETBANKING) */}
      {paymentInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Record Fee Collection
                </h3>
                <p className="text-xs text-slate-500">
                  {paymentInvoice.invoiceNo} · {paymentInvoice.studentName}
                </p>
              </div>
              <button
                onClick={() => setPaymentInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Collection Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={paymentInvoice.totalAmount - paymentInvoice.amountPaid}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 font-mono text-base font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Remaining balance due: ₹{(paymentInvoice.totalAmount - paymentInvoice.amountPaid).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm / BHIM)</option>
                  <option value="Net Banking (NEFT/RTGS)">Net Banking (NEFT / RTGS / IMPS)</option>
                  <option value="Demand Draft">Demand Draft (DD - Drawn on DPIA)</option>
                  <option value="Cheque">Account Payee Cheque</option>
                </select>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-1">
                  <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200 font-semibold">
                    <span>Virtual Payment Address:</span>
                    <span className="font-mono text-[11px]">dpia.fees@sbi</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Transaction UTR Ref:</span>
                    <span className="font-mono font-semibold">{upiRefId}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL CBSE FEE RECEIPT MODAL */}
      {receiptInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="no-print p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Official School Fee Receipt & Challan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setReceiptInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Document */}
            <div className="p-8 bg-white text-slate-950 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
                <div className="flex items-center gap-3">
                  <img 
                    src={ASSETS.schoolCrest} 
                    alt="Delhi Public International Academy Crest" 
                    className="w-14 h-14 rounded-full border border-amber-600 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="font-serif font-black text-lg text-slate-950">DELHI PUBLIC INTERNATIONAL ACADEMY</h2>
                    <p className="text-xs text-slate-600 font-medium">Affiliated to CBSE, New Delhi (Affiliation No: 2130894)</p>
                    <p className="text-[11px] text-slate-500">Sector-IV, Pushp Vihar, New Delhi - 110017</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded block">
                    FEE RECEIPT #{receiptInvoice.invoiceNo}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Issue Date: {receiptInvoice.issueDate}</p>
                  <p className="text-[11px] text-slate-500">Session: 2026-2027</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs p-3.5 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Student Details:</span>
                  <span className="font-bold text-slate-950 text-sm">{receiptInvoice.studentName}</span>
                  <span className="text-slate-600 block">{receiptInvoice.grade}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Term: {receiptInvoice.term}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Payment Status:</span>
                  <span className="font-bold text-emerald-700 text-sm block">{receiptInvoice.status}</span>
                  <span className="text-slate-600 block">Due Date: {receiptInvoice.dueDate}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">Payment Mode: NetBanking / UPI</span>
                </div>
              </div>

              {/* Items */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Fee Head & Description</th>
                      <th className="p-2.5 text-right">Amount (₹ INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receiptInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">{item.description}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-semibold">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-900 font-bold bg-slate-50">
                    <tr>
                      <td className="p-2.5">Total Assessment</td>
                      <td className="p-2.5 text-right font-mono">₹{receiptInvoice.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="text-emerald-700">
                      <td className="p-2.5">Amount Realized / Paid</td>
                      <td className="p-2.5 text-right font-mono">₹{receiptInvoice.amountPaid.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className="text-slate-700">
                      <td className="p-2.5">Balance Outstanding</td>
                      <td className="p-2.5 text-right font-mono">₹{(receiptInvoice.totalAmount - receiptInvoice.amountPaid).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                <span>Authorized Financial Seal & Signature · DPIA Accounts</span>
                <span className="font-serif italic text-slate-800 font-semibold">Bursar & Accounts Officer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE NEW FEE CHALLAN MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issue Term Fee Challan
                </h3>
                <p className="text-xs text-slate-500">
                  Assign School Tuition & Bus Transport Assessment
                </p>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select Scholar *</label>
                <select
                  value={newInvoiceStudentId}
                  onChange={(e) => setNewInvoiceStudentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (Roll: {s.rollNo} · {s.class || `Class ${s.grade}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Fee Description *</label>
                <input
                  type="text"
                  required
                  value={newInvoiceDesc}
                  onChange={(e) => setNewInvoiceDesc(e.target.value)}
                  placeholder="e.g. Quarter 4 Tuition & Computer/Robotics Lab Levy"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Total Fee (₹ INR) *</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={newInvoiceAmount}
                    onChange={(e) => setNewInvoiceAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newInvoiceDueDate}
                    onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Generate Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
