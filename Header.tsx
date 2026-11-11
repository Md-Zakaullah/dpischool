import React from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Calendar, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck,
  Github,
  Download
} from 'lucide-react';
import { UserRole } from '../types/school';
import { ASSETS } from '../data/assets';

interface HeaderProps {
  currentModule: string;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSearch: () => void;
  onNavigate: (module: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenGitHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  role,
  onRoleChange,
  isDark,
  onToggleDark,
  onOpenSearch,
  onNavigate,
  onOpenMobileMenu,
  onOpenGitHub
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 transition-colors no-print">
      {/* Zone 1: Brand title, one line + Mobile Menu trigger */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg -ml-1.5 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <img 
          src={ASSETS.schoolCrest} 
          alt="Delhi Public International Academy Crest" 
          className="w-8 h-8 rounded-full border border-amber-600/40 object-cover shadow-xs" 
          referrerPolicy="no-referrer"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            DPIA Delhi
          </span>
          <span className="text-slate-400 dark:text-slate-600 text-xs hidden sm:inline">/</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:inline">
            {currentModule.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentModule === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
        >
          Overview
        </button>
        <button 
          onClick={() => onNavigate('students')} 
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentModule === 'students' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
        >
          Students
        </button>
        <button 
          onClick={() => onNavigate('attendance')} 
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentModule === 'attendance' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
        >
          Attendance
        </button>
        <button 
          onClick={() => onNavigate('gradebook')} 
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentModule === 'gradebook' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
        >
          Gradebook
        </button>
        <button 
          onClick={() => onNavigate('finance')} 
          className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentModule === 'finance' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
        >
          Tuition
        </button>
      </nav>

      {/* Zone 3: 1 primary action + role and theme utilities */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700/70 transition-colors whitespace-nowrap"
          title="Search directory (Cmd+K)"
          aria-label="Search directory"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick Find</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-400">⌘K</kbd>
        </button>

        {/* GitHub ZIP Export Button */}
        {onOpenGitHub && (
          <button
            onClick={onOpenGitHub}
            className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg shadow-2xs border border-slate-700 transition-colors whitespace-nowrap"
            title="Download ZIP for GitHub"
            aria-label="Download Project ZIP"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub ZIP</span>
          </button>
        )}

        {/* Academic Term indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>CBSE Session 2026-27</span>
        </div>

        {/* Role Preview Selector */}
        <div className="relative">
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="text-xs font-semibold py-1.5 pl-2 pr-6 sm:pr-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[110px] sm:max-w-none truncate"
            aria-label="Switch User Persona View"
          >
            <option value="super_admin">Principal Office</option>
            <option value="faculty">Faculty Portal</option>
            <option value="parent_student">Student / Parent</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDark}
          className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Principal Portrait */}
        <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
          <img 
            src={ASSETS.principalAvatar} 
            alt="Dr. Nandita Sen" 
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
            referrerPolicy="no-referrer"
          />
          <div className="hidden 2xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {role === 'super_admin' ? 'Dr. Nandita Sen' : role === 'faculty' ? 'Dr. Rajeshwar Sharma' : 'Aarav Sharma'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {role === 'super_admin' ? 'Principal & Director' : role === 'faculty' ? 'HOD Science & PGT' : 'Class 12 Scholar'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
