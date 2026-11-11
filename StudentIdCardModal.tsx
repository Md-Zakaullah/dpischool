import React, { useState, useRef } from 'react';
import { 
  Printer, 
  X, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Droplet,
  Calendar,
  Building2,
  Download
} from 'lucide-react';
import { Student } from '../types/school';
import { ASSETS } from '../data/assets';
import { downloadElementAsPDF } from '../utils/pdfExport';

interface StudentIdCardModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  student,
  onClose
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [bloodGroup, setBloodGroup] = useState<'O+' | 'A+' | 'B+' | 'AB+' | 'O-'>('B+');

  const busRoute = student.stream.includes('PCM') ? 'Route 14 (Vasant Vihar)' : 'Route 7 (Golf Links)';

  const handleDownloadPDF = async () => {
    if (!cardContainerRef.current) return;
    setIsExporting(true);
    try {
      await downloadElementAsPDF(cardContainerRef.current, {
        filename: `Student_ID_Card_${student.firstName}_${student.lastName}_${student.rollNo || '12101'}.pdf`,
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-2 sm:my-6 flex flex-col">
        {/* Top Control Toolbar */}
        <div className="no-print p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block sm:inline truncate">
                RFID Smart Student ID Card
              </span>
              <span className="text-slate-400 hidden sm:inline"> · </span>
              <span className="text-[11px] font-mono text-slate-500 block sm:inline truncate">
                {student.firstName} {student.lastName} ({student.rollNo})
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

        {/* Printable ID Cards Preview */}
        <div ref={cardContainerRef} className="p-3 sm:p-6 md:p-8 space-y-6 overflow-y-auto flex-1 bg-slate-100/60 dark:bg-slate-950/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {/* FRONT OF ID CARD */}
            <div className="w-[320px] h-[480px] bg-white rounded-2xl shadow-xl border-2 border-indigo-900 overflow-hidden flex flex-col relative text-slate-900">
              {/* Lanyard Hole Punch Slot */}
              <div className="w-12 h-2.5 bg-slate-200 rounded-full mx-auto mt-2 border border-slate-300"></div>

              {/* Header Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-3.5 text-center mt-2 relative">
                <div className="flex items-center justify-center gap-2">
                  <img 
                    src={ASSETS.schoolCrest} 
                    alt="DPIA Emblem" 
                    className="w-10 h-10 rounded-full border border-amber-400/70 object-cover shadow-xs" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <h3 className="font-serif font-black text-xs uppercase leading-tight tracking-tight">
                      Delhi Public Int. Academy
                    </h3>
                    <p className="text-[9px] text-amber-300 uppercase tracking-wider font-semibold">
                      New Delhi · CBSE Affil. 2130894
                    </p>
                  </div>
                </div>
              </div>

              {/* Scholar Photo & Details */}
              <div className="p-4 flex-1 flex flex-col items-center text-center justify-between">
                {/* Photo Frame */}
                <div className="w-24 h-28 rounded-lg border-2 border-indigo-900 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center relative">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-200 flex flex-col items-center justify-center text-indigo-950 font-serif font-bold text-3xl">
                    {student.firstName[0]}{student.lastName[0]}
                    <span className="text-[8px] font-sans font-semibold tracking-wider text-slate-500 uppercase mt-1">PASSPORT PHOTO</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-950 uppercase tracking-tight">
                    {student.firstName} {student.lastName}
                  </h4>
                  <span className="text-xs font-semibold text-indigo-700 block mt-0.5">
                    {student.class || `Class ${student.grade}`} ({student.stream})
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {student.house}
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="w-full grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-left">
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">CBSE Roll No</span>
                    <span className="font-mono font-bold text-slate-900">{student.rollNo || '12101'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">Admission ID</span>
                    <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">Blood Group</span>
                    <span className="font-mono font-bold text-rose-700">{bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block font-semibold">Valid Thru</span>
                    <span className="font-mono font-bold text-slate-900">MARCH 2027</span>
                  </div>
                </div>

                {/* Signature Bar */}
                <div className="w-full pt-1 flex items-end justify-between text-[8px] text-slate-500 border-t border-slate-200">
                  <div className="text-left font-mono">
                    CARD ID: #{student.admissionNo.split('/').pop()}-2026
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic text-xs text-slate-900 block font-semibold">Dr. Nandita Sen</span>
                    <span className="uppercase text-[7px] font-bold tracking-widest text-slate-600">Principal Signature</span>
                  </div>
                </div>
              </div>

              {/* Bottom Strip */}
              <div className="bg-indigo-900 h-2 w-full"></div>
            </div>

            {/* BACK OF ID CARD */}
            <div className="w-[320px] h-[480px] bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden flex flex-col justify-between p-4 relative text-slate-900">
              {/* Lanyard Slot */}
              <div className="w-12 h-2.5 bg-slate-200 rounded-full mx-auto border border-slate-300"></div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 text-center border-b border-slate-200 pb-1.5">
                  Emergency & Residential Data
                </h4>

                <div className="space-y-2 mt-3 text-[10px] text-left">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase block">Father's / Mother's Name</span>
                    <span className="font-bold text-slate-900 text-xs">{student.fatherName || student.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase block">Emergency Mobile Phone</span>
                    <span className="font-mono font-bold text-slate-900">{student.guardianPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase block">School Bus Transport Route</span>
                    <span className="font-semibold text-indigo-700">{busRoute}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase block">Residential Address</span>
                    <span className="text-slate-700 leading-tight block">{student.address}</span>
                  </div>
                </div>
              </div>

              {/* Barcode & QR Code Section */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1.5">
                {/* Simulated Barcode */}
                <div className="h-8 w-full flex items-center justify-center space-x-1">
                  {[4,2,6,3,1,5,2,7,3,2,6,4,2,5,3,6,2,4,7,1,5,3,4,6].map((w, i) => (
                    <div key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }}></div>
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-600 block">
                  *{student.admissionNo.replace(/\//g, '')}*
                </span>
              </div>

              {/* Institutional Notice */}
              <div className="text-[8px] text-slate-500 leading-tight text-center border-t border-slate-200 pt-2">
                This smart card is the property of Delhi Public International Academy, Pushp Vihar, New Delhi - 110017. If found, please return to the School Gate 1 Reception or call +91 11 2956 8900.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
