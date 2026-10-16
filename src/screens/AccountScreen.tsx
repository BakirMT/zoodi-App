import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Heart,
  Tag,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  ChevronRight,
  Wallet,
  Plus,
  X,
  Edit3,
  ShieldCheck,
  TicketPercent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';

export const AccountScreen: React.FC = () => {
  const { user, orders, wishlistIds, navigate, logout, topUpWallet, updateProfile, coupons } =
    useApp();
  const { setIsStoreMode } = useAdmin();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(topUpAmount);
    if (amt > 0) {
      topUpWallet(amt);
      setShowWalletModal(false);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setShowEditProfile(false);
  };

  const menuItems = [
    { label: 'My Orders', screen: 'orders', icon: Package, count: orders.length },
    {
      label: 'Coupons & Discounts',
      screen: 'coupons',
      icon: TicketPercent,
      count: coupons.length,
      badge: 'Offers',
    },
    { label: 'Addresses', screen: 'addresses', icon: MapPin },
    { label: 'Wishlist', screen: 'wishlist', icon: Heart, count: wishlistIds.length },
    { label: 'Compare Products', screen: 'compare', icon: Tag },
    { label: 'Settings', screen: 'settings', icon: SettingsIcon },
    { label: 'Help & Support', screen: 'help', icon: HelpCircle },
  ];

  return (
    <div className="pb-28 flex flex-col gap-4">
      {/* User Profile Card (Matching Screenshot 15) */}
      <div className="px-4 pt-2">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-pink-500 shadow-sm">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <button
                  type="button"
                  aria-label="Edit Profile"
                  onClick={() => setShowEditProfile(true)}
                  className="p-1 text-slate-400 hover:text-pink-500"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
              <p className="text-[11px] text-slate-400">{user.phone}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Settings"
            onClick={() => navigate('settings')}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:text-pink-500 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Counter Strip (Orders, Wishlist, Wallet - Matching Screenshot 15) */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xs text-center">
          <div
            onClick={() => navigate('orders')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-black text-slate-900 dark:text-white block">
              {orders.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Orders</span>
          </div>

          <div
            onClick={() => navigate('wishlist')}
            className="border-x border-slate-100 dark:border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-black text-slate-900 dark:text-white block">
              {wishlistIds.length}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Wishlist</span>
          </div>

          <div
            onClick={() => setShowWalletModal(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-black text-teal-600 dark:text-teal-400 block">
              ₹{user.walletBalance}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Wallet</span>
          </div>
        </div>
      </div>

      {/* Menu Options List (Matching Screenshot 15) */}
      <div className="px-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              onClick={() => navigate(item.screen as any)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-pink-500/40 cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}

        {/* Logout Row */}
        <div
          onClick={logout}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 cursor-pointer hover:bg-rose-50 transition-colors mt-2"
        >
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      {/* Discreet Merchant Staff Portal Access Link */}
      <div className="pt-2 pb-4 text-center">
        <button
          type="button"
          onClick={() => setIsStoreMode(false)}
          className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
        >
          Staff & Super Admin Portal Access →
        </button>
      </div>

      {/* Wallet Top-up Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-teal-500" />
                <span>ZOODI Wallet</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWalletSubmit} className="py-4 flex flex-col gap-3">
              <span className="text-xs text-slate-500">
                Current Balance: <strong>₹{user.walletBalance}</strong>
              </span>

              <div className="flex gap-2">
                {['200', '500', '1000', '2000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold ${
                      topUpAmount === amt
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-600'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount (₹)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 mt-2"
              >
                Add Money to Wallet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="py-4 flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
