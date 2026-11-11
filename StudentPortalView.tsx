import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  BookOpen, 
  Award,
  Download,
  AlertCircle,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { Student, GradeEntry, Course } from '../types/school';
import { ReportCardModal } from './ReportCardModal';

interface StudentPortalViewProps {
  student: Student;
  grades: GradeEntry[];
  courses: Course[];
  onOpenReportCard?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  student,
  grades,
  courses,
  onOpenReportCard
}) => {
  const [isReportCardOpen, setIsReportCardOpen] = React.useState(false);
  const myGrades = grades.filter(g => g.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Scholar Identity Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                <span>CBSE Scholar Dashboard</span>
                <span>·</span>
                <span>DPIA Class of 2027</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {student.firstName} {student.lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-mono font-semibold">CBSE Roll: {student.rollNo}</span>
                <span>·</span>
                <span>{student.class || `Class ${student.grade}`} ({student.stream})</span>
                <span>·</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">{student.house}</span>
                <span>·</span>
                <span>Mentor: Dr. Rajeshwar Sharma</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReportCardOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official CBSE Report Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">CBSE CGPA Standing</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {student.gpa.toFixed(1)}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Top 1% Decile (A1)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">NTSE Scholar & KVPY Qualified</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Attendance Record</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {student.attendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (188 / 192 Days)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Full compliance with CBSE 75% norm</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Fee Ledger Clearance</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {student.feeStatus === 'Paid' ? '₹0 Due' : `₹${student.feeDue.toLocaleString('en-IN')}`}
            </span>
            <span className={`text-xs font-semibold ${student.feeStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {student.feeStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Quarter 3 Paid · No Dues Certificate Issued</p>
        </div>
      </div>

      {/* Grid: My Enrolled Courses & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: My Courses & Current Standing */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CBSE Subjects & Internal Marks Standing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Term 1 / Pre-Board Assessment Record
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {myGrades.map((grade) => (
              <div 
                key={grade.courseId}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                      {grade.courseCode}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {grade.courseName}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 italic">
                    "{grade.teacherRemarks}"
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white block">
                      {grade.totalScore} / 100
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Scaled Marks</span>
                  </div>

                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-bold text-sm rounded-lg">
                    {grade.letterGrade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Today's Scholar Schedule */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Today’s Period Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Friday Schedule · Class 12-A
              </p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-70">
              <span className="font-mono text-slate-400 font-semibold">08:15 - 09:00 · Period 1</span>
              <p className="font-bold text-slate-900 dark:text-slate-200 mt-0.5">Mathematics (Code 041)</p>
              <span className="text-[11px] text-slate-500">Ramanujan Block 204 · Completed</span>
            </div>

            <div className="p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40">
              <div className="flex items-center justify-between">
                <span className="font-mono text-indigo-700 dark:text-indigo-300 font-semibold">09:45 - 10:30 · Period 3</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">Current</span>
              </div>
              <p className="font-bold text-indigo-950 dark:text-indigo-200 mt-0.5">Physics Optics Lab</p>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Homi Bhabha Lab 102 · Mrs. Deshmukh</span>
            </div>

            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold text-center border border-amber-200/50">
              10:30 - 11:00 AM · Recess & Tiffin Break
            </div>

            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <span className="font-mono text-slate-500 font-semibold">11:00 - 11:45 · Period 4</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Computer Science & Python</p>
              <span className="text-[11px] text-slate-500">Aryabhata Lab 301 · Ms. Kulkarni</span>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60">
              <span className="font-mono text-slate-500 font-semibold">12:30 - 13:15 · Period 6</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Robotics & Quizzing Club</p>
              <span className="text-[11px] text-slate-500">Innovation Center · Dr. Sharma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official CBSE Report Card Modal */}
      {isReportCardOpen && (
        <ReportCardModal
          student={student}
          grades={grades}
          onClose={() => setIsReportCardOpen(false)}
        />
      )}
    </div>
  );
};
