import React from 'react';
import {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingCart,
  MoreHorizontal,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTab } from '../../types/admin';

export const AdminBottomNav: React.FC = () => {
  const { adminTab, setAdminTab, setSidebarOpen } = useAdmin();

  const tabs: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <nav className="lg:hidden sticky bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = adminTab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setAdminTab(t.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive
                ? 'text-pink-600 dark:text-pink-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{t.label}</span>
          </button>
        );
      })}

      {/* More / Menu */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px]">More</span>
      </button>
    </nav>
  );
};
