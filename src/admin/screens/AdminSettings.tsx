import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Globe,
  Sun,
  Moon,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Store,
  KeyRound,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  User,
  Edit3,
  Check,
  UserCheck,
  Camera,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminSettings: React.FC = () => {
  const {
    setIsStoreMode,
    logoutAdmin,
    updateAdminPassword,
    resetAllData,
    adminProfile,
    updateAdminProfile,
  } = useAdmin();
  const { isDarkMode, toggleDarkMode, clearCache, cacheSizeMB, showToast } = useApp();

  // Profile Edit Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(adminProfile.name);
  const [profileRole, setProfileRole] = useState(adminProfile.role);
  const [profileAvatar, setProfileAvatar] = useState(adminProfile.avatar);

  const handleOpenProfile = () => {
    setProfileName(adminProfile.name);
    setProfileRole(adminProfile.role);
    setProfileAvatar(adminProfile.avatar);
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Please enter admin name.', 'error');
      return;
    }
    updateAdminProfile({
      name: profileName.trim(),
      role: profileRole.trim() || 'Admin',
      avatar: profileAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    });
    showToast(`Admin profile name changed to "${profileName.trim()}".`);
    setShowProfileModal(false);
  };

  // Password Renewal Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleRenewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    const res = updateAdminPassword(currentPassword, newPassword);
    if (res.success) {
      showToast('Admin password renewed successfully! Please use it for next login.');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Admin Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage admin profile, password security, store preferences & data controls
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={adminProfile.avatar}
              alt={adminProfile.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-pink-500/30"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px]">
              <Edit3 className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{adminProfile.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-extrabold uppercase border border-pink-500/30">
                {adminProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrative account for ZOODI Store
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenProfile}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-[#DF1951] hover:bg-[#C91345] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          <span>Change Name & Photo</span>
        </button>
      </div>

      {/* Main Settings Group */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden text-xs">
        {/* Change Admin Name & Profile */}
        <div
          onClick={handleOpenProfile}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-[#DF1951] flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Admin Name & Profile</span>
                <span className="px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-[#DF1951] text-[10px] font-bold">
                  {adminProfile.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Change display name and profile picture</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-pink-600 dark:text-pink-400 font-bold">
            <span>Edit</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Switch to Storefront */}
        <div
          onClick={() => setIsStoreMode(true)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Customer Storefront</div>
              <div className="text-[11px] text-slate-400">Preview shopping view</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Renew Admin Password */}
        <div
          onClick={() => {
            setShowPasswordModal(true);
            setPasswordError(null);
          }}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Renew Admin Password</span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                  Passcode: Zoodi@shop26
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Change password required to access admin portal</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
            <span>Change</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Notifications */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Admin Notifications</div>
          </div>
          <span className="text-[11px] font-bold text-emerald-500">Enabled</span>
        </div>

        {/* Language */}
        <div
          onClick={() => showToast('Language: English')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Language</div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>English</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Appearance (Light / Dark) */}
        <div
          onClick={() => toggleDarkMode()}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              {isDarkMode ? <Moon className="w-4 h-4 text-pink-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Appearance</div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Privacy & Security */}
        <div
          onClick={() => showToast('Admin Security: Protected by password authentication.')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Privacy & Security</div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Clear Cache */}
        <div
          onClick={clearCache}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div className="font-bold text-slate-900 dark:text-white">Clear Cache</div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{cacheSizeMB}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Purge & Reset Store Data */}
        <div
          onClick={() => {
            if (window.confirm('Are you sure you want to completely purge and reset all store data? This will clear all products, categories, orders, customers, banners, coupons, and analytics so you can upload fresh.')) {
              resetAllData();
            }
          }}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Purge & Reset All Store Data</div>
              <div className="text-[11px] text-rose-400/80">Wipe products, categories, orders, customers & banners</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* Log Out & Lock */}
        <div
          onClick={() => {
            logoutAdmin();
            showToast('Logged out of Admin Portal. Portal locked.');
          }}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Log Out & Lock Portal</div>
              <div className="text-[11px] text-rose-400/80">Require password entry on next access</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

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
                      src={profileAvatar}
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
                                setProfileAvatar(event.target.result as string);
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
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
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
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
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
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
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

      {/* Renew Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Renew Admin Password
                  </h3>
                  <p className="text-[11px] text-slate-400">Update your store administrative passcode</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleRenewPassword} className="py-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
