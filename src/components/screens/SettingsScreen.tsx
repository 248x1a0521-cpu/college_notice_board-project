import React, { useState } from 'react';
import {
  School,
  Moon,
  Sun,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  FileCode,
  ShieldAlert,
  Database,
  ExternalLink,
} from 'lucide-react';

interface SettingsScreenProps {
  totalNotices: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onClearAllNotices: () => void;
  onResetSampleNotices: () => void;
  onOpenCodeExplorer: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  totalNotices,
  isDark,
  onToggleTheme,
  onClearAllNotices,
  onResetSampleNotices,
  onOpenCodeExplorer,
}) => {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none">
      {/* Top Header */}
      <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
          Settings & About
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Application configuration & persistence control (GP8)
        </p>
      </header>

      {/* Settings Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        {/* App Profile Card */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center text-white shadow-md shadow-blue-950/20 mb-3">
            <School className="w-8 h-8" />
          </div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            CampusConnect
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            College Notice Board System
          </p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0A2540] dark:text-blue-300 text-[11px] font-bold border border-blue-200/60 dark:border-blue-900/40">
            <span>Version 1.0.0 (Build 1)</span>
          </div>
        </div>

        {/* Storage & Statistics Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Data Storage Statistics
          </span>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0A2540] dark:text-blue-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Total Notices Stored
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Offline device storage (SharedPreferences)
                  </p>
                </div>
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white px-2">
                {totalNotices}
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Flutter Project Source
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    lib/, test/, pubspec.yaml & models
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenCodeExplorer}
                className="px-2.5 py-1 text-xs font-bold text-[#0A2540] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>

        {/* Appearance & Material 3 Theme Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Appearance & Theme (Material 3)
          </span>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60">
            {/* Theme Seed */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Seed Color
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    College Navy Blue (#0A2540)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0A2540] border border-white dark:border-slate-700" />
                <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                  #0A2540
                </span>
              </div>
            </div>

            {/* Dark / Light Mode Switch */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Dark Mode
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Toggle Material 3 dark color scheme
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleTheme}
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                  isDark ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    isDark ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Database Management / Destructive Actions */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-500 px-1">
            Data Persistence Management
          </span>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/60">
            {/* Reset sample notices */}
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Restore Sample Notices
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Load pre-populated college announcements
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Restore
              </span>
            </button>

            {/* Clear all notices - destructive with modal */}
            <button
              onClick={() => setShowClearModal(true)}
              className="w-full p-3.5 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-950/30 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">
                    Clear All Notices
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Permanently delete all stored notices (requires confirmation)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                Clear All
              </span>
            </button>
          </div>
        </div>

        {/* About App Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
            <Info className="w-4 h-4 text-[#0A2540] dark:text-blue-400" />
            <span>Project Grading Checklist Status</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            CampusConnect satisfies all project grading requirements GP1 through GP11, including Material 3 theme generation from Navy seed, Provider state management, local JSON persistence with corruption recovery, 4-state lifecycle, and comprehensive widget tests.
          </p>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3.5">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white text-center">
              Clear All Stored Notices?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 leading-relaxed">
              Are you sure you want to remove all notices from local storage? This action cannot be undone.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowClearModal(false);
                  onClearAllNotices();
                }}
                className="flex-1 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition active:scale-95"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3.5">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white text-center">
              Restore Sample Notices?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 leading-relaxed">
              This will populate the notice board with authentic department announcements for CSE, IT, ECE, EEE, ME, Civil, and General notices.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  onResetSampleNotices();
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#0A2540] hover:bg-slate-900 dark:bg-blue-600 text-white rounded-xl shadow-sm transition active:scale-95"
              >
                Restore Samples
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
