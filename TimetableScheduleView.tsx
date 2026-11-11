import React, { useState } from 'react';
import { 
  CalendarClock, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Filter, 
  X,
  BookOpen
} from 'lucide-react';
import { Course } from '../types/school';

interface TimetableScheduleViewProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
}

const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const PERIODS = [
  { period: 1, time: '08:15 - 09:00' },
  { period: 2, time: '09:00 - 09:45' },
  { period: 3, time: '09:45 - 10:30' },
  // Recess & Tiffin: 10:30 - 11:00
  { period: 4, time: '11:00 - 11:45' },
  { period: 5, time: '11:45 - 12:30' },
  { period: 6, time: '12:30 - 13:15' },
  { period: 7, time: '13:15 - 14:00' }
];

export const TimetableScheduleView: React.FC<TimetableScheduleViewProps> = ({ courses, onAddCourse }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // New course draft
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    grade: '12',
    department: 'Science & Mathematics',
    teacherName: 'Dr. Rajeshwar Sharma',
    room: 'Ramanujan Hall 204',
    day: 'Monday' as const,
    period: 1,
    time: '08:15 - 09:00'
  });

  const filteredCourses = courses.filter(c => {
    return selectedGrade === 'all' || c.grade === selectedGrade;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) return;

    const course: Course = {
      id: `crs-${Date.now()}`,
      code: newCourse.code,
      name: newCourse.name,
      grade: newCourse.grade,
      department: newCourse.department,
      teacherId: 'tea-001',
      teacherName: newCourse.teacherName,
      room: newCourse.room,
      credits: 4,
      enrolledCount: 38,
      syllabusProgress: 60,
      schedule: [
        {
          day: newCourse.day,
          period: Number(newCourse.period),
          time: newCourse.time
        }
      ]
    };

    onAddCourse(course);
    setIsAddCourseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Academic Master Timetable</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-medium">
              CBSE Bell Schedule
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Delhi Public International Academy · 7-Period Rotating Academic Cycle
          </p>
        </div>

        <button
          onClick={() => setIsAddCourseModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Period</span>
        </button>
      </div>

      {/* Filter Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Class Level:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['all', '9', '10', '11', '12'].map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  selectedGrade === gr
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {gr === 'all' ? 'All Classes' : `Class ${gr}`}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Bell Schedule:</span> Assembly at 08:00 AM · Recess & Tiffin: 10:30 - 11:00 AM
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-36">Period & Bell Timing</th>
                {DAYS.map(day => (
                  <th key={day} className="py-3 px-4 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PERIODS.map(({ period, time }, idx) => {
                const showRecessBefore = period === 4;
                return (
                  <React.Fragment key={period}>
                    {showRecessBefore && (
                      <tr className="bg-amber-50/70 dark:bg-amber-950/30 border-y border-amber-200/60 dark:border-amber-800/40 text-center">
                        <td colSpan={6} className="py-2 px-4 text-amber-800 dark:text-amber-300 font-semibold text-xs tracking-wider uppercase font-mono">
                          🥪 Recess & Tiffin Break (10:30 AM - 11:00 AM) · House Library & Cafeteria
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      {/* Period Timing column */}
                      <td className="py-3.5 px-4 bg-slate-50/40 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-slate-200 block">Period {period}</span>
                        <span className="font-mono tabular-nums text-[11px] text-slate-400 block mt-0.5">{time}</span>
                      </td>

                      {/* Day Slots */}
                      {DAYS.map(day => {
                        const matchingCourse = filteredCourses.find(c => 
                          c.schedule.some(s => s.day === day && s.period === period)
                        );

                        return (
                          <td key={day} className="py-2 px-2.5 align-top border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                            {matchingCourse ? (
                              <div className="p-2.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-1 shadow-2xs hover:border-indigo-300 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                                    {matchingCourse.code}
                                  </span>
                                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                    Class {matchingCourse.grade}
                                  </span>
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-tight line-clamp-1">
                                  {matchingCourse.name}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                                  <span className="truncate max-w-[85px]">{matchingCourse.room}</span>
                                  <span className="truncate max-w-[85px]">{matchingCourse.teacherName.split(' ').pop()}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-16 flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400">
                                Self-Study / Lab
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE CLASS SESSION MODAL */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-xs">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Schedule CBSE Class Period
                </h3>
                <p className="text-xs text-slate-500">
                  Assign Subject, Teacher and Lab/Room Allocation
                </p>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                    placeholder="e.g. MATH-041"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Class</label>
                  <select
                    value={newCourse.grade}
                    onChange={(e) => setNewCourse({...newCourse, grade: e.target.value})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  placeholder="e.g. Mathematics Core (CBSE Class 12)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={newCourse.teacherName}
                    onChange={(e) => setNewCourse({...newCourse, teacherName: e.target.value})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    value={newCourse.room}
                    onChange={(e) => setNewCourse({...newCourse, room: e.target.value})}
                    placeholder="e.g. Ramanujan Hall 204"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Day of Week</label>
                  <select
                    value={newCourse.day}
                    onChange={(e) => setNewCourse({...newCourse, day: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Period</label>
                  <select
                    value={newCourse.period}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const matchingTime = PERIODS.find(item => item.period === p)?.time || '08:15 - 09:00';
                      setNewCourse({...newCourse, period: p, time: matchingTime});
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {PERIODS.map(p => <option key={p.period} value={p.period}>Period {p.period} ({p.time})</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Schedule Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
