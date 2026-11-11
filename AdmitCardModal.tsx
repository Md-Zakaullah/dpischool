import React, { useState, useRef } from 'react';
import { 
  Printer, 
  X, 
  Award, 
  CheckCircle2, 
  Calendar,
  Building,
  ShieldCheck,
  FileText,
  Download
} from 'lucide-react';
import { Student } from '../types/school';
import { ASSETS } from '../data/assets';
import { downloadElementAsPDF } from '../utils/pdfExport';

interface AdmitCardModalProps {
  student: Student;
  onClose: () => void;
}

export const AdmitCardModal: React.FC<AdmitCardModalProps> = ({
  student,
  onClose
}) => {
  const admitCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const admitCardId = `CBSE/2027/DPIA/${student.rollNo || '12101'}`;
  const centerCode = '811042';
  const centerName = 'Kendriya Vidyalaya, Sector-VIII, R.K. Puram, New Delhi - 110022';

  const timetable = student.stream.includes('Commerce') ? [
    { code: 'ENG-301', name: 'English Core', date: '20-Feb-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'BST-054', name: 'Business Studies', date: '27-Feb-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'ACC-055', name: 'Accountancy', date: '08-Mar-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'ECON-030', name: 'Economics', date: '15-Mar-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'MATH-241', name: 'Applied Mathematics', date: '22-Mar-2027', time: '10:30 AM - 01:30 PM' },
  ] : [
    { code: 'ENG-301', name: 'English Core', date: '20-Feb-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'CHEM-043', name: 'Chemistry Theory', date: '26-Feb-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'PHYS-042', name: 'Physics Theory', date: '04-Mar-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'MATH-041', name: 'Mathematics', date: '12-Mar-2027', time: '10:30 AM - 01:30 PM' },
    { code: 'CS-083', name: 'Computer Science (Python & SQL)', date: '24-Mar-2027', time: '10:30 AM - 01:30 PM' },
  ];

  const handleDownloadPDF = async () => {
    if (!admitCardRef.current) return;
    setIsExporting(true);
    try {
      await downloadElementAsPDF(admitCardRef.current, {
        filename: `CBSE_Admit_Card_${student.firstName}_${student.lastName}_${student.rollNo || '12101'}.pdf`,
        orientation: 'portrait'
      });
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-2 sm:my-6 flex flex-col">
        {/* Top Control Toolbar */}
        <div className="no-print p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block sm:inline truncate">
                CBSE Board Examination Admit Card
              </span>
              <span className="text-slate-400 hidden sm:inline"> · </span>
              <span className="text-[11px] font-mono text-slate-500 block sm:inline truncate">
                Roll: {student.rollNo || '12101'} · {student.firstName} {student.lastName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              {isExporting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              className="min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Admit Card */}
        <div className="p-3 sm:p-8 overflow-y-auto max-h-[85vh] bg-slate-100/50 dark:bg-slate-950/50 flex justify-center">
          <div ref={admitCardRef} className="w-full max-w-2xl bg-white text-slate-950 border-2 border-slate-900 p-4 sm:p-8 relative shadow-sm text-xs space-y-4">
            {/* Header Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="flex items-center justify-between">
                <img 
                  src={ASSETS.schoolCrest} 
                  alt="DPIA Emblem" 
                  className="w-16 h-16 rounded-full border border-amber-600 object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="text-center">
                  <h1 className="text-lg sm:text-xl font-serif font-black uppercase tracking-tight">
                    Central Board of Secondary Education
                  </h1>
                  <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                    Senior School Certificate Examination (Session 2026-2027)
                  </h2>
                  <p className="text-[11px] font-semibold text-indigo-900 uppercase mt-0.5">
                    Official Candidate Hall Ticket / Admit Card
                  </p>
                </div>
                <div className="w-16 text-right">
                  <span className="text-[9px] font-mono font-bold block bg-slate-100 p-1 border border-slate-300">
                    AISSE/AISSCE
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 pt-2 border-t border-slate-200">
                <span>Admit Card ID: <strong>{admitCardId}</strong></span>
                <span>School Code: <strong>70142</strong></span>
                <span>Affiliation: <strong>2130894</strong></span>
              </div>
            </div>

            {/* Candidate Identity Dossier with Photo */}
            <div className="border border-slate-300 p-3.5 bg-slate-50/70 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">CBSE Roll Number</span>
                  <span className="text-sm font-mono font-black text-indigo-950">{student.rollNo || '12101'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Candidate's Name</span>
                  <span className="text-xs font-bold text-slate-900 uppercase">{student.firstName} {student.lastName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Father's Name</span>
                  <span className="text-xs font-medium text-slate-800">{student.fatherName || student.guardianName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mother's Name</span>
                  <span className="text-xs font-medium text-slate-800">{student.motherName || 'Prof. Anjali Sharma'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Class & Stream</span>
                  <span className="text-xs font-medium text-slate-800">{student.class || `Class ${student.grade}`} ({student.stream})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">School of Origin</span>
                  <span className="text-xs font-medium text-slate-800">Delhi Public Int. Academy (70142)</span>
                </div>
              </div>

              {/* Passport Photo Box */}
              <div className="w-24 h-28 border-2 border-slate-900 bg-white flex flex-col items-center justify-center text-center p-1 shrink-0">
                <span className="font-serif font-black text-2xl text-indigo-950">{student.firstName[0]}{student.lastName[0]}</span>
                <span className="text-[7px] uppercase font-bold text-slate-500 mt-1">Verified Photo</span>
                <span className="text-[6px] font-mono text-emerald-700 font-bold mt-0.5">LOC MATCHED</span>
              </div>
            </div>

            {/* Examination Center Information */}
            <div className="p-3 bg-amber-50/60 border border-amber-300 rounded text-xs space-y-1">
              <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wider block font-serif">
                Allotted Examination Center:
              </span>
              <p className="font-semibold text-slate-900">
                Center No. {centerCode} — {centerName}
              </p>
              <p className="text-[11px] text-slate-600">
                Reporting Time: <strong>09:30 AM</strong> (Gates close strictly at 10:00 AM)
              </p>
            </div>

            {/* Subject Examination Dates Table */}
            <div className="border border-slate-900 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold text-[10px] uppercase">
                    <th className="py-2 px-3">Sub Code</th>
                    <th className="py-2 px-3">Subject Name</th>
                    <th className="py-2 px-3">Date of Exam</th>
                    <th className="py-2 px-3">Timing</th>
                    <th className="py-2 px-3 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {timetable.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-indigo-950">{sub.code}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-800">{sub.date}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">{sub.time}</td>
                      <td className="py-2 px-3 text-center border-l border-slate-200">
                        <span className="h-5 w-20 inline-block border-b border-dashed border-slate-400"></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Candidate & Principal Dual Signatures */}
            <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 items-end text-center">
              <div>
                <span className="h-8 w-28 border-b border-slate-800 inline-block"></span>
                <p className="text-[10px] font-bold uppercase mt-1">Signature of Candidate</p>
              </div>

              <div>
                <div className="w-16 h-16 rounded-full border-2 border-amber-700/80 p-0.5 mx-auto flex flex-col items-center justify-center bg-amber-50">
                  <span className="text-[6px] font-bold uppercase tracking-widest text-amber-900">CBSE SEAL</span>
                  <span className="text-[7px] font-serif font-black text-amber-950">DPIA</span>
                  <span className="text-[5px] font-mono text-amber-800">AFFIL. 2130894</span>
                </div>
                <p className="text-[9px] uppercase font-bold text-slate-500 mt-1">School Seal</p>
              </div>

              <div>
                <p className="font-serif italic text-sm border-b border-slate-800 pb-0.5 inline-block w-28">
                  Nandita Sen
                </p>
                <p className="text-[10px] font-bold uppercase mt-1">Principal / Superintendent</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-[9px] text-slate-500 pt-2 border-t border-slate-200 leading-tight">
              <strong>Important:</strong> Candidates must wear full school uniform and carry their school ID card along with this original Admit Card. Electronic devices, smartwatches, and study materials are strictly prohibited inside the examination center.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
