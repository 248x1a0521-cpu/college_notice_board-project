import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  User,
  Tag,
  AlertTriangle,
  Fingerprint,
  Share2,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { Notice } from '../../types/notice';

interface NoticeDetailScreenProps {
  notice: Notice;
  onBack: () => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export const NoticeDetailScreen: React.FC<NoticeDetailScreenProps> = ({
  notice,
  onBack,
  onDelete,
  isDark,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const formatFullDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const isExpired = notice.expiryDate
    ? new Date(notice.expiryDate).getTime() < Date.now()
    : false;

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return {
          bg: isDark ? 'bg-red-950/70' : 'bg-red-50',
          text: 'text-red-600 dark:text-red-400',
          dot: 'bg-red-500',
        };
      case 'medium':
        return {
          bg: isDark ? 'bg-amber-950/70' : 'bg-amber-50',
          text: 'text-amber-600 dark:text-amber-400',
          dot: 'bg-amber-500',
        };
      case 'low':
      default:
        return {
          bg: isDark ? 'bg-emerald-950/70' : 'bg-emerald-50',
          text: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500',
        };
    }
  };

  const priorityStyle = getPriorityStyle(notice.priority);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none">
      {/* Top Navigation Bar */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
            title="Back to Notice List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Notice Details
          </span>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
          title="Delete notice"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </header>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12">
        {/* Department & Priority Top Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0A2540] dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-900/50">
            <Building className="w-3.5 h-3.5" />
            <span>{notice.department}</span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${priorityStyle.bg} ${priorityStyle.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`} />
            <span>{notice.priority} Priority</span>
          </div>
        </div>

        {/* Full Notice Title */}
        <h1 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
          {notice.title}
        </h1>

        {/* Metadata Information Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
          {/* Publisher */}
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-[#0A2540] dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">
                Published By
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {notice.publisherName}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200/70 dark:bg-slate-700/60" />

          {/* Published Date */}
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#0A2540] dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">
                Published Date & Time
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatFullDate(notice.publishedDate)}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200/70 dark:bg-slate-700/60" />

          {/* Category */}
          <div className="flex items-start gap-2.5">
            <Tag className="w-4 h-4 text-[#0A2540] dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">
                Category
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {notice.category}
              </span>
            </div>
          </div>

          {/* Expiry Date (if present) */}
          {notice.expiryDate && (
            <>
              <div className="h-px bg-slate-200/70 dark:bg-slate-700/60" />
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#0A2540] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider">
                    Notice Expiry Date
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(notice.expiryDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {isExpired ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded-md">
                        Expired
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-green-100 text-green-700 rounded-md">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-slate-200/70 dark:bg-slate-700/60" />

          {/* Notice ID */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Fingerprint className="w-4 h-4 text-[#0A2540] dark:text-blue-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                Notice ID
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(notice.id);
                setCopiedId(true);
                setTimeout(() => setCopiedId(false), 2000);
              }}
              className="font-mono text-[10px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              title="Copy ID"
            >
              <span>{notice.id.slice(0, 18)}...</span>
              {copiedId ? (
                <CheckCircle2 className="w-3 h-3 text-green-500" />
              ) : null}
            </button>
          </div>
        </div>

        {/* Notice Description Section */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Notice Description
          </h2>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line select-text">
              {notice.description}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete (Destructive action protection) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3.5">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white text-center">
              Delete This Notice?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 leading-relaxed">
              Are you sure you want to delete this notice? This action will remove it permanently from local device storage.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDelete(notice.id);
                }}
                className="flex-1 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition active:scale-95"
              >
                Delete Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
