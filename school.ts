export type UserRole = 'super_admin' | 'faculty' | 'parent_student';

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  class: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  grade: '9' | '10' | '11' | '12'; // kept for backward-compatible selector
  section: string;
  stream: 'Science (PCM)' | 'Science (PCB)' | 'Commerce' | 'Humanities' | 'General';
  gender: 'Female' | 'Male' | 'Non-binary';
  dob: string;
  enrollmentDate: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  house: 'Ashoka House' | 'Tagore House' | 'Raman House' | 'Shivaji House';
  gpa: number; // CBSE CGPA e.g. 9.8 / 10
  percentage: number; // e.g. 96.5%
  attendanceRate: number; // e.g. 97.4%
  feeStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  feeDue: number; // in INR ₹
  address: string;
  remarks: string;
  emergencyContact: string;
  avatarSeed: string;
}

export interface Teacher {
  id: string;
  staffId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  department: 'Science & Mathematics' | 'Commerce & Economics' | 'Languages' | 'Computer Science & AI' | 'Physical Education';
  subjects: string[];
  qualifications: string;
  joiningYear: number;
  status: 'Active' | 'On Leave' | 'Sabbatical';
  officeRoom: string;
  weeklyPeriods: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  grade: string;
  department: string;
  teacherId: string;
  teacherName: string;
  room: string;
  credits: number;
  enrolledCount: number;
  syllabusProgress: number; // 0 - 100
  schedule: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    period: number;
    time: string;
  }[];
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused';

export interface DailyAttendance {
  date: string;
  grade: string;
  section: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
  }[];
}

export interface GradeEntry {
  studentId: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  term: string;
  assignments: number; // Periodic Test (out of 20)
  midterm: number;     // Half-Yearly Exam (out of 80)
  project: number;     // Practical / Lab Assessment (out of 20)
  finalExam: number;   // Pre-Board / Annual Exam (out of 80)
  totalScore: number;  // Combined scaled out of 100
  letterGrade: string; // CBSE Grade: A1, A2, B1, B2, C1, C2, D
  gpa: number;         // CBSE Grade Point (10.0, 9.0, 8.0 etc)
  teacherRemarks: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  term: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number; // In INR ₹
  amountPaid: number;  // In INR ₹
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  items: {
    description: string;
    amount: number;
  }[];
}

export interface CampusNotice {
  id: string;
  title: string;
  summary: string;
  content: string;
  audience: 'All School' | 'Faculty' | 'Parents' | 'Students';
  priority: 'Standard' | 'Urgent' | 'Academic' | 'Event';
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
}
