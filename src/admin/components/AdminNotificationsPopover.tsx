import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  ShoppingBag,
  AlertTriangle,
  Package,
  Star,
  CheckCheck,
  Trash2,
  X,
  ChevronRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../types/admin';

export interface AdminNotification {
  id: string;
  type: 'order' | 'alert' | 'stock' | 'review' | 'return';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  targetTab?: AdminTab;
  targetId?: string;
}

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif_1',
    type: 'order',
    title: 'New Order Received',
    description: 'Ayesha Khan placed order #ZC10324 for ₹1,299',
    time: '5 mins ago',
    unread: true,
    targetTab: 'order_detail',
    targetId: '#ZC10324',
  },
  {
    id: 'notif_2',
    type: 'order',
    title: 'Payment Confirmed',
    description: 'Muhammed Rizwan completed payment for order #ZC10323 (₹2,499)',
    time: '42 mins ago',
    unread: true,
    targetTab: 'order_detail',
    targetId: '#ZC10323',
  },
  {
    id: 'notif_3',
    type: 'stock',
    title: 'Low Stock Alert',
    description: 'Embroidered Anarkali Kurti has only 3 units left in warehouse',
    time: '2 hours ago',
    unread: true,
    targetTab: 'products',
  },
  {
    id: 'notif_4',
    type: 'return',
    title: 'Return Request Filed',
    description: 'Amal K requested size replacement for order #ZC10320',
    time: 'Yesterday',
    unread: false,
    targetTab: 'order_detail',
    targetId: '#ZC10320',
  },
  {
    id: 'notif_5',
    type: 'review',
    title: 'New 5-Star Review',
    description: 'Priya S left a review: "Stunning silk saree, fabric is premium!"',
    time: '2 days ago',
    unread: false,
    targetTab: 'feedback',
  },
];

interface AdminNotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange: (count: number) => void;
}

export const AdminNotificationsPopover: React.FC<AdminNotificationsPopoverProps> = ({
  isOpen,
  onClose,
  onUnreadChange,
}) => {
  const { setAdminTab, setSelectedOrderId } = useAdmin();
  const { orders } = useApp();
  const popoverRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('zoodi_admin_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'alert'>('all');

  // Sync real placed orders from app context if any are missing
  useEffect(() => {
    if (!orders || orders.length === 0) return;
    setNotifications((prev) => {
      let updated = [...prev];
      let hasNew = false;
      orders.forEach((order) => {
        const exists = updated.some((n) => n.targetId === order.id);
        if (!exists) {
          hasNew = true;
          updated = [
            {
              id: `notif_order_${order.id}`,
              type: 'order',
              title: 'Customer Order Placed',
              description: `New order ${order.id} for ₹${order.total.toLocaleString('en-IN')}`,
              time: 'Just now',
              unread: true,
              targetTab: 'order_detail',
              targetId: order.id,
            },
            ...updated,
          ];
        }
      });
      return hasNew ? updated : prev;
    });
  }, [orders]);

  // Save to localStorage & notify parent unread count
  useEffect(() => {
    try {
      localStorage.setItem('zoodi_admin_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
    const unread = notifications.filter((n) => n.unread).length;
    onUnreadChange(unread);
  }, [notifications, onUnreadChange]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return n.unread;
    if (activeFilter === 'order') return n.type === 'order' || n.type === 'return';
    if (activeFilter === 'alert') return n.type === 'alert' || n.type === 'stock';
    return true;
  });

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    markAsRead(notif.id);
    if (notif.targetTab === 'order_detail' && notif.targetId) {
      setSelectedOrderId(notif.targetId);
      setAdminTab('order_detail');
    } else if (notif.targetTab) {
      setAdminTab(notif.targetTab);
    }
    onClose();
  };

  const getTypeIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case 'stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'return':
        return <RotateCcw className="w-4 h-4 text-indigo-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
        onClick={onClose}
      />

      <div
        ref={popoverRef}
        className="fixed inset-x-2.5 top-14 sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:absolute w-auto sm:w-80 md:w-84 max-w-[calc(100vw-20px)] sm:max-w-none rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh] sm:max-h-[480px]"
      >
        {/* Compact Header */}
        <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-500 flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-none truncate">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-extrabold leading-none shrink-0">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate">Live store updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Mark all as read"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Read all</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 shrink-0">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'order', label: 'Orders' },
            { id: 'alert', label: 'Alerts' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white font-extrabold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 overscroll-contain">
          {filtered.length === 0 ? (
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No notifications
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                You are caught up with all activity.
              </p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-2.5 sm:p-3 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group relative ${
                  notif.unread
                    ? 'bg-pink-50/30 dark:bg-pink-950/15'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {/* Type Icon */}
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getTypeIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        notif.unread
                          ? 'text-pink-600 dark:text-pink-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {notif.title}
                    </span>
                    <span className="text-[9px] text-slate-400 shrink-0 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>

                  {/* Action hint */}
                  {notif.targetTab && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-pink-500 mt-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View details</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Right Indicator / Actions */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                  {notif.unread && (
                    <span
                      className="w-2 h-2 rounded-full bg-pink-500 ring-2 ring-pink-200 dark:ring-pink-950"
                      title="Unread"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity rounded-md"
                    title="Dismiss notification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Compact Footer */}
        {notifications.length > 0 && (
          <div className="p-2 px-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
            <span>{notifications.length} alerts</span>
            <button
              type="button"
              onClick={() => setNotifications([])}
              className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
};
