import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Clock, 
  Plus, 
  Search, 
  X,
  Award,
  Calendar
} from 'lucide-react';
import { Teacher } from '../types/school';

interface FacultyViewProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Omit<Teacher, 'id' | 'staffId'>) => void;
}

export const FacultyView: React.FC<FacultyViewProps> = ({ teachers, onAddTeacher }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    department: 'Science & Mathematics' as const,
    subjects: '',
    qualifications: '',
    joiningYear: 2026,
    status: 'Active' as const,
    officeRoom: '',
    weeklyPeriods: 16
  });

  const filteredTeachers = teachers.filter(t => {
    const matchesDept = selectedDept === 'all' || t.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.officeRoom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.email) return;

    onAddTeacher({
      name: newFaculty.name,
      title: newFaculty.title || 'Instructor',
      email: newFaculty.email,
      phone: newFaculty.phone || '+1 (555) 441-2000',
      department: newFaculty.department,
      subjects: newFaculty.subjects.split(',').map(s => s.trim()).filter(Boolean),
      qualifications: newFaculty.qualifications || 'M.A. / M.S.',
      joiningYear: Number(newFaculty.joiningYear) || 2026,
      status: newFaculty.status,
      officeRoom: newFaculty.officeRoom || 'Faculty Quad 100',
      weeklyPeriods: Number(newFaculty.weeklyPeriods) || 16
    });

    setIsAddModalOpen(false);
    setNewFaculty({
      name: '',
      title: '',
      email: '',
      phone: '',
      department: 'Science & Mathematics',
      subjects: '',
      qualifications: '',
      joiningYear: 2026,
      status: 'Active',
      officeRoom: '',
      weeklyPeriods: 16
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Faculty & Instructional Staff
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            94 distinguished scholars & department heads · Showing {filteredTeachers.length} members
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Appoint Faculty Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Instructional Ratio</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">1:9</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Class Ratio Standard</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Doctoral / Terminal Degrees</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">78%</span>
          <span className="text-[11px] text-slate-500">Ph.D & M.Phil</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Faculty Load</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">16.8</span>
          <span className="text-[11px] text-slate-500">Teaching hours / week</span>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Faculty Retention</span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">96.4%</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Tenured & Senior</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, course discipline, or office room..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {['all', 'Science & Mathematics', 'Commerce & Economics', 'Languages', 'Computer Science & AI'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedDept === dept
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {dept === 'all' ? 'All Departments' : dept.replace('&', '+')}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div 
            key={teacher.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {teacher.title}
                  </p>
                </div>
                <span className="text-[10px] font-mono tabular-nums text-slate-400 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {teacher.staffId}
                </span>
              </div>

              {/* Qualifications */}
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{teacher.qualifications}</span>
              </div>

              {/* Subjects taught */}
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Courses Assigned
                </span>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((sub, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.officeRoom}</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.weeklyPeriods} hrs/wk</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="truncate max-w-[180px]">{teacher.email}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{teacher.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* APPOINT FACULTY MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Appoint Faculty Member
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Academic Credentials & Teaching Appointment
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name with Title *</label>
                <input
                  type="text"
                  required
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                  placeholder="e.g. Dr. Alistair Sterling"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Academic Title</label>
                  <input
                    type="text"
                    value={newFaculty.title}
                    onChange={(e) => setNewFaculty({...newFaculty, title: e.target.value})}
                    placeholder="e.g. Senior Lecturer in Physics"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Science & Mathematics">Science & Mathematics</option>
                    <option value="Commerce & Economics">Commerce & Economics</option>
                    <option value="Languages">Languages</option>
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Qualifications & Degrees</label>
                <input
                  type="text"
                  value={newFaculty.qualifications}
                  onChange={(e) => setNewFaculty({...newFaculty, qualifications: e.target.value})}
                  placeholder="e.g. Ph.D. Physics (Delhi University), M.Sc, B.Ed"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Teaching Subjects (comma separated)</label>
                <input
                  type="text"
                  value={newFaculty.subjects}
                  onChange={(e) => setNewFaculty({...newFaculty, subjects: e.target.value})}
                  placeholder="e.g. Physics (Code 042), Optics Lab"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                    placeholder="faculty@dpia.edu.in"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Office Room</label>
                  <input
                    type="text"
                    value={newFaculty.officeRoom}
                    onChange={(e) => setNewFaculty({...newFaculty, officeRoom: e.target.value})}
                    placeholder="e.g. Newton Hall 302"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
