import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 dark:border-emerald-900/60 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100',
    error: 'border-rose-200 dark:border-rose-900/60 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100',
    info: 'border-sky-200 dark:border-sky-900/60 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100',
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[90vw] sm:max-w-md">
      <div
        className={`px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-md flex items-center gap-2.5 text-xs sm:text-sm font-medium ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="truncate">{toast.message}</span>
      </div>
    </div>
  );
};
