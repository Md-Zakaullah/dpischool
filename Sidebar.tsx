import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarClock, 
  ClipboardCheck, 
  BookOpenCheck, 
  CreditCard, 
  BellRing, 
  UserCheck,
  Building2,
  ChevronRight,
  Bus,
  Github,
  Download
} from 'lucide-react';
import { UserRole } from '../types/school';
import { ASSETS } from '../data/assets';

interface SidebarProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  role: UserRole;
  unreadNoticesCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenGitHub?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onNavigate,
  role,
  unreadNoticesCount,
  isOpenMobile = false,
  onCloseMobile,
  onOpenGitHub
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users, badge: '1,428' },
    { id: 'faculty', label: 'Faculty & Staff', icon: GraduationCap, badge: '94' },
    { id: 'timetable', label: 'Timetable & Periods', icon: CalendarClock },
    { id: 'attendance', label: 'Daily Roll Call', icon: ClipboardCheck },
    { id: 'gradebook', label: 'Gradebook & GPA', icon: BookOpenCheck },
    { id: 'finance', label: 'Tuition & Billing', icon: CreditCard, alert: true },
    { id: 'transport', label: 'Bus Transport & GPS', icon: Bus, badge: '18 Buses' },
    { id: 'notices', label: 'Campus Notices', icon: BellRing, badge: unreadNoticesCount > 0 ? `${unreadNoticesCount}` : undefined },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 md:static md:z-auto
        w-72 md:w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        flex flex-col justify-between h-screen transition-transform duration-300 ease-in-out no-print
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
      {/* Academy Brand Lockup */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={ASSETS.schoolCrest} 
            alt="Delhi Public Academy Emblem" 
            className="w-10 h-10 rounded-full border border-amber-600/40 object-cover shadow-xs shrink-0" 
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
              Delhi Public Academy
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              CBSE Affiliated · Estd. 1988
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="md:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            aria-label="Close menu"
          >
            <span className="text-xl font-medium leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          Academy Operations
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors group text-left min-h-[44px] ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {item.badge}
                </span>
              )}
              {item.alert && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              )}
            </button>
          );
        })}

        {/* Dedicated Persona View */}
        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/70">
          <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Persona Portal
          </p>
          <button
            onClick={() => handleItemClick('portal')}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors group text-left min-h-[44px] ${
              currentModule === 'portal'
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Student / Family Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* GitHub Codebase Export */}
          {onOpenGitHub && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenGitHub();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors group min-h-[44px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Github className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                  <span className="truncate">Download GitHub ZIP</span>
                </div>
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile & Campus Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate">
              Pushp Vihar Campus
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <span>New Delhi</span>
              <span>·</span>
              <span>Nov 6, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
