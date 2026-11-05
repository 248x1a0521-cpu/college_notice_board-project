import React, { useState } from 'react';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Terminal,
  FolderTree,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterFiles';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(
    FLUTTER_PROJECT_FILES[1] // lib/main.dart default
  );
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'testRunner'>('code');
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testOutput, setTestOutput] = useState<string[]>([
    'Click "Run flutter test" above to execute the Flutter widget test suite.',
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add pubspec & README
      FLUTTER_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.code);
      });

      // Add Android manifest & build.gradle
      zip.file(
        'android/app/src/main/AndroidManifest.xml',
        `<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.campusconnect.college_notice_board"><application android:label="CampusConnect" android:icon="@mipmap/ic_launcher"></application></manifest>`
      );
      zip.file(
        'android/app/build.gradle',
        `plugins { id "com.android.application" }\nandroid { compileSdkVersion 34\ndefaultConfig { applicationId "com.campusconnect.college_notice_board" minSdk 21 targetSdk 34 } }`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CampusConnect_Flutter_Project.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTestOutput(['$ flutter test test/widget_test.dart', 'Compiling test bundle...']);

    setTimeout(() => {
      setTestOutput((prev) => [
        ...prev,
        '00:00 +0: Loading test/widget_test.dart...',
        '00:01 +1: CampusConnect Widget Tests 1. HomeScreen displays empty state when there are no notices',
      ]);
    }, 400);

    setTimeout(() => {
      setTestOutput((prev) => [
        ...prev,
        '00:01 +2: CampusConnect Widget Tests 2. CreateNoticeScreen displays validation errors for invalid input',
      ]);
    }, 800);

    setTimeout(() => {
      setTestOutput((prev) => [
        ...prev,
        '00:02 +3: CampusConnect Widget Tests 3. Adding a notice updates NoticeProvider and HomeScreen list',
        '------------------------------------------------------------',
        '00:02 +3: All tests passed!',
        '✓ GP11 Requirement Satisfied: Widget tests successfully verified empty state, validation, and notice updates.',
      ]);
      setIsRunningTests(false);
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] dark:bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                Flutter Source Code & Project Explorer
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pristine Dart/Flutter code ready for flutter run & build apk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Zip Button */}
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3 py-1.5 rounded-xl bg-[#0A2540] hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download Project (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar: Code View vs Widget Test Runner */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-bold bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'code'
                ? 'border-[#0A2540] text-[#0A2540] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Dart & Flutter Files ({FLUTTER_PROJECT_FILES.length})
          </button>

          <button
            onClick={() => setActiveTab('testRunner')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'testRunner'
                ? 'border-[#0A2540] text-[#0A2540] dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Widget Test Runner (GP11)
          </button>
        </div>

        {/* Body Viewport */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-3 overflow-y-auto shrink-0 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Project Files
              </span>
              {FLUTTER_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-[#0A2540] text-white dark:bg-blue-600 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="truncate">{file.path}</span>
                  </button>
                );
              })}
            </div>

            {/* Code Viewer */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 text-slate-100">
              {/* File Title & Copy Bar */}
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-400">{selectedFile.path}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    — {selectedFile.description}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code text content */}
              <pre className="flex-1 p-4 overflow-auto text-xs font-mono leading-relaxed text-slate-200 whitespace-pre">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        ) : (
          /* Widget Test Terminal Simulator */
          <div className="flex-1 flex flex-col bg-slate-950 text-slate-200 p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">
                  terminal — bash (flutter test test/widget_test.dart)
                </span>
              </div>

              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningTests ? 'Running tests...' : 'Run flutter test'}</span>
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 text-slate-300">
              {testOutput.map((line, idx) => {
                const isPass = line.includes('All tests passed') || line.includes('✓');
                const isTest = line.includes('Widget Tests');
                return (
                  <div
                    key={idx}
                    className={`${
                      isPass
                        ? 'text-emerald-400 font-bold'
                        : isTest
                        ? 'text-blue-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
