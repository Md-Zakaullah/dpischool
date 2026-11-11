import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BookOpenCheck, 
  Menu
} from 'lucide-react';

interface MobileBottomNavProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentModule,
  onNavigate,
  onOpenMenu
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Scholars', icon: Users },
    { id: 'attendance', label: 'Roll Call', icon: ClipboardCheck },
    { id: 'gradebook', label: 'Grades', icon: BookOpenCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden no-print">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full px-1">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Menu toggle button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5 shrink-0" />
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
