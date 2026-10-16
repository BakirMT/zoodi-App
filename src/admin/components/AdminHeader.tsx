import React, { useState } from 'react';
import { Menu, Bell, Store, Calendar, ArrowLeft, UserCheck, Edit3, X, Check, Camera, Upload } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { ZoodiLogo } from '../../components/ZoodiLogo';
import { AdminNotificationsPopover } from './AdminNotificationsPopover';

export const AdminHeader: React.FC = () => {
  const { setSidebarOpen, setIsStoreMode, adminTab, setAdminTab, adminProfile, updateAdminProfile } = useAdmin();
  const { showToast } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Edit Admin Profile Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(adminProfile.name);
  const [editRole, setEditRole] = useState(adminProfile.role);
  const [editAvatar, setEditAvatar] = useState(adminProfile.avatar);

  const handleOpenProfileModal = () => {
    setEditName(adminProfile.name);
    setEditRole(adminProfile.role);
    setEditAvatar(adminProfile.avatar);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Please enter an admin name.', 'error');
      return;
    }
    updateAdminProfile({
      name: editName.trim(),
      role: editRole.trim() || 'Admin',
      avatar: editAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    });
    showToast(`Admin profile updated to "${editName.trim()}".`);
    setShowProfileModal(false);
  };

  const isDrillDown = [
    'order_detail',
    'customer_detail',
    'banner_detail',
    'add_product',
    'product_detail',
    'feedback',
  ].includes(adminTab);

  const getBackTab = () => {
    if (adminTab === 'order_detail') return 'orders';
    if (adminTab === 'customer_detail') return 'customers';
    if (adminTab === 'banner_detail') return 'banners';
    if (adminTab === 'add_product' || adminTab === 'product_detail') return 'products';
    return 'dashboard';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          {/* Toggle Sidebar or Back button */}
          {isDrillDown ? (
            <button
              type="button"
              onClick={() => setAdminTab(getBackTab())}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-pink-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="lg:hidden">
            <ZoodiLogo size="sm" showSubtitle={false} />
          </div>

          {/* Date Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>Oct 2, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Switch to Customer Storefront */}
          <button
            type="button"
            onClick={() => setIsStoreMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:bg-pink-100 text-xs font-bold border border-pink-200 dark:border-pink-800/60 transition-all active:scale-95"
            title="Switch to customer storefront view"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                isNotificationsOpen
                  ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Admin Notifications"
              aria-label="Admin Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            <AdminNotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              onUnreadChange={(count) => setUnreadCount(count)}
            />
          </div>

          {/* Clickable Admin Avatar / Profile Widget - Matching image.png with Edit Option */}
          <button
            type="button"
            onClick={handleOpenProfileModal}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
            title="Click to edit Admin Name and Profile Photo"
          >
            <div className="relative">
              <img
                src={adminProfile.avatar}
                alt={adminProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500/30 group-hover:ring-pink-500 transition-all"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[8px]">
                <Edit3 className="w-2 h-2" />
              </span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-pink-600 transition-colors">
                {adminProfile.name}
              </span>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">
                {adminProfile.role}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Edit Admin Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-[#DF1951] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Change Admin Profile Name
                  </h3>
                  <p className="text-[11px] text-slate-400">Update your store administrative name and photo</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="py-4 space-y-4">
              {/* Avatar Preview & File Upload / URL Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Admin Profile Picture
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-pink-500/20 shrink-0 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={editAvatar}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 text-pink-500" />
                      <span>Upload Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              showToast('Image size must be under 5MB', 'error');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setEditAvatar(event.target.result as string);
                                showToast('Photo loaded from device!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">Or paste image URL below</p>
                  </div>
                </div>

                <div className="mt-2.5">
                  <input
                    type="url"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Admin Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Admin Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter admin name (e.g. Afneel, Store Owner)..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Admin Role / Title Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Admin Title / Role
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="Admin, Super Admin, Store Manager..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile Name</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
