import React from 'react';
import {
  Code,
  Laptop,
  Cpu,
  Zap,
  Cog,
  Building,
  Globe2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Department, Notice } from '../../types/notice';

interface DepartmentScreenProps {
  notices: Notice[];
  onSelectDepartment: (dept: Department | 'All') => void;
  isDark: boolean;
}

interface DeptItem {
  name: Department;
  code: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
  bgDark: string;
  description: string;
}

const DEPARTMENTS_DATA: DeptItem[] = [
  {
    name: 'General / All Departments',
    code: 'GEN',
    icon: Globe2,
    color: 'text-sky-600 dark:text-sky-400',
    bgLight: 'bg-sky-50 border-sky-200/80',
    bgDark: 'dark:bg-sky-950/40 dark:border-sky-900/40',
    description: 'Campus-wide announcements, admissions, schedules & central notices',
  },
  {
    name: 'Computer Science and Engineering (CSE)',
    code: 'CSE',
    icon: Code,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgLight: 'bg-indigo-50 border-indigo-200/80',
    bgDark: 'dark:bg-indigo-950/40 dark:border-indigo-900/40',
    description: 'AI, Systems, programming competitions, hackathons & lab sessions',
  },
  {
    name: 'Information Technology (IT)',
    code: 'IT',
    icon: Laptop,
    color: 'text-blue-600 dark:text-blue-400',
    bgLight: 'bg-blue-50 border-blue-200/80',
    bgDark: 'dark:bg-blue-950/40 dark:border-blue-900/40',
    description: 'Cloud networks, data engineering, symposiums & placements',
  },
  {
    name: 'Electronics and Communication Engineering (ECE)',
    code: 'ECE',
    icon: Cpu,
    color: 'text-pink-600 dark:text-pink-400',
    bgLight: 'bg-pink-50 border-pink-200/80',
    bgDark: 'dark:bg-pink-950/40 dark:border-pink-900/40',
    description: 'VLSI, embedded systems, microcontrollers, robotics & hardware',
  },
  {
    name: 'Electrical and Electronics Engineering (EEE)',
    code: 'EEE',
    icon: Zap,
    color: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 border-amber-200/80',
    bgDark: 'dark:bg-amber-950/40 dark:border-amber-900/40',
    description: 'Power systems, smart grid, electric vehicles & high voltage labs',
  },
  {
    name: 'Mechanical Engineering (ME)',
    code: 'ME',
    icon: Cog,
    color: 'text-orange-600 dark:text-orange-400',
    bgLight: 'bg-orange-50 border-orange-200/80',
    bgDark: 'dark:bg-orange-950/40 dark:border-orange-900/40',
    description: 'Thermodynamics, robotics, automotive workshops & CAD/CAM',
  },
  {
    name: 'Civil Engineering',
    code: 'CIVIL',
    icon: Building,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 border-emerald-200/80',
    bgDark: 'dark:bg-emerald-950/40 dark:border-emerald-900/40',
    description: 'Structural designs, surveying, geotech & site inspection visits',
  },
];

export const DepartmentScreen: React.FC<DepartmentScreenProps> = ({
  notices,
  onSelectDepartment,
  isDark,
}) => {
  // Compute department counts dynamically
  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    DEPARTMENTS_DATA.forEach((d) => {
      map[d.name] = 0;
    });

    notices.forEach((n) => {
      if (map[n.department] !== undefined) {
        map[n.department]++;
      } else {
        map[n.department] = (map[n.department] || 0) + 1;
      }
    });

    return map;
  }, [notices]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none">
      {/* Top Header */}
      <header className="px-4 pt-3 pb-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
          Academic Departments
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Tap any department to view its filtered notices (GP7)
        </p>
      </header>

      {/* Department Cards List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 pb-20">
        {DEPARTMENTS_DATA.map((dept) => {
          const Icon = dept.icon;
          const count = counts[dept.name] || 0;

          return (
            <div
              key={dept.name}
              onClick={() => onSelectDepartment(dept.name)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              {/* Left: Icon & Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${dept.bgLight} ${dept.bgDark} ${dept.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider ${dept.color}`}
                    >
                      {dept.code}
                    </span>
                  </div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0A2540] dark:group-hover:text-blue-400 transition-colors">
                    {dept.name}
                  </h2>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                    {dept.description}
                  </p>
                </div>
              </div>

              {/* Right: Count Badge & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 text-xs font-extrabold rounded-full transition-colors ${
                    count > 0
                      ? 'bg-[#0A2540] text-white dark:bg-blue-600'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-700/60 dark:text-slate-500'
                  }`}
                >
                  {count}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
