import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Check, 
  Clock, 
  AlertTriangle, 
  UserX, 
  Save, 
  CheckCheck,
  ShieldCheck,
  FileSpreadsheet,
  Send,
  MessageSquare,
  FileWarning,
  Printer,
  X,
  Award
} from 'lucide-react';
import { Student, AttendanceStatus } from '../types/school';
import { ASSETS } from '../data/assets';

interface AttendanceViewProps {
  students: Student[];
  onUpdateAttendanceRate: (studentId: string, newRate: number) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ students, onUpdateAttendanceRate }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'muster' | 'shortage'>('daily');
  const [selectedGrade, setSelectedGrade] = useState<string>('12');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // SMS Alert Modal State
  const [selectedAbsentStudent, setSelectedAbsentStudent] = useState<Student | null>(null);
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Warning Letter Modal State
  const [selectedWarningStudent, setSelectedWarningStudent] = useState<Student | null>(null);

  // Dynamic sections available for the selected grade
  const availableSections = Array.from(new Set(students.filter(s => s.grade === selectedGrade).map(s => s.section)));

  // Filter students in selected cohort
  const cohortStudents = students.filter(
    s => s.grade === selectedGrade && (selectedSection === 'all' || s.section === selectedSection)
  );

  // Local attendance state for current roll call session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; note: string }> = {};
    cohortStudents.forEach(s => {
      initial[s.id] = { status: 'Present', note: '' };
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    cohortStudents.forEach(s => {
      updated[s.id] = { status, note: attendanceMap[s.id]?.note || '' };
    });
    setAttendanceMap(updated);
  };

  // Live Statistics
  const total = cohortStudents.length;
  const presentCount = cohortStudents.filter(s => (attendanceMap[s.id]?.status || 'Present') === 'Present').length;
  const lateCount = cohortStudents.filter(s => attendanceMap[s.id]?.status === 'Late').length;
  const absentCount = cohortStudents.filter(s => attendanceMap[s.id]?.status === 'Absent').length;
  const excusedCount = cohortStudents.filter(s => attendanceMap[s.id]?.status === 'Excused').length;
  
  const presentRate = total > 0 ? (((presentCount + lateCount) / total) * 100).toFixed(1) : '100.0';

  // CBSE 75% Shortage Defaulters
  const shortageStudents = students.filter(s => s.attendanceRate < 75 || s.feeStatus === 'Overdue');

  const handleSaveRollCall = () => {
    cohortStudents.forEach(s => {
      const status = attendanceMap[s.id]?.status || 'Present';
      let delta = status === 'Present' ? +0.2 : status === 'Late' ? -0.1 : status === 'Absent' ? -0.5 : 0;
      const newRate = Math.min(100, Math.max(65, Number((s.attendanceRate + delta).toFixed(1))));
      onUpdateAttendanceRate(s.id, newRate);
    });

    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setSmsSentNotice(true);
    setTimeout(() => {
      setSmsSentNotice(false);
      setSelectedAbsentStudent(null);
    }, 2000);
  };

  // Dummy working days for November (1 to 24 excluding Sundays)
  const daysInMonth = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>CBSE Attendance & Roll Call Register</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-medium">
              Rule 13 Compliant
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Delhi Public International Academy · Daily Roll Call, Monthly Muster Roll & CBSE 75% Shortage Tracker
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Daily Roll Call</span>
          </button>

          <button
            onClick={() => setActiveTab('muster')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'muster'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Monthly Muster Roll</span>
          </button>

          <button
            onClick={() => setActiveTab('shortage')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'shortage'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileWarning className="w-3.5 h-3.5 text-amber-500" />
            <span>CBSE 75% Tracker</span>
          </button>
        </div>
      </div>

      {/* Cohort Selector & Date Strip */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Class</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Section / Stream</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">All Sections</option>
              {availableSections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Date</label>
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Attendance Metric Pill */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Cohort Attendance:</span>
            <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 text-base">
              {presentRate}%
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <span className="text-emerald-600 font-semibold">{presentCount} Present</span>
            <span>·</span>
            <span className="text-amber-600 font-semibold">{lateCount} Late</span>
            <span>·</span>
            <span className="text-rose-600 font-semibold">{absentCount} Absent</span>
          </div>
        </div>
      </div>

      {/* Confirmation feedback alert */}
      {isSavedFeedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Attendance register saved and synchronized with CBSE Academic Records!</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600">Audit Stamp #RC-{Date.now().toString().slice(-6)}</span>
        </div>
      )}

      {/* TAB 1: DAILY ROLL CALL */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {cohortStudents.length} enrolled scholars for Class {selectedGrade}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkAll('Present')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleSaveRollCall}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Roll Call</span>
              </button>
            </div>
          </div>

          {/* Mobile Roll Call Cards (< md) */}
          <div className="md:hidden space-y-3">
            {cohortStudents.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                No scholars found in Class {selectedGrade}.
              </div>
            ) : (
              cohortStudents.map((student) => {
                const currentStatus = attendanceMap[student.id]?.status || 'Present';
                const currentNote = attendanceMap[student.id]?.note || '';

                return (
                  <div 
                    key={student.id} 
                    className={`bg-white dark:bg-slate-900 rounded-xl border p-4 space-y-3 shadow-2xs ${
                      currentStatus === 'Absent' ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="font-mono text-[11px] text-slate-400">
                            Roll: {student.rollNo} · {student.stream}
                          </p>
                        </div>
                      </div>

                      <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        student.attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        student.attendanceRate >= 75 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {student.attendanceRate}%
                      </span>
                    </div>

                    {/* Status Picker Buttons (44px min-height for touch) */}
                    <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {[
                        { status: 'Present' as const, label: 'Present', active: 'bg-emerald-600 text-white font-bold' },
                        { status: 'Late' as const, label: 'Late', active: 'bg-amber-600 text-white font-bold' },
                        { status: 'Absent' as const, label: 'Absent', active: 'bg-rose-600 text-white font-bold' },
                        { status: 'Excused' as const, label: 'Leave', active: 'bg-blue-600 text-white font-bold' }
                      ].map(btn => (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => handleStatusChange(student.id, btn.status)}
                          className={`min-h-[40px] text-xs rounded-md transition-colors ${
                            currentStatus === btn.status ? btn.active : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Optional Note & Parent SMS */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={currentNote}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="Remarks / Note to parents..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                      />
                      {currentStatus === 'Absent' && (
                        <button
                          onClick={() => setSelectedAbsentStudent(student)}
                          className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-1 shrink-0"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>SMS</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Roll Call Table (>= md) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Scholar & Roll No</th>
                    <th className="py-3 px-4">Class & Stream</th>
                    <th className="py-3 px-4">Cumulative %</th>
                    <th className="py-3 px-4 text-center">Status Today</th>
                    <th className="py-3 px-4">Parent Liaison Note</th>
                    <th className="py-3 px-4 text-right">Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cohortStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No scholars found in Class {selectedGrade}.
                      </td>
                    </tr>
                  ) : (
                    cohortStudents.map((student) => {
                      const currentStatus = attendanceMap[student.id]?.status || 'Present';
                      const currentNote = attendanceMap[student.id]?.note || '';
                      const isShortage = student.attendanceRate < 75;

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          {/* Name & Roll */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block">
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="font-mono text-[11px] text-slate-400 block">
                                  Roll: {student.rollNo} · Adm: {student.admissionNo}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Stream */}
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            <div>{student.class || `Class ${student.grade}`}</div>
                            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{student.stream}</span>
                          </td>

                          {/* Cumulative % */}
                          <td className="py-3 px-4">
                            <span className={`font-mono tabular-nums font-bold ${
                              isShortage ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {student.attendanceRate}%
                            </span>
                            {isShortage && (
                              <span className="text-[10px] block text-rose-600 font-medium">&lt; 75% CBSE Norm</span>
                            )}
                          </td>

                          {/* Status Toggle Buttons */}
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800/80">
                              {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map((status) => {
                                const isSelected = currentStatus === status;
                                let activeClass = 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold';
                                if (isSelected) {
                                  if (status === 'Present') activeClass = 'bg-emerald-600 text-white font-semibold shadow-2xs';
                                  if (status === 'Late') activeClass = 'bg-amber-600 text-white font-semibold shadow-2xs';
                                  if (status === 'Absent') activeClass = 'bg-rose-600 text-white font-semibold shadow-2xs';
                                  if (status === 'Excused') activeClass = 'bg-indigo-600 text-white font-semibold shadow-2xs';
                                }

                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusChange(student.id, status)}
                                    className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                                      isSelected
                                        ? activeClass
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                  >
                                    {status === 'Present' ? 'P' : status === 'Late' ? 'L' : status === 'Absent' ? 'A' : 'M'}
                                  </button>
                                );
                              })}
                            </div>
                          </td>

                          {/* Note */}
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={currentNote}
                              onChange={(e) => handleNoteChange(student.id, e.target.value)}
                              placeholder="Reason / Leave application slip..."
                              className="w-full max-w-xs px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                            />
                          </td>

                          {/* Action Alert */}
                          <td className="py-3 px-4 text-right">
                            {currentStatus === 'Absent' ? (
                              <button
                                onClick={() => setSelectedAbsentStudent(student)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg flex items-center gap-1 ml-auto"
                                title="Send SMS/WhatsApp Notice to Parent"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>SMS Parent</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Regular</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY MUSTER ROLL (30 DAYS GRID) */}
      {activeTab === 'muster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Monthly Muster Roll Register (November 2026)
              </h3>
              <p className="text-xs text-slate-500">
                P = Present, A = Absent, L = Late, H = Sunday/Gazetted Holiday
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Muster Roll</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-44">Roll No & Scholar</th>
                    {daysInMonth.map(d => (
                      <th key={d} className="py-2 px-1 text-center font-mono w-7">
                        {d}
                      </th>
                    ))}
                    <th className="py-2.5 px-2 text-center font-mono">Present</th>
                    <th className="py-2.5 px-2 text-center font-mono">Absent</th>
                    <th className="py-2.5 px-3 text-right font-mono">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cohortStudents.map((s, idx) => {
                    const isAbs = idx === 4; // Kabir has a couple absentees
                    const totalP = isAbs ? 18 : 23;
                    const totalA = isAbs ? 4 : 1;
                    const rate = ((totalP / 24) * 100).toFixed(1);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-medium sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-900 dark:text-white block">{s.firstName} {s.lastName}</span>
                          <span className="font-mono text-[10px] text-slate-400">Roll: {s.rollNo}</span>
                        </td>
                        {daysInMonth.map(d => {
                          // Sunday every 7th day
                          const isSunday = d % 7 === 1;
                          const isStudentAbsent = isAbs && (d === 3 || d === 11 || d === 19);

                          if (isSunday) {
                            return (
                              <td key={d} className="py-1 px-1 text-center font-mono bg-slate-100 dark:bg-slate-800/50 text-slate-400 text-[10px]">
                                H
                              </td>
                            );
                          }
                          if (isStudentAbsent) {
                            return (
                              <td key={d} className="py-1 px-1 text-center font-mono font-bold text-rose-600 bg-rose-50/50 dark:bg-rose-950/30 text-[10px]">
                                A
                              </td>
                            );
                          }
                          return (
                            <td key={d} className="py-1 px-1 text-center font-mono text-emerald-700 dark:text-emerald-400 font-medium text-[10px]">
                              P
                            </td>
                          );
                        })}
                        <td className="py-2 px-2 text-center font-mono font-bold text-emerald-700">{totalP}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-rose-600">{totalA}</td>
                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900 dark:text-white">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CBSE 75% ATTENDANCE SHORTAGE & DEFAULTERS TRACKER */}
      {activeTab === 'shortage' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold flex items-center gap-1.5 text-sm text-amber-950 dark:text-amber-100">
                <FileWarning className="w-4 h-4 text-amber-600" />
                <span>CBSE Examination Byelaws (Rule 13 Mandate)</span>
              </span>
              <p className="mt-1">
                A candidate is required to have attended at least <strong>75%</strong> of the full course of lectures and practicals to be eligible for the AISSE / AISSCE Board Examinations.
              </p>
            </div>
            <span className="font-mono font-bold bg-amber-200 dark:bg-amber-900 px-3 py-1 rounded-lg text-amber-950 dark:text-amber-100 whitespace-nowrap self-start sm:self-auto">
              {shortageStudents.length} Flagged Scholars
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Scholar Name</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Current Attendance</th>
                  <th className="py-3 px-4">Shortage Deficit</th>
                  <th className="py-3 px-4">Parent Contact</th>
                  <th className="py-3 px-4 text-right">Official Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shortageStudents.map(student => {
                  const deficit = (75 - student.attendanceRate).toFixed(1);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">{student.firstName} {student.lastName}</span>
                        <span className="font-mono text-[11px] text-slate-400">Roll: {student.rollNo}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        {student.class || `Class ${student.grade}`} - {student.stream}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        {student.attendanceRate}%
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600 font-semibold">
                        -{deficit}% needed
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div>{student.fatherName || student.guardianName}</div>
                        <span className="text-[11px] text-slate-400 font-mono">{student.guardianPhone}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedWarningStudent(student)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 ml-auto"
                        >
                          <FileWarning className="w-3.5 h-3.5" />
                          <span>Generate CBSE Notice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABSENTEE SMS / WHATSAPP MODAL */}
      {selectedAbsentStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Send Absence Notice to Parent
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAbsentStudent.firstName} {selectedAbsentStudent.lastName} (Roll: {selectedAbsentStudent.rollNo})
                </p>
              </div>
              <button
                onClick={() => setSelectedAbsentStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSms} className="p-6 space-y-4">
              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Recipient Parent Mobile (+91):</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white block bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                  {selectedAbsentStudent.guardianPhone} ({selectedAbsentStudent.fatherName || selectedAbsentStudent.guardianName})
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  SMS / WhatsApp Text Template
                </label>
                <textarea
                  rows={4}
                  readOnly
                  value={`Dear Parent, your ward ${selectedAbsentStudent.firstName} ${selectedAbsentStudent.lastName} (Roll: ${selectedAbsentStudent.rollNo}, Class ${selectedAbsentStudent.grade}) was marked ABSENT today, 6th November 2026. If this was an unplanned absence, please submit a medical certificate or parent letter to the Class Teacher.\n- Principal, Delhi Public International Academy, New Delhi`}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono resize-none focus:outline-none"
                />
              </div>

              {smsSentNotice && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200 rounded text-center font-semibold">
                  ✓ Absence SMS dispatched via DPIA SMS Gateway.
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAbsentStudent(null)}
                  className="px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL CBSE ATTENDANCE SHORTAGE WARNING LETTER MODAL */}
      {selectedWarningStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
            <div className="no-print p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Official CBSE Attendance Shortage Warning Notice (Rule 13)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Warning Notice</span>
                </button>
                <button
                  onClick={() => setSelectedWarningStudent(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warning Letter Sheet */}
            <div className="p-8 bg-white text-slate-950 space-y-5 text-xs">
              {/* Letterhead */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
                <div className="flex items-center gap-3">
                  <img 
                    src={ASSETS.schoolCrest} 
                    alt="Delhi Public International Academy Crest" 
                    className="w-14 h-14 rounded-full border border-amber-600 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="font-serif font-black text-lg">DELHI PUBLIC INTERNATIONAL ACADEMY</h2>
                    <p className="text-xs text-slate-600">Affiliated to CBSE, New Delhi · Affiliation No: 2130894</p>
                    <p className="text-[11px] text-slate-500">Sector-IV, Pushp Vihar, New Delhi - 110017</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs bg-rose-100 text-rose-900 px-2.5 py-1 rounded block">
                    REF: DPIA/CBSE/ATT-WRN/2026/04
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Date: 6th November 2026</p>
                </div>
              </div>

              {/* To Guardian */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p><strong>To:</strong> {selectedWarningStudent.fatherName || selectedWarningStudent.guardianName}</p>
                <p><strong>Address:</strong> {selectedWarningStudent.address}</p>
                <p><strong>Parent Contact:</strong> {selectedWarningStudent.guardianPhone}</p>
                <p className="mt-1">
                  <strong>Subject:</strong> Urgent Notice regarding Shortage of Attendance in respect of Scholar <strong>{selectedWarningStudent.firstName} {selectedWarningStudent.lastName}</strong> (Class {selectedWarningStudent.grade}, CBSE Roll No: {selectedWarningStudent.rollNo}).
                </p>
              </div>

              {/* Notice Body */}
              <div className="space-y-3 leading-relaxed text-slate-800">
                <p>Dear Parent,</p>
                <p>
                  This is to bring to your urgent attention that as per the records of Delhi Public International Academy, the attendance of your ward has dropped to <strong>{selectedWarningStudent.attendanceRate}%</strong>, which is critically below the statutory minimum requirement of <strong>75%</strong> prescribed under <strong>Rule 13 of the CBSE Examination Byelaws</strong>.
                </p>
                <p>
                  Unless the required percentage is made up during the forthcoming academic sessions, your ward may be debarred by the Central Board of Secondary Education from appearing in the upcoming Annual / Pre-Board Examinations.
                </p>
                <p>
                  You are requested to attend a personal meeting with the Vice Principal and the undersigned on <strong>Saturday, 14th November 2026 at 10:00 AM</strong> to submit written justification or medical certificates.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-8 border-t border-slate-300 flex items-center justify-between">
                <div>
                  <p className="font-serif italic text-base">Dr. Rajeshwar Sharma</p>
                  <p className="font-semibold text-slate-900">CBSE Examination In-Charge</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600/70 p-1 flex items-center justify-center text-center bg-amber-50">
                    <span className="text-[7px] font-bold text-amber-900 uppercase">OFFICIAL SEAL</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-serif italic text-base">Dr. Nandita Sen</p>
                  <p className="font-semibold text-slate-900">Principal & Member Secretary</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
