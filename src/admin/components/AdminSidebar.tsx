import React from 'react';
import {
  LayoutDashboard,
  Package,
  Grid,
  ShoppingCart,
  Users,
  Image as ImageIcon,
  Tag,
  BarChart2,
  Settings,
  LogOut,
  Store,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTab } from '../../types/admin';
import { ZoodiLogo } from '../../components/ZoodiLogo';

export const AdminSidebar: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    sidebarOpen,
    setSidebarOpen,
    setIsStoreMode,
    logoutAdmin,
  } = useAdmin();

  const navItems: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'banners', label: 'Posters / Banners', icon: ImageIcon },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container (Matching Screen 1 in mockup) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 select-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between pb-6 pt-2 border-b border-slate-800/80">
            <ZoodiLogo size="md" subtitle="ADMIN PORTAL" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAdminTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#E11D48] text-white shadow-md shadow-rose-900/30 font-extrabold translate-x-1'
                      : 'hover:bg-slate-800/70 hover:text-white text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Storefront & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          {/* Switch to Storefront Button */}
          <button
            type="button"
            onClick={() => setIsStoreMode(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-bold border border-pink-500/30 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Customer Storefront</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout & Lock</span>
          </button>
        </div>
      </aside>
    </>
  );
};
