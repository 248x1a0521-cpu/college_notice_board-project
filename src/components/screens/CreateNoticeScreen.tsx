import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building2,
  Tag,
  User,
  Sparkles,
  Send,
} from 'lucide-react';
import { Notice, Department, Category, Priority } from '../../types/notice';

interface CreateNoticeScreenProps {
  onBack: () => void;
  onSaveNotice: (newNotice: Omit<Notice, 'id' | 'publishedDate'>) => Promise<boolean>;
  isDark: boolean;
}

const DEPARTMENTS: Department[] = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering',
  'General / All Departments',
];

const CATEGORIES: Category[] = [
  'Academic',
  'Examination',
  'Placement & Training',
  'Sports & Cultural',
  'Administrative',
  'Hostel & Transport',
];

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export const CreateNoticeScreen: React.FC<CreateNoticeScreenProps> = ({
  onBack,
  onSaveNotice,
  isDark,
}) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [publisherName, setPublisherName] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    // 1. Title validation
    if (!title || title.trim().length === 0) {
      errs.title = 'Notice title is required';
    } else if (title.trim().length < 5) {
      errs.title = 'Title must be at least 5 characters long';
    } else if (title.trim().length > 120) {
      errs.title = 'Title cannot exceed 120 characters';
    }

    // 2. Department validation
    if (!department) {
      errs.department = 'Please select a valid department';
    }

    // 3. Category validation
    if (!category) {
      errs.category = 'Please select a notice category';
    }

    // 4. Priority validation
    if (!priority) {
      errs.priority = 'Please select a priority level';
    }

    // 5. Publisher Name validation
    if (!publisherName || publisherName.trim().length === 0) {
      errs.publisherName = 'Publisher name or designation is required';
    } else if (publisherName.trim().length < 3) {
      errs.publisherName = 'Publisher name must be at least 3 characters';
    } else if (publisherName.trim().length > 80) {
      errs.publisherName = 'Publisher name cannot exceed 80 characters';
    }

    // 6. Description validation
    if (!description || description.trim().length === 0) {
      errs.description = 'Notice description is required';
    } else if (description.trim().length < 20) {
      errs.description = `Description must be at least 20 characters (currently ${description.trim().length})`;
    } else if (description.trim().length > 2500) {
      errs.description = 'Description cannot exceed 2500 characters';
    }

    // 7. Expiry Date validation (if set, should not be past date)
    if (expiryDate) {
      const selected = new Date(expiryDate).getTime();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today.getTime()) {
        errs.expiryDate = 'Expiry date cannot be in the past';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      department: true,
      category: true,
      publisherName: true,
    });

    if (!validate()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const success = await onSaveNotice({
        title: title.trim(),
        description: description.trim(),
        department: department as Department,
        category: category as Category,
        priority,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        publisherName: publisherName.trim(),
      });

      if (success) {
        // Clear form
        setTitle('');
        setDescription('');
        setDepartment('');
        setCategory('');
        setPriority('Medium');
        setExpiryDate('');
        setPublisherName('');
        setErrors({});
        onBack();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityTheme = (p: Priority) => {
    switch (p) {
      case 'High':
        return {
          active: 'bg-red-500 text-white border-red-500 shadow-xs',
          inactive: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60',
        };
      case 'Medium':
        return {
          active: 'bg-amber-500 text-white border-amber-500 shadow-xs',
          inactive: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
        };
      case 'Low':
      default:
        return {
          active: 'bg-emerald-500 text-white border-emerald-500 shadow-xs',
          inactive: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
            title="Cancel & Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              Create College Notice
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Form validation strictly applied (GP6)
            </p>
          </div>
        </div>

        {/* Quick Fill Demo Helper Button */}
        <button
          type="button"
          onClick={() => {
            setTitle('Campus Annual Sports & Cultural Fest – Euphoria 2026');
            setDescription(
              'The Department of Physical Education and Student Council invites student registrations for track events, inter-department cricket tournaments, debate, and music battles. Registration forms are accessible at the sports complex helpdesk before Friday 4 PM.'
            );
            setDepartment('General / All Departments');
            setCategory('Sports & Cultural');
            setPriority('High');
            setPublisherName('Sports Committee Chairman');
            setErrors({});
          }}
          className="text-[10px] font-bold text-[#0A2540] dark:text-blue-400 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
        >
          <Sparkles className="w-3 h-3" />
          Fill Sample
        </button>
      </header>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24"
      >
        {/* Field 1: Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Notice Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            maxLength={120}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) validate();
            }}
            placeholder="e.g., Mid-Term Examination Timetable & Seating Plan"
            className={`w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.title
                ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
                : 'border-slate-300 dark:border-slate-700 focus:ring-[#0A2540] dark:focus:ring-blue-500'
            } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition`}
          />
          <div className="flex items-center justify-between mt-1 text-[10px]">
            {errors.title ? (
              <span className="text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.title}
              </span>
            ) : (
              <span className="text-slate-400">Min 5 characters</span>
            )}
            <span className="text-slate-400">{title.length}/120</span>
          </div>
        </div>

        {/* Field 2: Department Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value as Department);
                if (errors.department) validate();
              }}
              className={`w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                errors.department
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition`}
            >
              <option value="">Select Target Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          {errors.department && (
            <span className="text-red-500 flex items-center gap-1 font-medium mt-1 text-[10px]">
              <AlertCircle className="w-3 h-3" />
              {errors.department}
            </span>
          )}
        </div>

        {/* Field 3: Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Notice Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              if (errors.category) validate();
            }}
            className={`w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.category
                ? 'border-red-400 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-700'
            } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition`}
          >
            <option value="">Select Notice Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500 flex items-center gap-1 font-medium mt-1 text-[10px]">
              <AlertCircle className="w-3 h-3" />
              {errors.category}
            </span>
          )}
        </div>

        {/* Field 4: Priority Level */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = priority === p;
              const pTheme = getPriorityTheme(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? pTheme.active
                      : `bg-slate-50 dark:bg-slate-800/80 ${pTheme.inactive} hover:bg-slate-100`
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 5: Expiry Date (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Notice Expiry Date (Optional)
          </label>
          <div className="relative">
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition"
            />
          </div>
          {errors.expiryDate ? (
            <span className="text-red-500 flex items-center gap-1 font-medium mt-1 text-[10px]">
              <AlertCircle className="w-3 h-3" />
              {errors.expiryDate}
            </span>
          ) : (
            <span className="text-slate-400 text-[10px] mt-0.5 block">
              Leave blank if notice has no expiration deadline
            </span>
          )}
        </div>

        {/* Field 6: Publisher Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Publisher Name / Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={publisherName}
            maxLength={80}
            onChange={(e) => {
              setPublisherName(e.target.value);
              if (errors.publisherName) validate();
            }}
            placeholder="e.g., Dr. A. Sharma, Head of Department"
            className={`w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.publisherName
                ? 'border-red-400 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-700'
            } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition`}
          />
          <div className="flex items-center justify-between mt-1 text-[10px]">
            {errors.publisherName ? (
              <span className="text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.publisherName}
              </span>
            ) : (
              <span className="text-slate-400">Min 3 characters</span>
            )}
            <span className="text-slate-400">{publisherName.length}/80</span>
          </div>
        </div>

        {/* Field 7: Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
            Notice Content / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            maxLength={2500}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) validate();
            }}
            placeholder="Provide comprehensive details: schedule, instructions, venue, eligibility, and deadlines (minimum 20 characters)..."
            className={`w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
              errors.description
                ? 'border-red-400 dark:border-red-500'
                : 'border-slate-300 dark:border-slate-700'
            } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-blue-500 transition`}
          />
          <div className="flex items-center justify-between mt-1 text-[10px]">
            {errors.description ? (
              <span className="text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </span>
            ) : (
              <span className="text-slate-400">Min 20 characters</span>
            )}
            <span className="text-slate-400">{description.length}/2500</span>
          </div>
        </div>

        {/* Submit Button - disabled while saving */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
              isSubmitting
                ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed'
                : 'bg-[#0A2540] hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-950/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Notice...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish College Notice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
