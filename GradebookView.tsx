import React, { useState, useMemo } from 'react';
import { 
  BookOpenCheck, 
  Download, 
  Save, 
  TrendingUp, 
  GraduationCap, 
  Check, 
  HelpCircle,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { Course, GradeEntry } from '../types/school';

interface GradebookViewProps {
  courses: Course[];
  initialGrades: GradeEntry[];
  onSaveGrades: (updatedGrades: GradeEntry[]) => void;
}

// CBSE Standard 9-Point Grading Scale & Grade Points
const calculateCBSEGrade = (score: number): { letter: string; gpa: number } => {
  if (score >= 91) return { letter: 'A1', gpa: 10.0 };
  if (score >= 81) return { letter: 'A2', gpa: 9.0 };
  if (score >= 71) return { letter: 'B1', gpa: 8.0 };
  if (score >= 61) return { letter: 'B2', gpa: 7.0 };
  if (score >= 51) return { letter: 'C1', gpa: 6.0 };
  if (score >= 41) return { letter: 'C2', gpa: 5.0 };
  if (score >= 33) return { letter: 'D', gpa: 4.0 };
  return { letter: 'E', gpa: 0.0 };
};

export const GradebookView: React.FC<GradebookViewProps> = ({ courses, initialGrades, onSaveGrades }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs-001');
  const [gradesList, setGradesList] = useState<GradeEntry[]>(initialGrades);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const courseGrades = useMemo(() => {
    return gradesList.filter(g => g.courseId === selectedCourseId);
  }, [gradesList, selectedCourseId]);

  // Handle in-line grade updates with CBSE component scaling
  const handleScoreUpdate = (studentId: string, field: 'assignments' | 'midterm' | 'project' | 'finalExam', value: number) => {
    const val = Math.min(100, Math.max(0, isNaN(value) ? 0 : value));
    
    setGradesList(prev => prev.map(entry => {
      if (entry.studentId === studentId && entry.courseId === selectedCourseId) {
        const updated = { ...entry, [field]: val };
        // Scale to 100: Internal PT (20) + Half-Yearly (80) + Practical (20) + Final (80)
        // Scaled as: (PT * 0.10) + (Midterm * 0.40) + (Practical * 0.10) + (Final * 0.40) = 100 max
        const total = Number((
          (updated.assignments * 0.5) +   // 20 max * 0.5 = 10
          (updated.midterm * 0.5) +       // 80 max * 0.5 = 40
          (updated.project * 0.5) +       // 20 max * 0.5 = 10
          (updated.finalExam * 0.5)       // 80 max * 0.5 = 40 => Total 100
        ).toFixed(1));

        const { letter, gpa } = calculateCBSEGrade(total);
        return {
          ...updated,
          totalScore: total,
          letterGrade: letter,
          gpa
        };
      }
      return entry;
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    onSaveGrades(gradesList);
    setHasUnsavedChanges(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  // Export to authentic CSV for CBSE Board uploads
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Scholar Name', 'CBSE Subject Code', 'PT Internal (20)', 'Half-Yearly (80)', 'Practical / Lab (20)', 'Pre-Board / Annual (80)', 'Total Scaled (100)', 'CBSE Grade', 'Grade Point', 'Faculty Observations'];
    const rows = courseGrades.map(g => [
      g.studentId,
      `"${g.studentName}"`,
      g.courseCode,
      g.assignments,
      g.midterm,
      g.project,
      g.finalExam,
      g.totalScore,
      g.letterGrade,
      g.gpa,
      `"${g.teacherRemarks.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBSE_Marks_Register_${selectedCourse?.code || 'Subject'}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary stats
  const classAvg = courseGrades.length > 0 
    ? (courseGrades.reduce((acc, g) => acc + g.totalScore, 0) / courseGrades.length).toFixed(1)
    : '0.0';
  const highestScore = courseGrades.length > 0
    ? Math.max(...courseGrades.map(g => g.totalScore))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>CBSE Gradebook & Marks Assessment</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-medium">
              CCE 9-Point Scale
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Periodic Test (20) · Half-Yearly (80) · Lab/Practicals (20) · Pre-Board (80) · Scaled to 100 Marks
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CBSE CSV</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 ${
              hasUnsavedChanges 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Marks Changes</span>
          </button>
        </div>
      </div>

      {/* Subject Selector & Class Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Selector Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
              Select CBSE Subject Code
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:outline-none"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} (Class {c.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Faculty: <strong className="text-slate-700 dark:text-slate-200">{selectedCourse?.teacherName}</strong></span>
            <span>Room: {selectedCourse?.room}</span>
          </div>
        </div>

        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Class Subject Average</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1 block">
            {classAvg}%
          </span>
          <span className="text-[11px] text-slate-500">CBSE Benchmark: 85.0%</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Highest Subject Score</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1 block">
            {highestScore}%
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">A1 Positional Standing</span>
        </div>
      </div>

      {savedNotification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            CBSE subject marks successfully synchronized to academic database.
          </span>
          <span className="text-[10px] font-mono text-emerald-600">Saved</span>
        </div>
      )}

      {/* Spreadsheet Gradebook Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-48">Scholar Name</th>
                <th className="py-3 px-3 text-center">PT Internal (20)</th>
                <th className="py-3 px-3 text-center">Half-Yearly (80)</th>
                <th className="py-3 px-3 text-center">Practical (20)</th>
                <th className="py-3 px-3 text-center">Pre-Board (80)</th>
                <th className="py-3 px-3 text-center">Total (100)</th>
                <th className="py-3 px-3 text-center">CBSE Grade</th>
                <th className="py-3 px-3 text-center">Grade Point</th>
                <th className="py-3 px-4">Faculty Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courseGrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No registered candidates for this CBSE subject code yet.
                  </td>
                </tr>
              ) : (
                courseGrades.map((entry) => {
                  return (
                    <tr key={entry.studentId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                      {/* Name */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {entry.studentName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 block">
                          {entry.studentId}
                        </span>
                      </td>

                      {/* PT Internal Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={entry.assignments}
                          onChange={(e) => handleScoreUpdate(entry.studentId, 'assignments', parseInt(e.target.value))}
                          className="w-16 py-1 px-1.5 text-center font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Half-Yearly Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="80"
                          value={entry.midterm}
                          onChange={(e) => handleScoreUpdate(entry.studentId, 'midterm', parseInt(e.target.value))}
                          className="w-16 py-1 px-1.5 text-center font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Practical Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={entry.project}
                          onChange={(e) => handleScoreUpdate(entry.studentId, 'project', parseInt(e.target.value))}
                          className="w-16 py-1 px-1.5 text-center font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Pre-Board Input */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="80"
                          value={entry.finalExam}
                          onChange={(e) => handleScoreUpdate(entry.studentId, 'finalExam', parseInt(e.target.value))}
                          className="w-16 py-1 px-1.5 text-center font-mono tabular-nums rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Scaled Total */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white text-sm">
                          {entry.totalScore}
                        </span>
                      </td>

                      {/* CBSE Letter Grade */}
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                          entry.letterGrade.startsWith('A')
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : entry.letterGrade.startsWith('B')
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}>
                          {entry.letterGrade}
                        </span>
                      </td>

                      {/* Grade Point */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-slate-300">
                          {entry.gpa.toFixed(1)}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <p className="text-slate-600 dark:text-slate-400 text-xs truncate max-w-xs" title={entry.teacherRemarks}>
                          {entry.teacherRemarks}
                        </p>
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
  );
};
