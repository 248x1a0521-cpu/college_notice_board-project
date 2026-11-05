import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  AlertCircle,
  Megaphone,
  Clock,
  Tag,
  ArrowUpDown,
  Building2,
  Calendar,
} from 'lucide-react';
import { Notice, Department, SortOrder } from '../../types/notice';

interface HomeScreenProps {
  notices: Notice[];
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  onSelectNotice: (notice: Notice) => void;
  onNavigateToCreate: () => void;
  simulationState: 'normal' | 'loading' | 'error' | 'empty';
  onRetry: () => void;
  onReload: () => void;
  isDark: boolean;
}

const DEPARTMENTS: string[] = [
  'All',
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering',
  'General / All Departments',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  notices,
  selectedDepartment,
  onSelectDepartment,
  onSelectNotice,
  onNavigateToCreate,
  simulationState,
  onRetry,
  onReload,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Department short label helper
  const getDeptShort = (dept: string) => {
    if (dept === 'All') return 'All';
    if (dept.includes('(')) {
      const match = dept.match(/\(([^)]+)\)/);
      return match ? match[1] : dept;
    }
    if (dept.includes('Civil')) return 'CIVIL';
    return dept;
  };

  // Dual filtering: search query + department filter + sorting
  const filteredNotices = useMemo(() => {
    if (simulationState === 'empty') return [];

    let list = [...notices];

    // 1. Department Filter
    if (selectedDepartment !== 'All') {
      list = list.filter(
        (n) => n.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    // 2. Search Query Filter (by title)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((n) => n.title.toLowerCase().includes(q));
    }

    // 3. Sorting
    list.sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [notices, selectedDepartment, searchQuery, sortOrder, simulationState]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          bg: isDark ? 'bg-red-950/70' : 'bg-red-50',
          text: 'text-red-600 dark:text-red-400',
          dot: 'bg-red-500',
          border: 'border-red-200 dark:border-red-900/50',
        };
      case 'medium':
        return {
          bg: isDark ? 'bg-amber-950/70' : 'bg-amber-50',
          text: 'text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500',
          border: 'border-amber-200 dark:border-amber-900/50',
        };
      case 'low':
      default:
        return {
          bg: isDark ? 'bg-emerald-950/70' : 'bg-emerald-50',
          text: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          border: 'border-emerald-200 dark:border-emerald-900/50',
        };
    }
  };

  return (
    <div className="flex flex-col h-full relative select-none">
      {/* Top App Bar - Material 3 */}
      <header className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0A2540] dark:bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              CampusConnect
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              College Notice Board
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sort Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Sort Notices"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 text-xs font-medium">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Sort by Date
                </div>
                <button
                  onClick={() => {
                    setSortOrder('newest');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                    sortOrder === 'newest'
                      ? 'text-[#0A2540] dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Newest first</span>
                  {sortOrder === 'newest' && <span className="text-xs">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setSortOrder('oldest');
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                    sortOrder === 'oldest'
                      ? 'text-[#0A2540] dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Oldest first</span>
                  {sortOrder === 'oldest' && <span className="text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onReload}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reload notices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Filter and Search Container */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices by title..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Horizontal Department Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDepartment === dept;
            const shortLabel = getDeptShort(dept);
            return (
              <button
                key={dept}
                onClick={() => onSelectDepartment(dept)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#0A2540] text-white shadow-sm dark:bg-blue-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>

        {/* Active Filters / Total Count row */}
        <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Total:{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">
              {filteredNotices.length} notice
              {filteredNotices.length === 1 ? '' : 's'}
            </strong>
          </span>

          {(searchQuery || selectedDepartment !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectDepartment('All');
              }}
              className="text-[#0A2540] dark:text-blue-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Body - 4 States */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-2.5 pb-20">
        {/* State 1: Loading */}
        {simulationState === 'loading' && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-10 h-10 border-3 border-[#0A2540] dark:border-blue-400 border-t-transparent rounded-full animate-spin mb-3.5" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Loading college notices...
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Simulating SharedPreferences local fetch
            </p>
          </div>
        )}

        {/* State 2: Error State */}
        {simulationState === 'error' && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400 mb-3.5">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Unable to Load Notices
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[260px]">
              Could not retrieve stored announcements from local device storage.
            </p>
            <button
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-[#0A2540] hover:bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Now
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {simulationState === 'normal' && filteredNotices.length === 0 && (
          <div className="flex flex-col items-center justify-center h-72 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0A2540] dark:text-blue-400 mb-3.5">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {searchQuery || selectedDepartment !== 'All'
                ? 'No matching notices found'
                : 'No notices available'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[260px] leading-relaxed">
              {searchQuery || selectedDepartment !== 'All'
                ? `No announcements match "${searchQuery}" in ${getDeptShort(
                    selectedDepartment
                  )}.`
                : 'The college notice board is currently empty. Tap the button below to publish the first notice.'}
            </p>
            {searchQuery || selectedDepartment !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSelectDepartment('All');
                }}
                className="mt-4 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Clear Search & Filter
              </button>
            ) : (
              <button
                onClick={onNavigateToCreate}
                className="mt-4 px-4 py-2 bg-[#0A2540] dark:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Notice
              </button>
            )}
          </div>
        )}

        {/* State 4: Data State (List of Notices) */}
        {simulationState === 'normal' &&
          filteredNotices.map((notice) => {
            const pStyle = getPriorityStyle(notice.priority);
            return (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group active:scale-[0.99]"
              >
                {/* Header: Dept Badge & Priority Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-[#0A2540] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/50 truncate max-w-[200px]">
                    {notice.department}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${pStyle.bg} ${pStyle.text} ${pStyle.border} shrink-0`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                    {notice.priority.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#0A2540] dark:group-hover:text-blue-400 transition-colors">
                  {notice.title}
                </h2>

                {/* Short description */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {notice.description}
                </p>

                {/* Footer: Category & Date */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {notice.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(notice.publishedDate)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Floating Action Button - Material 3 standard */}
      <button
        onClick={onNavigateToCreate}
        className="absolute bottom-4 right-4 h-13 px-4 rounded-2xl bg-[#0A2540] dark:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-950/20 hover:bg-slate-900 dark:hover:bg-blue-500 transition-all active:scale-95 z-20"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>Post Notice</span>
      </button>
    </div>
  );
};
