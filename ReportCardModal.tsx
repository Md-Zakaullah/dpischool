import React, { useState, useRef } from 'react';
import { 
  Printer, 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles,
  FileCheck,
  ShieldCheck,
  Building2,
  Calendar,
  Download
} from 'lucide-react';
import { Student, GradeEntry } from '../types/school';
import { ASSETS } from '../data/assets';
import { downloadElementAsPDF, generateDirectReportCardPDF } from '../utils/pdfExport';

interface ReportCardModalProps {
  student: Student;
  grades: GradeEntry[];
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  grades,
  onClose
}) => {
  const [paperTheme, setPaperTheme] = useState<'parchment' | 'modern'>('parchment');
  const [isExporting, setIsExporting] = useState(false);
  const reportSheetRef = useRef<HTMLDivElement>(null);

  // Filter or default grades for this student
  const studentGrades = grades.filter(g => g.studentId === student.id);
  
  // If no grade entries exist for this student, provide realistic CBSE coursework based on stream
  const isCommerce = student.stream?.includes('Commerce');
  
  const defaultCBSEGrades: GradeEntry[] = isCommerce ? [
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-005',
      courseCode: 'ACC-055',
      courseName: 'Accountancy (CBSE 055)',
      term: 'Annual 2026-27',
      assignments: 20,
      midterm: 74,
      project: 19,
      finalExam: 75,
      totalScore: 94.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Exceptional proficiency in Partnership accounts and Cash Flow Statements.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-comm-2',
      courseCode: 'BST-054',
      courseName: 'Business Studies (CBSE 054)',
      term: 'Annual 2026-27',
      assignments: 19,
      midterm: 72,
      project: 20,
      finalExam: 73,
      totalScore: 92.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Impressive case analysis and understanding of financial management principles.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-comm-3',
      courseCode: 'ECON-030',
      courseName: 'Economics (CBSE 030)',
      term: 'Annual 2026-27',
      assignments: 18,
      midterm: 75,
      project: 19,
      finalExam: 76,
      totalScore: 94.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Clear graphical interpretation of macroeconomic equilibrium models.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-003',
      courseCode: 'ENG-301',
      courseName: 'English Core (CBSE 301)',
      term: 'Annual 2026-27',
      assignments: 20,
      midterm: 76,
      project: 20,
      finalExam: 75,
      totalScore: 95.5,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Commendable eloquence in analytical composition and seminar debates.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-comm-5',
      courseCode: 'MATH-241',
      courseName: 'Applied Mathematics (CBSE 241)',
      term: 'Annual 2026-27',
      assignments: 19,
      midterm: 70,
      project: 19,
      finalExam: 72,
      totalScore: 90.0,
      letterGrade: 'A2',
      gpa: 9.0,
      teacherRemarks: 'Consistent application of financial calculus and probability distributions.'
    }
  ] : [
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-001',
      courseCode: 'MATH-041',
      courseName: 'Mathematics (CBSE 041)',
      term: 'Annual 2026-27',
      assignments: 20,
      midterm: 78,
      project: 20,
      finalExam: 79,
      totalScore: 98.5,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Exceptional mathematical rigor in Differential Calculus & 3D Vector Geometry.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-002',
      courseCode: 'PHYS-042',
      courseName: 'Physics Theory & Lab (CBSE 042)',
      term: 'Annual 2026-27',
      assignments: 20,
      midterm: 76,
      project: 20,
      finalExam: 76,
      totalScore: 96.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Outstanding lab accuracy in Wave Optics & Semiconductor circuit analysis.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-004',
      courseCode: 'CHEM-043',
      courseName: 'Chemistry Theory & Practicals (CBSE 043)',
      term: 'Annual 2026-27',
      assignments: 19,
      midterm: 75,
      project: 20,
      finalExam: 76,
      totalScore: 95.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Superior mastery over Organic reaction mechanisms and Electrochemical cells.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-006',
      courseCode: 'CS-083',
      courseName: 'Computer Science with Python & SQL (CBSE 083)',
      term: 'Annual 2026-27',
      assignments: 20,
      midterm: 78,
      project: 20,
      finalExam: 79,
      totalScore: 98.5,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Mastery in Data Structures, SQL relational schema design, and algorithm optimization.'
    },
    {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: 'crs-003',
      courseCode: 'ENG-301',
      courseName: 'English Core (CBSE 301)',
      term: 'Annual 2026-27',
      assignments: 19,
      midterm: 74,
      project: 19,
      finalExam: 76,
      totalScore: 94.0,
      letterGrade: 'A1',
      gpa: 10.0,
      teacherRemarks: 'Refined comprehension and insightful prose in literary evaluations.'
    }
  ];

  const displayGrades = studentGrades.length > 0 ? studentGrades : defaultCBSEGrades;

  // Calculate cumulative scores
  const totalMaxMarks = displayGrades.length * 100;
  const totalObtained = displayGrades.reduce((acc, g) => acc + g.totalScore, 0);
  const percentage = (totalObtained / displayGrades.length).toFixed(1);
  const avgGpa = (displayGrades.reduce((acc, g) => acc + g.gpa, 0) / displayGrades.length).toFixed(1);
  const overallGrade = Number(percentage) >= 91 ? 'A1' : Number(percentage) >= 81 ? 'A2' : Number(percentage) >= 71 ? 'B1' : Number(percentage) >= 61 ? 'B2' : 'C1';
  const attendedDays = Math.round(((student.attendanceRate || 95) / 100) * 192);

  const documentSerial = `DPIA/CBSE/2026-27/${student.rollNo || student.admissionNo.split('/').pop() || '12101'}`;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      if (reportSheetRef.current) {
        const success = await downloadElementAsPDF(reportSheetRef.current, {
          filename: `CBSE_Report_Card_${student.firstName}_${student.lastName}_${student.rollNo || '12101'}.pdf`,
          orientation: 'portrait'
        });
        if (!success) {
          generateDirectReportCardPDF(student, displayGrades, overallGrade, percentage, attendedDays);
        }
      } else {
        generateDirectReportCardPDF(student, displayGrades, overallGrade, percentage, attendedDays);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      generateDirectReportCardPDF(student, displayGrades, overallGrade, percentage, attendedDays);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-2 sm:my-8 flex flex-col">
        {/* Top Control Toolbar (Hidden during Print) */}
        <div className="no-print p-3 sm:p-4 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block sm:inline truncate">
                Official CBSE Report Card
              </span>
              <span className="text-slate-400 hidden sm:inline"> · </span>
              <span className="text-[11px] font-mono text-slate-500 block sm:inline truncate">
                Roll: {student.rollNo || '12101'} · {student.firstName} {student.lastName}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Paper Theme Switcher */}
            <div className="hidden md:flex items-center gap-1 p-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-xs">
              <button
                onClick={() => setPaperTheme('parchment')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  paperTheme === 'parchment'
                    ? 'bg-amber-50 text-amber-900 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Parchment
              </button>
              <button
                onClick={() => setPaperTheme('modern')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  paperTheme === 'modern'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Modern
              </button>
            </div>

            {/* Direct Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              title="Download Official PDF File"
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
              className="min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
              aria-label="Close report card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Sheet */}
        <div className="overflow-y-auto max-h-[85vh] p-2 sm:p-6 md:p-8 print:p-0">
          <div 
            ref={reportSheetRef}
            className={`
            w-full border-2 border-slate-900 p-3.5 sm:p-8 relative shadow-sm
            ${paperTheme === 'parchment' ? 'bg-[#fcfaf5] text-slate-950' : 'bg-white text-slate-950'}
          `}>
            {/* Inner Golden Hairline Inset Border */}
            <div className="absolute inset-1.5 sm:inset-2.5 border border-amber-700/30 pointer-events-none"></div>

            {/* Header Letterhead */}
            <div className="relative pb-5 border-b-2 border-slate-900 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={ASSETS.schoolCrest} 
                    alt="Delhi Public International Academy Crest" 
                    className="w-20 h-20 rounded-full border-2 border-amber-600 object-cover shadow-xs shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-slate-950 uppercase">
                      Delhi Public International Academy
                    </h1>
                    <p className="text-xs font-semibold text-slate-700 tracking-wider uppercase mt-0.5">
                      Affiliated to Central Board of Secondary Education (CBSE), New Delhi
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Sector-IV, Institutional Area, Pushp Vihar, New Delhi - 110017
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] text-slate-600 mt-1 font-mono">
                      <span>CBSE Affiliation No: <strong>2130894</strong></span>
                      <span>·</span>
                      <span>School Code: <strong>70142</strong></span>
                      <span>·</span>
                      <span>Estd. 1988</span>
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-right shrink-0">
                  <div className="inline-block border-2 border-slate-950 bg-slate-950 text-white px-3 py-1 text-xs font-bold font-mono tracking-wider uppercase">
                    Annual Report Card
                  </div>
                  <p className="text-[11px] font-mono text-slate-600 mt-1.5">
                    Doc ID: <span className="font-bold text-slate-900">{documentSerial}</span>
                  </p>
                  <p className="text-[11px] text-slate-700 font-semibold mt-0.5">
                    Academic Session: 2026 – 2027
                  </p>
                </div>
              </div>

              {/* Sub-Banner Title */}
              <div className="mt-4 pt-2.5 border-t border-slate-300 flex flex-wrap items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-800">
                <span>Continuous and Comprehensive Evaluation (CCE)</span>
                <span>·</span>
                <span>Senior School Certificate Examination (SSCE)</span>
              </div>
            </div>

            {/* Scholar Identity Dossier Strip */}
            <div className="relative mt-5 p-4 bg-slate-100/70 border border-slate-300 rounded-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Scholar Name</span>
                  <span className="text-sm font-bold font-serif text-slate-950 block mt-0.5">
                    {student.firstName} {student.lastName}
                  </span>
                  <span className="text-[11px] text-slate-600">Gender: {student.gender}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">CBSE Roll No & Adm No</span>
                  <span className="text-xs font-mono font-bold text-slate-900 block mt-0.5">
                    Roll No: {student.rollNo || '12101'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">Adm: {student.admissionNo}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Class, Stream & Section</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">
                    {student.class || `Class ${student.grade}`} — {student.section}
                  </span>
                  <span className="text-[11px] text-indigo-700 font-semibold">{student.stream || 'Science (PCM)'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">House & Attendance</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">
                    {student.house || 'Ashoka House'}
                  </span>
                  <span className="text-[11px] text-slate-600 font-mono">Present: {student.attendanceRate}% ({attendedDays}/192 Days)</span>
                </div>

                {/* Second Row: Parents Information */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Father's Name</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    {student.fatherName || student.guardianName || 'Dr. Rajesh Sharma'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Mother's Name</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    {student.motherName || 'Prof. Anjali Sharma'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Date of Birth</span>
                  <span className="text-xs font-mono font-semibold text-slate-800 block mt-0.5">
                    {student.dob || '2008-04-14'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Class Teacher / Mentor</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                    Dr. Rajeshwar Sharma (PGT)
                  </span>
                </div>
              </div>
            </div>

            {/* PART 1: Scholastic Areas Table */}
            <div className="relative mt-5 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Part 1: Scholastic Performance (CBSE Board Grading Scale)</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">Periodic (20) + Half-Yr (80) + Prac (20) + Annual (80) = 100</span>
              </div>

              {/* Mobile Table Swipe Notice */}
              <div className="sm:hidden flex items-center justify-between text-[11px] bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded font-medium">
                <span>👉 Swipe table to view all 8 marks columns</span>
                <span className="font-mono text-[10px] text-amber-700 font-semibold">8 Columns</span>
              </div>

              <div className="border-2 border-slate-900 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                  <thead>
                    <tr className="bg-slate-900 text-white font-semibold text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3">Subject Code & Name</th>
                      <th className="py-2.5 px-2 text-center font-mono">Periodic Test (20)</th>
                      <th className="py-2.5 px-2 text-center font-mono">Half-Yearly (80)</th>
                      <th className="py-2.5 px-2 text-center font-mono">Practical / Lab (20)</th>
                      <th className="py-2.5 px-2 text-center font-mono">Annual Exam (80)</th>
                      <th className="py-2.5 px-2 text-center font-mono font-bold">Total Marks (100)</th>
                      <th className="py-2.5 px-2 text-center">CBSE Grade</th>
                      <th className="py-2.5 px-3 text-right font-mono">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {displayGrades.map((grade, idx) => (
                      <React.Fragment key={grade.courseId || idx}>
                        <tr className="bg-white/90 hover:bg-slate-100/50">
                          <td className="py-2 px-3">
                            <span className="font-bold text-slate-950 block">{grade.courseName}</span>
                            <span className="font-mono text-[10px] text-slate-500 font-semibold">{grade.courseCode}</span>
                          </td>
                          <td className="py-2 px-2 text-center font-mono tabular-nums">{grade.assignments}</td>
                          <td className="py-2 px-2 text-center font-mono tabular-nums">{grade.midterm}</td>
                          <td className="py-2 px-2 text-center font-mono tabular-nums">{grade.project}</td>
                          <td className="py-2 px-2 text-center font-mono tabular-nums">{grade.finalExam}</td>
                          <td className="py-2 px-2 text-center font-mono tabular-nums font-bold text-slate-950 text-sm">
                            {grade.totalScore}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="inline-block px-2 py-0.5 font-bold font-mono text-xs bg-slate-950 text-white rounded">
                              {grade.letterGrade}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                            {grade.gpa.toFixed(1)}
                          </td>
                        </tr>
                        {/* Instructor Remarks Row */}
                        <tr className="bg-slate-50/60 text-[11px] text-slate-600 border-b border-slate-200">
                          <td colSpan={8} className="py-1 px-3 italic">
                            <strong className="not-italic text-slate-800">Faculty Remarks:</strong> "{grade.teacherRemarks}"
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-900 bg-slate-100 font-bold text-xs">
                    <tr>
                      <td className="py-2.5 px-3">Grand Total & Performance</td>
                      <td colSpan={4} className="py-2.5 px-2 text-center text-slate-700 font-mono text-[11px]">
                        Marks Obtained: <strong className="text-slate-950">{totalObtained.toFixed(1)}</strong> / {totalMaxMarks}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-black text-slate-950 text-sm">
                        {percentage}%
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-black text-emerald-800">
                        {overallGrade}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-slate-950">
                        CGPA: {avgGpa}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* PART 2 & PART 3: Co-Scholastic & Discipline Areas */}
            <div className="relative mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Co-Scholastic Activities (Graded on 3-point scale A, B, C) */}
              <div className="border border-slate-300 p-3.5 bg-white/70 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="font-bold text-xs font-serif uppercase tracking-wider text-slate-900">
                    Part 2: Co-Scholastic Activities
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">Scale: A (Outstanding), B, C</span>
                </div>

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">2(A) Work Education (Robotics & AI Lab):</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Grade A</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">2(B) Art Education (Visual & Classical Arts):</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Grade A</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">2(C) Health & Physical Education (Sports & Yoga):</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Grade A</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-800">2(D) Scientific Quizzing & Debating Society:</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Grade A</span>
                  </div>
                </div>
              </div>

              {/* Right: Part 3 Discipline & Overall Result */}
              <div className="border border-slate-300 p-3.5 bg-white/70 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <h4 className="font-bold text-xs font-serif uppercase tracking-wider text-slate-900">
                    Part 3: Discipline & Annual Result
                  </h4>
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                    PASSED WITH DISTINCTION
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">Attendance & Punctuality:</span>
                    <span className="font-bold text-slate-950 font-mono">Exemplary ({student.attendanceRate}%)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">Values, Ethics & Sincerity:</span>
                    <span className="font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Grade A</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-800">House Contribution & Leadership:</span>
                    <span className="font-bold text-slate-950 font-mono">{student.house || 'Ashoka House'} Standing</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-800">Final Promotional Status:</span>
                    <span className="font-bold text-emerald-800 font-mono">Promoted to Higher Cohort</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Remarks */}
            <div className="relative mt-4 p-3 bg-amber-50/50 border border-amber-200 rounded-sm text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider block font-serif text-[11px]">
                Principal & Academic Board Observations:
              </span>
              <p className="text-slate-700 italic mt-1 leading-relaxed">
                "{student.remarks || `${student.firstName} has demonstrated outstanding academic dedication, discipline, and exemplary leadership in CBSE competitions. Their scientific acumen and respectful conduct reflect the finest ethos of Delhi Public International Academy.`}"
              </p>
            </div>

            {/* Official Certification & Tripartite Signatures */}
            <div className="relative mt-6 pt-5 border-t-2 border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {/* Signature 1: Class Teacher */}
              <div className="text-center sm:text-left space-y-2">
                <div className="h-10 flex items-end">
                  <span className="font-serif italic text-lg text-slate-800 border-b border-slate-800 pb-0.5 w-44 inline-block font-medium">
                    Dr. Rajeshwar Sharma
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-950 uppercase tracking-tight">Dr. Rajeshwar Sharma</p>
                  <p className="text-[11px] text-slate-600">Class Teacher & HOD Mathematics</p>
                </div>
              </div>

              {/* Center: Official Golden Heraldic School Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-600/80 p-1 flex flex-col items-center justify-center text-center bg-amber-50 shadow-inner">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-800/60 flex flex-col items-center justify-center p-1">
                    <span className="text-[7px] uppercase font-bold tracking-widest text-amber-800 leading-none">OFFICIAL SEAL</span>
                    <span className="text-[8px] font-serif font-black text-amber-950 mt-0.5">DPIA DELHI</span>
                    <span className="text-[6px] font-mono text-amber-800 mt-0.5">CBSE AFFIL: 2130894</span>
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mt-1 font-semibold">
                  School Seal & Verification
                </span>
              </div>

              {/* Signature 2: Principal */}
              <div className="text-center sm:text-right space-y-2">
                <div className="h-10 flex items-end justify-center sm:justify-end">
                  <span className="font-serif italic text-lg text-slate-800 border-b border-slate-800 pb-0.5 w-44 inline-block font-medium text-center sm:text-right">
                    Dr. Nandita Sen
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-950 uppercase tracking-tight">Dr. Nandita Sen, Ph.D.</p>
                  <p className="text-[11px] text-slate-600">Principal & Member Secretary</p>
                </div>
              </div>
            </div>

            {/* Bottom Security Watermark Strip */}
            <div className="relative mt-5 pt-3 border-t border-slate-300 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Date of Issue: 6th November 2026</span>
              <span className="tracking-widest uppercase text-slate-400 font-bold">CENTRAL BOARD OF SECONDARY EDUCATION · OFFICIAL CCE RECORD</span>
              <span>New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
