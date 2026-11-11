import React, { useState, useEffect } from 'react';
import { UserRole, Student, Teacher, Course, GradeEntry, FeeInvoice, CampusNotice } from './types/school';
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_COURSES, 
  INITIAL_GRADES, 
  INITIAL_INVOICES, 
  INITIAL_NOTICES 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { FacultyView } from './components/FacultyView';
import { TimetableScheduleView } from './components/TimetableScheduleView';
import { AttendanceView } from './components/AttendanceView';
import { GradebookView } from './components/GradebookView';
import { FinanceView } from './components/FinanceView';
import { NoticesView } from './components/NoticesView';
import { StudentPortalView } from './components/StudentPortalView';
import { TransportView } from './components/TransportView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GitHubExportModal } from './components/GitHubExportModal';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Persistent States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('dpia_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('dpia_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('dpia_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem('dpia_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem('dpia_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [notices, setNotices] = useState<CampusNotice[]>(() => {
    const saved = localStorage.getItem('dpia_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Navigation & Persona
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [role, setRole] = useState<UserRole>('super_admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [isGenerateInvoiceOpen, setIsGenerateInvoiceOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dpia_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('dpia_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('dpia_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('dpia_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('dpia_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('dpia_notices', JSON.stringify(notices));
  }, [notices]);

  // Handlers
  const handleAddStudent = (newS: any) => {
    const gradeNum = newS.grade || '11';
    const student: Student = {
      ...newS,
      id: `stu-${Date.now()}`,
      admissionNo: `DPIA/2026/${Math.floor(100 + Math.random() * 900)}`,
      rollNo: `${gradeNum}${Math.floor(100 + Math.random() * 900)}`,
      class: (`Class ${gradeNum}`) as any,
      grade: gradeNum,
      stream: newS.stream || 'Science (PCM)',
      fatherName: newS.fatherName || newS.guardianName || 'Parent Name',
      motherName: newS.motherName || 'Parent Name',
      house: newS.house || 'Ashoka House',
      gpa: 9.5,
      percentage: 95.0,
      attendanceRate: 98.0,
      feeStatus: 'Pending',
      feeDue: 32000,
      avatarSeed: newS.firstName
    };
    setStudents(prev => [student, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to remove this scholar record from active registry?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleUpdateAttendanceRate = (studentId: string, newRate: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceRate: newRate } : s));
  };

  const handleAddTeacher = (teacher: Omit<Teacher, 'id' | 'staffId'>) => {
    const t: Teacher = {
      ...teacher,
      id: `tea-${Date.now()}`,
      staffId: `FAC-${teacher.department.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`
    };
    setTeachers(prev => [t, ...prev]);
  };

  const handleAddCourse = (course: Course) => {
    setCourses(prev => [course, ...prev]);
  };

  const handleSaveGrades = (updatedGrades: GradeEntry[]) => {
    setGrades(updatedGrades);
  };

  const handleAddInvoice = (inv: FeeInvoice) => {
    setInvoices(prev => [inv, ...prev]);
    // Also update student feeStatus if needed
    setStudents(prev => prev.map(s => {
      if (s.id === inv.studentId) {
        return {
          ...s,
          feeStatus: 'Pending',
          feeDue: s.feeDue + inv.totalAmount
        };
      }
      return s;
    }));
  };

  const handleRecordPayment = (invoiceId: string, amount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.amountPaid + amount;
        const isFullyPaid = newPaid >= inv.totalAmount;
        return {
          ...inv,
          amountPaid: newPaid,
          status: isFullyPaid ? 'Paid' : 'Partial'
        };
      }
      return inv;
    }));

    // Also update student feeStatus
    const targetInvoice = invoices.find(i => i.id === invoiceId);
    if (targetInvoice) {
      setStudents(prev => prev.map(s => {
        if (s.id === targetInvoice.studentId) {
          const remainingDue = Math.max(0, s.feeDue - amount);
          return {
            ...s,
            feeDue: remainingDue,
            feeStatus: remainingDue === 0 ? 'Paid' : 'Partial'
          };
        }
        return s;
      }));
    }
  };

  const handleAddNotice = (notice: CampusNotice) => {
    setNotices(prev => [notice, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentModule={currentModule}
        onNavigate={setCurrentModule}
        role={role}
        unreadNoticesCount={notices.filter(n => n.priority === 'Urgent').length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentModule={currentModule}
          role={role}
          onRoleChange={setRole}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={setCurrentModule}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenGitHub={() => setIsGitHubModalOpen(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {currentModule === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              courses={courses}
              invoices={invoices}
              notices={notices}
              role={role}
              onNavigate={setCurrentModule}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenAddNotice={() => setIsAddNoticeOpen(true)}
              onOpenGenerateInvoice={() => setIsGenerateInvoiceOpen(true)}
            />
          )}

          {currentModule === 'students' && (
            <StudentsView
              students={students}
              grades={grades}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              isAddModalOpen={isAddStudentOpen}
              setIsAddModalOpen={setIsAddStudentOpen}
            />
          )}

          {currentModule === 'faculty' && (
            <FacultyView
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
            />
          )}

          {currentModule === 'timetable' && (
            <TimetableScheduleView
              courses={courses}
              onAddCourse={handleAddCourse}
            />
          )}

          {currentModule === 'attendance' && (
            <AttendanceView
              students={students}
              onUpdateAttendanceRate={handleUpdateAttendanceRate}
            />
          )}

          {currentModule === 'gradebook' && (
            <GradebookView
              courses={courses}
              initialGrades={grades}
              onSaveGrades={handleSaveGrades}
            />
          )}

          {currentModule === 'finance' && (
            <FinanceView
              invoices={invoices}
              students={students}
              onAddInvoice={handleAddInvoice}
              onRecordPayment={handleRecordPayment}
              isGenerateModalOpen={isGenerateInvoiceOpen}
              setIsGenerateModalOpen={setIsGenerateInvoiceOpen}
            />
          )}

          {currentModule === 'transport' && (
            <TransportView />
          )}

          {currentModule === 'notices' && (
            <NoticesView
              notices={notices}
              onAddNotice={handleAddNotice}
              isAddModalOpen={isAddNoticeOpen}
              setIsAddModalOpen={setIsAddNoticeOpen}
            />
          )}

          {currentModule === 'portal' && (
            <StudentPortalView
              student={students[0] || INITIAL_STUDENTS[0]}
              grades={grades}
              courses={courses}
              onOpenReportCard={() => {
                setCurrentModule('students');
              }}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        students={students}
        teachers={teachers}
        courses={courses}
        invoices={invoices}
        notices={notices}
        onSelectStudent={(s) => {
          setCurrentModule('students');
        }}
        onNavigate={setCurrentModule}
      />

      {/* GitHub Export & ZIP Download Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Fixed Mobile Bottom Tab Bar */}
      <MobileBottomNav
        currentModule={currentModule}
        onNavigate={setCurrentModule}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />
    </div>
  );
}
