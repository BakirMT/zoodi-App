import React from 'react';
import { Home, LayoutGrid, Heart, User, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

interface BottomNavProps {
  onOpenMoreMenu?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMoreMenu }) => {
  const { currentScreen, navigate, wishlistIds } = useApp();

  const navItems: { label: string; screen: ScreenId; icon: React.FC<any>; badge?: number }[] = [
    { label: 'Home', screen: 'home', icon: Home },
    { label: 'Categories', screen: 'categories', icon: LayoutGrid },
    { label: 'Wishlist', screen: 'wishlist', icon: Heart, badge: wishlistIds.length },
    { label: 'Account', screen: 'account', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 h-[60px] bg-[#daf1f0]/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-[#bce4e2] dark:border-slate-800 px-2 py-1 flex items-center justify-around shadow-sm">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.screen;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.screen)}
            className={`relative flex flex-col items-center justify-center min-w-[54px] py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 ${
              isActive
                ? 'text-pink-600 dark:text-pink-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 truncate">
              {item.label}
            </span>
          </button>
        );
      })}

      {/* More Button */}
      <button
        type="button"
        onClick={() => {
          if (onOpenMoreMenu) {
            onOpenMoreMenu();
          } else {
            navigate('settings');
          }
        }}
        className={`relative flex flex-col items-center justify-center min-w-[54px] py-1 px-2 rounded-xl transition-all duration-150 active:scale-95 ${
          currentScreen === 'settings' || currentScreen === 'help' || currentScreen === 'compare'
            ? 'text-pink-600 dark:text-pink-400 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[10px] tracking-tight mt-1 truncate">More</span>
      </button>
    </nav>
  );
};
