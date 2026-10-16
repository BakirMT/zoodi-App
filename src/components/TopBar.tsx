import React from 'react';
import { ArrowLeft, Bell, Heart, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { ZoodiLogo } from './ZoodiLogo';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
  onBack,
}) => {
  const { goBack, navigate, unreadNotifCount, wishlistIds, cart } = useApp();
  const { setIsStoreMode } = useAdmin();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  const totalCartItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#daf1f0]/95 dark:bg-[#4a5a73] backdrop-blur-md border-b border-[#bce4e2] dark:border-[#5a6c89] px-4 py-2.5 flex items-center justify-between transition-colors shadow-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#5a6c89] transition-colors active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : null}

        {title ? (
          <div className="flex flex-col min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[11px] text-slate-500 dark:text-slate-200 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        ) : (
          <div
            className="cursor-pointer flex items-center"
            onClick={() => navigate('home')}
          >
            <ZoodiLogo size="sm" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {rightAction ? (
          rightAction
        ) : (
          <>
            {/* Wishlist Icon */}
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => navigate('wishlist')}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#5a6c89] transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => navigate('notifications')}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#5a6c89] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              aria-label="Cart"
              onClick={() => navigate('cart')}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#5a6c89] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
