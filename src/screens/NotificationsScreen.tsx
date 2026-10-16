import React from 'react';
import {
  Truck,
  Tag,
  Sparkles,
  CheckCircle2,
  Gift,
  Bell,
  CheckCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    navigate,
    setActiveOrder,
    orders,
    setSelectedCategory,
  } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Truck className="w-4 h-4 text-sky-500" />;
      case 'discount':
        return <Tag className="w-4 h-4 text-pink-500" />;
      case 'new_arrival':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'system':
      default:
        return <Gift className="w-4 h-4 text-teal-500" />;
    }
  };

  const handleNotificationClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.targetScreen === 'track_order') {
      const match = orders.find((o) => o.id === item.targetId) || orders[0];
      setActiveOrder(match);
      navigate('track_order', { orderId: match.id });
    } else if (item.targetScreen === 'category_listing') {
      setSelectedCategory('Women');
      navigate('category_listing', { category: 'Women' });
    } else if (item.targetScreen === 'orders') {
      navigate('orders');
    } else if (item.targetScreen === 'categories') {
      navigate('categories');
    } else {
      navigate('home');
    }
  };

  return (
    <div className="pb-28 flex flex-col gap-3">
      {/* Top action bar: Mark all as read */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {notifications.filter((n) => !n.read).length} unread updates
        </span>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List (Matching Screenshot 14) */}
      <div className="px-4 flex flex-col gap-2.5">
        {notifications.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No notifications yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You will be notified about orders, sales, and shipping status here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                item.read
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 opacity-80'
                  : 'bg-pink-50/30 dark:bg-pink-950/20 border-pink-200/60 dark:border-pink-900/40 shadow-xs'
              }`}
            >
              {/* Left Category Icon */}
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(item.type)}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{item.time}</span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Unread indicator or delete */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse mt-1" />
                )}
                <button
                  type="button"
                  aria-label="Delete notification"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item.id);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-500 dark:text-slate-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
