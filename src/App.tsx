import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  Tablet,
  Maximize2,
  RotateCw,
  Sun,
  Moon,
  FileCode,
  Award,
  Download,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Notice, Department, ScreenName } from './types/notice';
import { INITIAL_SAMPLE_NOTICES } from './data/sampleNotices';
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { NoticeDetailScreen } from './components/screens/NoticeDetailScreen';
import { CreateNoticeScreen } from './components/screens/CreateNoticeScreen';
import { DepartmentScreen } from './components/screens/DepartmentScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { GradingRubricModal } from './components/GradingRubricModal';

const STORAGE_KEY = 'campus_connect_notices_v1';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Device simulation options
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'fullscreen'>('mobile');
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Active Screen
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  // Notices List with local persistence
  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored notices:', e);
    }
    return INITIAL_SAMPLE_NOTICES;
  });

  // Simulation State: normal, loading, error, empty
  const [simulationState, setSimulationState] = useState<
    'normal' | 'loading' | 'error' | 'empty'
  >('normal');

  // Modals
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);

  // SnackBar / Toast System
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Persist notices to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.error('Failed to persist to localStorage:', e);
    }
  }, [notices]);

  // Sync dark theme class on root element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add Notice
  const handleSaveNotice = async (
    newNoticeData: Omit<Notice, 'id' | 'publishedDate'>
  ): Promise<boolean> => {
    // Generate UUID-like unique ID
    const newNotice: Notice = {
      ...newNoticeData,
      id: `notice-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      publishedDate: new Date().toISOString(),
    };

    // Simulate 350ms async storage delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    setNotices((prev) => [newNotice, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {}

    showToast('Notice published successfully to college board!');
    return true;
  };

  // Delete Notice
  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setCurrentScreen('home');
    setSelectedNotice(null);
    showToast('Notice deleted from local storage', 'info');
  };

  // Clear All Notices
  const handleClearAllNotices = () => {
    setNotices([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast('All notices cleared from storage', 'info');
  };

  // Restore Sample Notices
  const handleResetSampleNotices = () => {
    setNotices(INITIAL_SAMPLE_NOTICES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_NOTICES));
    showToast('Sample notices restored for all departments');
  };

  // Navigation handlers
  const handleSelectNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setCurrentScreen('detail');
  };

  const handleSelectDepartment = (dept: string) => {
    setSelectedDepartment(dept);
    setCurrentScreen('home');
  };

  const handleNavigateTab = (
    tab: 'home' | 'departments' | 'create' | 'settings'
  ) => {
    setCurrentScreen(tab);
    if (tab === 'home') {
      setSelectedNotice(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Global Command Bar */}
      <header className="px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-40">
        {/* App Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] flex items-center justify-center text-white font-extrabold shadow-sm">
            CC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                CampusConnect
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-950/80 text-[#0A2540] dark:text-blue-300">
                Flutter & Material 3
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              College Notice Board Mobile App Simulator & Project Hub
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Rubric Checklist Button */}
          <button
            onClick={() => setIsRubricModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
            title="Inspect GP1-GP11 Grading Rubric"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grading Rubric</span>
            <span className="text-[10px] bg-amber-200 dark:bg-amber-900/80 px-1 rounded-sm">
              GP1-11
            </span>
          </button>

          {/* View Flutter Source Code Button */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0A2540] hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            title="View Flutter Project Source & Tests"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Flutter Code</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Device Frame Mode Picker */}
          <div className="hidden lg:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-[#0A2540] dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Mobile Phone View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                deviceMode === 'tablet'
                  ? 'bg-white dark:bg-slate-700 text-[#0A2540] dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                deviceMode === 'fullscreen'
                  ? 'bg-white dark:bg-slate-700 text-[#0A2540] dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Full Window View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Orientation Toggle */}
          {deviceMode !== 'fullscreen' && (
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Rotate Screen (Portrait / Landscape)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Interactive Simulation State Switcher Bar */}
      <div className="bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs shrink-0 z-30">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Simulate 4 States (GP4):
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSimulationState('normal')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              simulationState === 'normal'
                ? 'bg-[#0A2540] text-white shadow-xs dark:bg-blue-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            Data State ({notices.length})
          </button>

          <button
            onClick={() => setSimulationState('loading')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              simulationState === 'loading'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Loading State
          </button>

          <button
            onClick={() => setSimulationState('error')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              simulationState === 'error'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Storage Error State
          </button>

          <button
            onClick={() => setSimulationState('empty')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
              simulationState === 'empty'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Empty State
          </button>
        </div>
      </div>

      {/* Main Workspace: Device Simulator */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden relative">
        <PhoneFrame
          currentScreen={currentScreen}
          onNavigateTab={handleNavigateTab}
          isDark={isDark}
          deviceMode={deviceMode}
          isLandscape={isLandscape}
        >
          {/* Active Screen Display */}
          {currentScreen === 'home' && (
            <HomeScreen
              notices={notices}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={setSelectedDepartment}
              onSelectNotice={handleSelectNotice}
              onNavigateToCreate={() => setCurrentScreen('create')}
              simulationState={simulationState}
              onRetry={() => {
                setSimulationState('loading');
                setTimeout(() => setSimulationState('normal'), 800);
              }}
              onReload={() => {
                setSimulationState('loading');
                setTimeout(() => setSimulationState('normal'), 600);
              }}
              isDark={isDark}
            />
          )}

          {currentScreen === 'detail' && selectedNotice && (
            <NoticeDetailScreen
              notice={selectedNotice}
              onBack={() => setCurrentScreen('home')}
              onDelete={handleDeleteNotice}
              isDark={isDark}
            />
          )}

          {currentScreen === 'create' && (
            <CreateNoticeScreen
              onBack={() => setCurrentScreen('home')}
              onSaveNotice={handleSaveNotice}
              isDark={isDark}
            />
          )}

          {currentScreen === 'departments' && (
            <DepartmentScreen
              notices={notices}
              onSelectDepartment={handleSelectDepartment}
              isDark={isDark}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              totalNotices={notices.length}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              onClearAllNotices={handleClearAllNotices}
              onResetSampleNotices={handleResetSampleNotices}
              onOpenCodeExplorer={() => setIsCodeModalOpen(true)}
            />
          )}
        </PhoneFrame>

        {/* Floating SnackBar Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0A2540] dark:bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-white/20 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
        )}
      </main>

      {/* Code Explorer & Widget Test Modal */}
      <CodeExplorerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        isDark={isDark}
      />

      {/* Grading Rubric Modal */}
      <GradingRubricModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
