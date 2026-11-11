import React, { useState, useRef } from 'react';
import { 
  Printer, 
  X, 
  Award, 
  FileCheck, 
  Building2, 
  CheckCircle2,
  Calendar,
  Download
} from 'lucide-react';
import { Student } from '../types/school';
import { ASSETS } from '../data/assets';
import { downloadElementAsPDF } from '../utils/pdfExport';

interface TransferCertificateModalProps {
  student: Student;
  onClose: () => void;
}

export const TransferCertificateModal: React.FC<TransferCertificateModalProps> = ({
  student,
  onClose
}) => {
  const tcSheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const tcSerial = `DPIA/TC/2026-27/${student.admissionNo.split('/').pop() || '108'}`;
  const currentDate = '06-11-2026';

  const handleDownloadPDF = async () => {
    if (!tcSheetRef.current) return;
    setIsExporting(true);
    try {
      await downloadElementAsPDF(tcSheetRef.current, {
        filename: `Transfer_Certificate_${student.firstName}_${student.lastName}_${student.admissionNo.replace(/\//g, '_')}.pdf`,
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
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block sm:inline truncate">
                CBSE School Leaving Certificate (TC)
              </span>
              <span className="text-slate-400 hidden sm:inline"> · </span>
              <span className="text-[11px] font-mono text-slate-500 block sm:inline truncate">
                {student.firstName} {student.lastName} · {tcSerial}
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

        {/* Printable Official Transfer Certificate Sheet */}
        <div className="p-3 sm:p-8 overflow-y-auto max-h-[85vh] bg-slate-100/50 dark:bg-slate-950/50 flex justify-center">
          <div ref={tcSheetRef} className="w-full max-w-2xl bg-[#fcfaf4] text-slate-950 border-4 border-double border-slate-900 p-4 sm:p-10 relative shadow-sm text-xs space-y-4">
            {/* Header Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <div className="flex items-center justify-center gap-3">
                <img 
                  src={ASSETS.schoolCrest} 
                  alt="DPIA Emblem" 
                  className="w-16 h-16 rounded-full border border-amber-600 object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight uppercase">
                    Delhi Public International Academy
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Sector-IV, Institutional Area, Pushp Vihar, New Delhi - 110017
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono">
                    Affiliated to CBSE, New Delhi · Affiliation No: <strong>2130894</strong> · School Code: <strong>70142</strong>
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <span className="inline-block border-2 border-slate-900 bg-slate-900 text-white font-serif font-bold text-xs uppercase px-4 py-1 tracking-widest">
                  School Leaving / Transfer Certificate
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-700 pt-2 border-t border-slate-300">
                <span>Book No.: <strong>04/2026</strong></span>
                <span>S.R. No.: <strong>{student.admissionNo.split('/').pop() || '108'}</strong></span>
                <span>TC Serial: <strong>{tcSerial}</strong></span>
              </div>
            </div>

            {/* Official 20-Point CBSE Annexure */}
            <div className="space-y-2.5 pt-2 text-slate-900 leading-relaxed">
              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">1. Name of the Pupil:</span>
                <span className="font-bold uppercase font-serif text-sm">{student.firstName} {student.lastName}</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">2. Mother's Name:</span>
                <span className="font-bold">{student.motherName || 'Prof. Anjali Sharma'}</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">3. Father's / Guardian's Name:</span>
                <span className="font-bold">{student.fatherName || student.guardianName}</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">4. Nationality:</span>
                <span className="font-bold">Indian</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">5. Date of First Admission in School with Class:</span>
                <span className="font-bold">{student.enrollmentDate} in Class 9</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">6. Date of Birth (in figures and words):</span>
                <span className="font-bold">{student.dob} (Fourteenth April Two Thousand Eight)</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">7. Class in which the pupil last studied:</span>
                <span className="font-bold font-serif">{student.class || `Class ${student.grade}`} ({student.stream})</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">8. School / Board Annual Examination last taken:</span>
                <span className="font-bold">CBSE All India Senior School Certificate Exam (AISSE/SSCE)</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">9. Whether qualified for promotion to higher class:</span>
                <span className="font-bold text-emerald-800">Yes, Qualified with Distinction (A1)</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">10. Month up to which school dues have been paid:</span>
                <span className="font-bold text-emerald-800">Fully Paid (Nil Outstanding Dues)</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">11. Total No. of Working Days in the Academic Session:</span>
                <span className="font-bold font-mono">192 Days</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">12. Total No. of Working Days pupil present in the school:</span>
                <span className="font-bold font-mono">188 Days ({student.attendanceRate}%)</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">13. Games played / extra-curricular activities:</span>
                <span className="font-bold">Captain, School Robotics & Quizzing Society</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">14. General Conduct & Discipline:</span>
                <span className="font-bold text-emerald-800 font-serif">Exemplary</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">15. Date of application for certificate:</span>
                <span className="font-mono">04-11-2026</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">16. Date of issue of certificate:</span>
                <span className="font-mono">{currentDate}</span>
              </div>

              <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                <span className="text-slate-600 font-medium">17. Reasons for leaving the school:</span>
                <span className="font-bold">Higher Collegiate Studies / Parent Transfer</span>
              </div>
            </div>

            {/* Tripartite Signatures with School Stamp */}
            <div className="pt-8 mt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 items-end text-center">
              <div>
                <p className="font-serif italic text-sm border-b border-slate-800 pb-0.5 inline-block w-28">
                  Sunita D.
                </p>
                <p className="text-[10px] font-bold uppercase mt-1">Prepared By (Class Teacher)</p>
              </div>

              <div>
                <div className="w-16 h-16 rounded-full border-2 border-amber-700/80 p-0.5 mx-auto flex flex-col items-center justify-center bg-amber-50 shadow-inner">
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
                <p className="text-[10px] font-bold uppercase mt-1">Principal & Member Sec.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
