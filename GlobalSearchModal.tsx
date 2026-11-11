import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  BellRing,
  ArrowRight
} from 'lucide-react';
import { Student, Teacher, Course, FeeInvoice, CampusNotice } from '../types/school';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  invoices: FeeInvoice[];
  notices: CampusNotice[];
  onSelectStudent: (student: Student) => void;
  onNavigate: (module: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  students,
  teachers,
  courses,
  invoices,
  notices,
  onSelectStudent,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchingStudents = q ? students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
    s.admissionNo.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchingTeachers = q ? teachers.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.department.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingCourses = q ? courses.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.code.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchingNotices = q ? notices.filter(n => 
    n.title.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalResults = matchingStudents.length + matchingTeachers.length + matchingCourses.length + matchingNotices.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-xs">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, courses, circulars..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="font-medium text-slate-600 dark:text-slate-400">Search Delhi Public International Academy Registry</p>
              <p className="text-[11px] text-slate-400">
                Type a student name, roll number, faculty member, or CBSE subject code to jump directly
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Students */}
              {matchingStudents.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
                    Scholars ({matchingStudents.length})
                  </span>
                  <div className="space-y-1">
                    {matchingStudents.map(student => (
                      <button
                        key={student.id}
                        onClick={() => {
                          onSelectStudent(student);
                          onNavigate('students');
                          onClose();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-indigo-500" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {student.admissionNo} · Grade {student.grade}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faculty */}
              {matchingTeachers.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
                    Faculty ({matchingTeachers.length})
                  </span>
                  <div className="space-y-1">
                    {matchingTeachers.map(teacher => (
                      <button
                        key={teacher.id}
                        onClick={() => {
                          onNavigate('faculty');
                          onClose();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <GraduationCap className="w-4 h-4 text-amber-500" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {teacher.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {teacher.title} · {teacher.department}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses */}
              {matchingCourses.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
                    Courses ({matchingCourses.length})
                  </span>
                  <div className="space-y-1">
                    {matchingCourses.map(course => (
                      <button
                        key={course.id}
                        onClick={() => {
                          onNavigate('gradebook');
                          onClose();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {course.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {course.code} · {course.room}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {matchingNotices.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-1">
                    Circulars ({matchingNotices.length})
                  </span>
                  <div className="space-y-1">
                    {matchingNotices.map(notice => (
                      <button
                        key={notice.id}
                        onClick={() => {
                          onNavigate('notices');
                          onClose();
                        }}
                        className="w-full p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <BellRing className="w-4 h-4 text-rose-500" />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {notice.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {notice.date} · {notice.audience}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono">ESC</kbd>
            <span>to close</span>
          </div>
          <span>Atherton Academy Master Database</span>
        </div>
      </div>
    </div>
  );
};
