import React from 'react';
import {
  Wifi,
  BatteryMedium,
  Signal,
  Layers,
  Building,
  PlusCircle,
  Settings,
} from 'lucide-react';
import { ScreenName } from '../types/notice';

interface PhoneFrameProps {
  currentScreen: ScreenName;
  onNavigateTab: (tab: 'home' | 'departments' | 'create' | 'settings') => void;
  children: React.ReactNode;
  isDark: boolean;
  deviceMode: 'mobile' | 'tablet' | 'fullscreen';
  isLandscape: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  currentScreen,
  onNavigateTab,
  children,
  isDark,
  deviceMode,
  isLandscape,
}) => {
  // Navigation active tab index (when on detail or create, we highlight the matching tab)
  const activeTab =
    currentScreen === 'home' || currentScreen === 'detail'
      ? 'home'
      : currentScreen;

  // Render bottom bar only if not in create notice or detail notice
  const showBottomNav = currentScreen !== 'detail' && currentScreen !== 'create';

  const frameWidthClass =
    deviceMode === 'fullscreen'
      ? 'w-full max-w-4xl h-[88vh]'
      : deviceMode === 'tablet'
      ? isLandscape
        ? 'w-[820px] h-[520px]'
        : 'w-[540px] h-[760px]'
      : isLandscape
      ? 'w-[720px] h-[380px]'
      : 'w-[375px] h-[720px] sm:w-[390px] sm:h-[750px]';

  return (
    <div
      className={`relative mx-auto transition-all duration-300 flex flex-col ${frameWidthClass} ${
        deviceMode !== 'fullscreen'
          ? 'rounded-[44px] p-3 bg-slate-900 dark:bg-slate-950 shadow-2xl ring-1 ring-slate-800 shadow-slate-950/40'
          : 'rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden'
      }`}
    >
      {/* Phone outer screen boundary */}
      <div className="relative w-full h-full rounded-[36px] bg-white dark:bg-slate-900 overflow-hidden flex flex-col border border-slate-200/50 dark:border-slate-800/80">
        {/* Device Status Bar */}
        <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 shrink-0 z-30 select-none">
          <div className="flex items-center gap-1">
            <span>9:41</span>
          </div>

          {/* Notch / Dynamic Island */}
          {deviceMode === 'mobile' && !isLandscape && (
            <div className="w-24 h-4 bg-slate-900 dark:bg-black rounded-full flex items-center justify-end px-2">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Material 3 Bottom Navigation Bar */}
        {showBottomNav && (
          <nav className="h-16 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 flex items-center justify-around shrink-0 z-30 select-none">
            {/* Tab 1: Notices */}
            <button
              onClick={() => onNavigateTab('home')}
              className="flex-1 flex flex-col items-center justify-center py-1 group transition"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0A2540] dark:text-blue-300'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Layers
                  className={`w-4 h-4 ${
                    activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  activeTab === 'home'
                    ? 'text-[#0A2540] dark:text-blue-300 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Notices
              </span>
            </button>

            {/* Tab 2: Departments */}
            <button
              onClick={() => onNavigateTab('departments')}
              className="flex-1 flex flex-col items-center justify-center py-1 group transition"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'departments'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0A2540] dark:text-blue-300'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Building
                  className={`w-4 h-4 ${
                    activeTab === 'departments' ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  activeTab === 'departments'
                    ? 'text-[#0A2540] dark:text-blue-300 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Departments
              </span>
            </button>

            {/* Tab 3: Post Notice */}
            <button
              onClick={() => onNavigateTab('create')}
              className="flex-1 flex flex-col items-center justify-center py-1 group transition"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'create'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0A2540] dark:text-blue-300'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <PlusCircle
                  className={`w-4 h-4 ${
                    activeTab === 'create' ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  activeTab === 'create'
                    ? 'text-[#0A2540] dark:text-blue-300 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Post
              </span>
            </button>

            {/* Tab 4: Settings */}
            <button
              onClick={() => onNavigateTab('settings')}
              className="flex-1 flex flex-col items-center justify-center py-1 group transition"
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0A2540] dark:text-blue-300'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                <Settings
                  className={`w-4 h-4 ${
                    activeTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                  activeTab === 'settings'
                    ? 'text-[#0A2540] dark:text-blue-300 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Settings
              </span>
            </button>
          </nav>
        )}

        {/* Device Home Indicator Bar */}
        <div className="pb-1 pt-0.5 bg-white dark:bg-slate-900 flex justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
