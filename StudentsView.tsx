import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  FileText, 
  Printer, 
  X, 
  Check, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Download,
  GraduationCap,
  Award,
  IndianRupee,
  CreditCard,
  CalendarCheck
} from 'lucide-react';
import { Student, GradeEntry } from '../types/school';
import { ASSETS } from '../data/assets';
import { ReportCardModal } from './ReportCardModal';
import { StudentIdCardModal } from './StudentIdCardModal';
import { TransferCertificateModal } from './TransferCertificateModal';
import { AdmitCardModal } from './AdmitCardModal';

interface StudentsViewProps {
  students: Student[];
  grades: GradeEntry[];
  onAddStudent: (student: Omit<Student, 'id' | 'admissionNo' | 'gpa' | 'attendanceRate' | 'feeDue' | 'feeStatus' | 'avatarSeed'>) => void;
  onDeleteStudent: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  grades,
  onAddStudent,
  onDeleteStudent,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modals
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<Student | null>(null);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [selectedStudentForTC, setSelectedStudentForTC] = useState<Student | null>(null);
  const [selectedStudentForAdmitCard, setSelectedStudentForAdmitCard] = useState<Student | null>(null);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    grade: '11' as const,
    class: 'Class 11' as const,
    section: 'Sec A (Science PCM)',
    stream: 'Science (PCM)' as const,
    gender: 'Female' as const,
    dob: '2009-08-15',
    enrollmentDate: '2024-04-05',
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '+91 ',
    house: 'Ashoka House' as const,
    address: 'New Delhi',
    emergencyContact: '+91 ',
    remarks: 'Enrolled under CBSE Regular Curriculum.'
  });

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.rollNo && student.rollNo.includes(searchQuery)) ||
        student.guardianEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
      const matchesStream = selectedStream === 'all' || student.stream?.toLowerCase().includes(selectedStream.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || student.feeStatus.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesGrade && matchesStream && matchesStatus;
    });
  }, [students, searchQuery, selectedGrade, selectedStream, selectedStatus]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.guardianEmail) {
      alert('Please fill out all required fields.');
      return;
    }
    const studentData: any = {
      ...newStudent,
      guardianName: newStudent.guardianName || `${newStudent.fatherName} & ${newStudent.motherName}`,
      percentage: 92.5
    };
    onAddStudent(studentData);
    setIsAddModalOpen(false);
    // Reset form
    setNewStudent({
      firstName: '',
      lastName: '',
      grade: '11',
      class: 'Class 11',
      section: 'Sec A (Science PCM)',
      stream: 'Science (PCM)',
      gender: 'Female',
      dob: '2009-08-15',
      enrollmentDate: '2024-04-05',
      fatherName: '',
      motherName: '',
      guardianName: '',
      guardianEmail: '',
      guardianPhone: '+91 ',
      house: 'Ashoka House',
      address: 'New Delhi',
      emergencyContact: '+91 ',
      remarks: 'Enrolled under CBSE Regular Curriculum.'
    });
  };

  const getHouseBadge = (house: string) => {
    switch (house) {
      case 'Ashoka House':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'Tagore House':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'Raman House':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300';
      case 'Shivaji House':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>CBSE Student Body Register</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-medium">
              Delhi Public International Academy
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Senior Secondary School (Affiliation No: 2130894) · {filteredStudents.length} enrolled scholars listed
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enroll CBSE Scholar</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, admission ID, or guardian email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade/Class Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto max-w-full">
            {['all', '9', '10', '11', '12'].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  selectedGrade === grade
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {grade === 'all' ? 'All Classes' : `Class ${grade}`}
              </button>
            ))}
          </div>

          {/* Stream Selector */}
          <select
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none flex-1 sm:flex-none"
          >
            <option value="all">All Academic Streams</option>
            <option value="pcm">Science (PCM)</option>
            <option value="pcb">Science (PCB)</option>
            <option value="commerce">Commerce</option>
            <option value="general">Secondary (Class 9-10)</option>
          </select>

          {/* Fee Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none flex-1 sm:flex-none"
          >
            <option value="all">All Fee Statuses</option>
            <option value="paid">Fee Paid in Full</option>
            <option value="partial">Partial Payment</option>
            <option value="pending">Pending Payment</option>
            <option value="overdue">Overdue Arrears</option>
          </select>
        </div>
      </div>

      {/* Mobile Scholar Cards (< md) */}
      <div className="md:hidden space-y-3">
        {filteredStudents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
            No scholars found matching criteria.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div 
              key={student.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setSelectedStudentForProfile(student)}
                    className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs shrink-0 cursor-pointer"
                  >
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <h3 
                      onClick={() => setSelectedStudentForProfile(student)}
                      className="font-bold text-slate-900 dark:text-white text-sm cursor-pointer hover:text-indigo-600 flex items-center gap-1.5"
                    >
                      <span>{student.firstName} {student.lastName}</span>
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400">
                      Roll: {student.rollNo} · {student.class || `Class ${student.grade}`}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                  student.feeStatus === 'Paid'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : student.feeStatus === 'Partial'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : student.feeStatus === 'Overdue'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {student.feeStatus}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getHouseBadge(student.house)}`}>
                  {student.house}
                </span>
                <span className="text-slate-500 text-[11px] font-medium">
                  {student.stream}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Attendance</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {student.attendanceRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CBSE CGPA</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {student.gpa.toFixed(1)} / 10.0
                  </span>
                </div>
              </div>

              {/* Mobile Quick Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedStudentForReportCard(student)}
                  className="min-h-[44px] px-2.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Report Card</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForIdCard(student)}
                  className="min-h-[44px] px-2.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Student ID</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForAdmitCard(student)}
                  className="min-h-[44px] px-2.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Admit Card</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForTC(student)}
                  className="min-h-[44px] px-2.5 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Leaving TC</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop High-Density Students Data Table (>= md) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Scholar & Roll No</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">House</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">CBSE CGPA</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4">Guardian / Father</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No scholars found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Roll */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-xs shrink-0">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <div>
                            <span 
                              className="font-semibold text-slate-900 dark:text-white block hover:text-indigo-600 cursor-pointer" 
                              onClick={() => setSelectedStudentForProfile(student)}
                            >
                              {student.firstName} {student.lastName}
                            </span>
                            <span className="font-mono tabular-nums text-[11px] text-slate-400 block">
                              Roll: {student.rollNo} · {student.admissionNo}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class & Stream */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {student.class || `Class ${student.grade}`}
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {student.stream}
                        </div>
                      </td>

                      {/* House */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${getHouseBadge(student.house)}`}>
                          {student.house}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4">
                        <span className={`font-mono tabular-nums font-semibold ${
                          student.attendanceRate >= 95 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : student.attendanceRate >= 90 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      {/* CGPA */}
                      <td className="py-3 px-4">
                        <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {student.gpa.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">/ 10</span>
                      </td>

                      {/* Tuition Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          student.feeStatus === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : student.feeStatus === 'Partial'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : student.feeStatus === 'Overdue'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {student.feeStatus === 'Overdue' ? `Due ₹${student.feeDue.toLocaleString('en-IN')}` : student.feeStatus}
                        </span>
                      </td>

                      {/* Guardian */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div className="truncate max-w-[150px] font-medium text-slate-800 dark:text-slate-200">
                          {student.fatherName || student.guardianName}
                        </div>
                        <div className="truncate max-w-[150px] text-[11px] text-slate-400">
                          {student.guardianPhone}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentForProfile(student)}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Scholar Profile Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentForIdCard(student)}
                            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded transition-colors"
                            title="Print RFID Student ID Card"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentForReportCard(student)}
                            className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded transition-colors"
                            title="Generate Official CBSE Report Card"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentForAdmitCard(student)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-colors"
                            title="CBSE Board Exam Admit Card (Hall Ticket)"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedStudentForTC(student)}
                            className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded transition-colors"
                            title="Issue Transfer Certificate (TC)"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE DOSSIER MODAL */}
      {selectedStudentForProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedStudentForProfile.firstName[0]}{selectedStudentForProfile.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedStudentForProfile.firstName} {selectedStudentForProfile.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold">Roll: {selectedStudentForProfile.rollNo}</span>
                    <span>·</span>
                    <span className="font-mono">{selectedStudentForProfile.admissionNo}</span>
                    <span>·</span>
                    <span>{selectedStudentForProfile.class || `Class ${selectedStudentForProfile.grade}`}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Quick Academic & Financial Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">CBSE CGPA</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">
                    {selectedStudentForProfile.gpa.toFixed(1)} / 10.0
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Distinction A1</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Attendance</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">
                    {selectedStudentForProfile.attendanceRate}%
                  </span>
                  <span className="text-[10px] text-slate-500">Regular Standing</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Tuition Ledger</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">
                    {selectedStudentForProfile.feeStatus}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {selectedStudentForProfile.feeDue > 0 ? `Dues: ₹${selectedStudentForProfile.feeDue.toLocaleString('en-IN')}` : 'No Arrears'}
                  </span>
                </div>
              </div>

              {/* Parents & Liaison Details */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Parents & Residential Liaison (CBSE LOC Data)</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Father's Name</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudentForProfile.fatherName || selectedStudentForProfile.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Mother's Name</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudentForProfile.motherName || 'Parent Name'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">House Assignment</span>
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">{selectedStudentForProfile.house}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Primary Contact Phone</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{selectedStudentForProfile.guardianPhone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Residential Address</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedStudentForProfile.address}
                  </span>
                </div>
              </div>

              {/* Remarks */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/20">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Principal & Class Teacher Observations
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedStudentForProfile.remarks}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const student = selectedStudentForProfile;
                    setSelectedStudentForProfile(null);
                    setSelectedStudentForReportCard(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>CBSE Report</span>
                </button>

                <button
                  onClick={() => {
                    const student = selectedStudentForProfile;
                    setSelectedStudentForProfile(null);
                    setSelectedStudentForIdCard(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Student ID Card</span>
                </button>

                <button
                  onClick={() => {
                    const student = selectedStudentForProfile;
                    setSelectedStudentForProfile(null);
                    setSelectedStudentForTC(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Transfer Certificate (TC)</span>
                </button>

                <button
                  onClick={() => {
                    const student = selectedStudentForProfile;
                    setSelectedStudentForProfile(null);
                    setSelectedStudentForAdmitCard(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Board Admit Card</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedStudentForProfile(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL CBSE REPORT CARD MODAL */}
      {selectedStudentForReportCard && (
        <ReportCardModal
          student={selectedStudentForReportCard}
          grades={grades}
          onClose={() => setSelectedStudentForReportCard(null)}
        />
      )}

      {/* STUDENT ID CARD MODAL */}
      {selectedStudentForIdCard && (
        <StudentIdCardModal
          student={selectedStudentForIdCard}
          onClose={() => setSelectedStudentForIdCard(null)}
        />
      )}

      {/* OFFICIAL CBSE TRANSFER CERTIFICATE (TC) MODAL */}
      {selectedStudentForTC && (
        <TransferCertificateModal
          student={selectedStudentForTC}
          onClose={() => setSelectedStudentForTC(null)}
        />
      )}

      {/* OFFICIAL CBSE BOARD EXAM ADMIT CARD MODAL */}
      {selectedStudentForAdmitCard && (
        <AdmitCardModal
          student={selectedStudentForAdmitCard}
          onClose={() => setSelectedStudentForAdmitCard(null)}
        />
      )}

      {/* ENROLL NEW CBSE SCHOLAR MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enroll New CBSE Scholar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Delhi Public International Academy Admissions
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                    placeholder="e.g. Aarav"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                    placeholder="e.g. Sharma"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Class</label>
                  <select
                    value={newStudent.grade}
                    onChange={(e) => {
                      const gr = e.target.value as any;
                      setNewStudent({...newStudent, grade: gr, class: `Class ${gr}` as any});
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Academic Stream</label>
                  <select
                    value={newStudent.stream}
                    onChange={(e) => setNewStudent({...newStudent, stream: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Science (PCM)">Science (PCM)</option>
                    <option value="Science (PCB)">Science (PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Humanities">Humanities</option>
                    <option value="General">General (Sec)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">House</label>
                  <select
                    value={newStudent.house}
                    onChange={(e) => setNewStudent({...newStudent, house: e.target.value as any})}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Ashoka House">Ashoka House</option>
                    <option value="Tagore House">Tagore House</option>
                    <option value="Raman House">Raman House</option>
                    <option value="Shivaji House">Shivaji House</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Parent & Residential Details (CBSE Registration)
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudent.fatherName}
                      onChange={(e) => setNewStudent({...newStudent, fatherName: e.target.value})}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Mother's Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudent.motherName}
                      onChange={(e) => setNewStudent({...newStudent, motherName: e.target.value})}
                      placeholder="e.g. Prof. Anjali Sharma"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Guardian Email *</label>
                    <input
                      type="email"
                      required
                      value={newStudent.guardianEmail}
                      onChange={(e) => setNewStudent({...newStudent, guardianEmail: e.target.value})}
                      placeholder="parent@email.com"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Mobile (+91)</label>
                    <input
                      type="tel"
                      value={newStudent.guardianPhone}
                      onChange={(e) => setNewStudent({...newStudent, guardianPhone: e.target.value})}
                      placeholder="+91 98112 34567"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Residential Address (Delhi-NCR)</label>
                  <input
                    type="text"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                    placeholder="e.g. B-42, Vasant Vihar, New Delhi - 110057"
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
                  Enroll CBSE Scholar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
