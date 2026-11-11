import React from 'react';
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  CreditCard, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar,
  Building,
  FileText,
  UserPlus,
  Send
} from 'lucide-react';
import { Student, Teacher, Course, CampusNotice, FeeInvoice, UserRole } from '../types/school';
import { ASSETS } from '../data/assets';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  invoices: FeeInvoice[];
  notices: CampusNotice[];
  role: UserRole;
  onNavigate: (module: string) => void;
  onOpenAddStudent: () => void;
  onOpenAddNotice: () => void;
  onOpenGenerateInvoice: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  courses,
  invoices,
  notices,
  role,
  onNavigate,
  onOpenAddStudent,
  onOpenAddNotice,
  onOpenGenerateInvoice
}) => {
  // Calculated stats
  const totalStudents = students.length;
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendanceRate, 0) / (totalStudents || 1)).toFixed(1);
  const avgGpa = (students.reduce((acc, s) => acc + s.gpa, 0) / (totalStudents || 1)).toFixed(2);
  
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';
  
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;

  return (
    <div className="space-y-6">
      {/* Campus Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="h-48 md:h-56 w-full relative">
          <img 
            src={ASSETS.campusAerial} 
            alt="Delhi Public Academy Campus" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col justify-end p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium tracking-wide">
                  <span>Delhi Public International Academy (CBSE Affiliated)</span>
                  <span>·</span>
                  <span>Session 2026-2027</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1 text-balance font-serif">
                  {role === 'super_admin' ? 'Principal\'s Secretariat & ERP Console' : role === 'faculty' ? 'Faculty Academic Workspace' : 'Student & Parent Portal'}
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  {role === 'super_admin' 
                    ? '2,450 enrolled students across Classes 9-12 · 118 PGT/TGT faculty on campus today.' 
                    : 'CBSE Curriculum Active · Term 1 & Pre-Board preparation cycle.'}
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onNavigate('attendance')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Mark Attendance</span>
                </button>
                <button
                  onClick={onOpenAddStudent}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-700" />
                  <span>Admit Student</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              2,450
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">
              +4.8% YoY
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Classes 9th - 12th</span>
            <span>·</span>
            <span>Science & Commerce</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Daily Attendance Rate</span>
            <ClipboardCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {avgAttendance}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">
              Present Today
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>2,372 Present</span>
            <span>·</span>
            <span>48 Leave Applications</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>CBSE Average Score</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              95.4%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono tabular-nums">
              A1 Category
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Distinction Rate: 84%</span>
            <span>·</span>
            <span>Board Pass: 100%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Fee Collection (Quarter 3)</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {collectionRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono tabular-nums">
              ₹{(totalCollected / 1000).toFixed(0)}k collected
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{overdueCount} Pending Dues</span>
            <span>·</span>
            <span>Online UPI & NetBanking</span>
          </div>
        </div>
      </div>

      {/* Grid: Live Bell Schedule & Attendance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Bell Schedule Ticker */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Today’s Period Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Friday Schedule · 7 Academic Periods
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">10:15 AM</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {/* Period 1 */}
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs opacity-70">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-slate-400 font-semibold w-14">08:15 AM</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-300">Period 1: Mathematics (Code 041)</p>
                  <p className="text-[11px] text-slate-500">Ramanujan Hall 204 · Dr. R. Sharma</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Concluded</span>
            </div>

            {/* Period 2 */}
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs opacity-70">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-slate-400 font-semibold w-14">09:00 AM</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-300">Period 2: Physics Theory (Code 042)</p>
                  <p className="text-[11px] text-slate-500">Homi Bhabha Lab 102 · Mrs. S. Deshmukh</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Concluded</span>
            </div>

            {/* Period 3 (CURRENT ACTIVE) */}
            <div className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-indigo-700 dark:text-indigo-300 font-semibold w-14">09:45 AM</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-indigo-950 dark:text-indigo-200">Period 3: Chemistry Lab (Code 043)</p>
                    <span className="text-[10px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded">In Session</span>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400">P.C. Ray Lab 105 · Dr. V. Rathore (15 min to Tiffin)</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('attendance')} 
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Attendance
              </button>
            </div>

            {/* Recess */}
            <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-center text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              10:30 AM - 11:00 AM · Recess & Tiffin Break
            </div>

            {/* Period 4 */}
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 font-semibold w-14">11:00 AM</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Period 4: English Core (Code 301)</p>
                  <p className="text-[11px] text-slate-500">Tagore Block 301 · Mrs. M. Sundaram</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">Upcoming</span>
            </div>

            {/* Period 5 */}
            <div className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400 font-semibold w-14">11:45 AM</span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Period 5: Computer Science (Python)</p>
                  <p className="text-[11px] text-slate-500">Aryabhata Lab 301 · Ms. P. Kulkarni</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Weekly Attendance & Grade Distribution Chart */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Attendance Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekday attendance comparison (Target: 95.0%+)
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
              Avg: 96.9%
            </span>
          </div>

          {/* SVG Bar Chart for Weekdays */}
          <div className="mt-6">
            <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
              {[
                { day: 'Mon', rate: 97.2, count: '1,388' },
                { day: 'Tue', rate: 96.5, count: '1,378' },
                { day: 'Wed', rate: 97.8, count: '1,396' },
                { day: 'Thu', rate: 96.2, count: '1,374' },
                { day: 'Fri (Today)', rate: 96.8, count: '1,382' }
              ].map((item, idx) => {
                const heightPercent = Math.max(15, (item.rate - 85) * 6.5);
                const isToday = idx === 4;
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {item.rate}%
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-32 flex items-end p-1">
                      <div 
                        className={`w-full rounded-t transition-all ${
                          isToday 
                            ? 'bg-indigo-600 dark:bg-indigo-500' 
                            : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className={`text-[11px] font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'}`}>
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Absence Threshold: &lt; 90%</span>
              <button 
                onClick={() => onNavigate('attendance')}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
              >
                <span>Full Attendance Log</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Operational Attention & Circulars */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Executive Action Items
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pending approvals & critical dispatches
              </p>
            </div>
            <button 
              onClick={onOpenAddNotice}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Broadcast</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {/* Urgent Weather item */}
            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Autumn Storm Advisory
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">Today 07:15</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-400 line-clamp-2">
                Athletics practices moved to Holbrook Gymnasium; East Gate shuttle routes adjusted.
              </p>
            </div>

            {/* Tuition overdue alert */}
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Tuition Arrears Notification
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Q2 Due</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {overdueCount} accounts have outstanding tuition balances requiring financial liaison follow-up.
              </p>
              <button 
                onClick={() => onNavigate('finance')} 
                className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Review Invoices &rarr;
              </button>
            </div>

            {/* Gradebook synchronization */}
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Q2 Midterm Testing Schedule
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Nov 16-20</span>
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Examination proctor rosters and laboratory seating charts finalized by Dean Holloway.
              </p>
              <button 
                onClick={() => onNavigate('gradebook')} 
                className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open Gradebook &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
