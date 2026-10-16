import React from 'react';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const AdminFeedback: React.FC = () => {
  const { setAdminTab } = useAdmin();

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Top back */}
      <button
        type="button"
        onClick={() => setAdminTab('dashboard')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Feedback Card (Matching Screen 16 in mockup) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-16 h-16 rounded-3xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8" />
        </div>

        <div className="flex items-center gap-1 text-amber-400 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>

        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          No Feedback Yet
        </h2>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Customer feedback and product reviews will appear here once received.
        </p>
      </div>
    </div>
  );
};
