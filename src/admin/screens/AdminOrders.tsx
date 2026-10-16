import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Calendar,
  Eye,
  Filter,
  ArrowUpRight,
  ChevronDown,
  Check,
  RotateCcw,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminOrders: React.FC = () => {
  const { setSelectedOrderId, setAdminTab } = useAdmin();
  const { orders } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRangePreset, setDateRangePreset] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const allAdminOrders = orders.map((o) => ({
    id: o.id,
    customer: o.shippingAddress?.name || 'Customer',
    email: o.shippingAddress?.phone || 'customer@zoodi.com',
    total: o.total,
    status: o.status,
    date: o.date,
  }));

  const filterTabs = [
    { label: 'All', count: allAdminOrders.length },
    { label: 'Pending', count: allAdminOrders.filter((o) => (o.status as string) === 'Pending').length },
    { label: 'Processing', count: allAdminOrders.filter((o) => o.status === 'Processing').length },
    { label: 'Shipped', count: allAdminOrders.filter((o) => o.status === 'Shipped').length },
    { label: 'Delivered', count: allAdminOrders.filter((o) => o.status === 'Delivered').length },
  ];

  const parseOrderDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const lower = dateStr.toLowerCase();
    if (lower.includes('just now') || lower.includes('today')) {
      return new Date(2026, 9, 4); // 04 Oct 2026
    }
    const match = dateStr.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthStr = match[2].toLowerCase();
      const year = parseInt(match[3], 10);
      const months: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };
      const month = months[monthStr] !== undefined ? months[monthStr] : 9;
      return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const isOrderInDateRange = (orderDateStr: string) => {
    if (dateRangePreset === 'all') return true;
    const orderDate = parseOrderDate(orderDateStr);
    if (!orderDate) return true;

    // Normalizing order date time
    const orderTime = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();

    if (dateRangePreset === 'today') {
      const todayTime = new Date(2026, 9, 4).getTime();
      return orderTime === todayTime || orderDateStr.toLowerCase().includes('today') || orderDateStr.toLowerCase().includes('just now');
    }
    if (dateRangePreset === 'yesterday') {
      const yesterdayTime = new Date(2026, 9, 3).getTime();
      return orderTime === yesterdayTime;
    }
    if (dateRangePreset === 'last7') {
      const sevenDaysAgo = new Date(2026, 9, 4 - 7).getTime();
      const todayTime = new Date(2026, 9, 4).getTime();
      return orderTime >= sevenDaysAgo && orderTime <= todayTime;
    }
    if (dateRangePreset === 'last30') {
      const thirtyDaysAgo = new Date(2026, 9, 4 - 30).getTime();
      const todayTime = new Date(2026, 9, 4).getTime();
      return orderTime >= thirtyDaysAgo && orderTime <= todayTime;
    }
    if (dateRangePreset === 'thisMonth') {
      return orderDate.getFullYear() === 2026 && orderDate.getMonth() === 9;
    }
    if (dateRangePreset === 'custom') {
      if (customStartDate) {
        const start = new Date(customStartDate).getTime();
        if (orderTime < start) return false;
      }
      if (customEndDate) {
        const end = new Date(customEndDate).getTime();
        if (orderTime > end) return false;
      }
      return true;
    }
    return true;
  };

  const getDateRangeLabel = () => {
    switch (dateRangePreset) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'last7':
        return 'Last 7 Days';
      case 'last30':
        return 'Last 30 Days';
      case 'thisMonth':
        return 'Oct 2026';
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${customStartDate} to ${customEndDate}`;
        }
        if (customStartDate) return `From ${customStartDate}`;
        if (customEndDate) return `Until ${customEndDate}`;
        return 'Custom Range';
      default:
        return 'Date Range';
    }
  };

  const filtered = allAdminOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All' || o.status === selectedStatus;
    const matchesDate = isOrderInDateRange(o.date);
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Orders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          View and manage customer orders and fulfillment
        </p>
      </div>

      {/* Filter Tabs matching Screen 6 in mockup: All (129), Pending (24), Processing (18) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filterTabs.map((t) => {
          const isSelected = selectedStatus === t.label;
          return (
            <button
              key={t.label}
              type="button"
              onClick={() => setSelectedStatus(t.label)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#E11D48] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-pink-500'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order id, customer name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-xs"
          />
        </div>

        {/* Interactive Date Range Button & Dropdown */}
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              dateRangePreset !== 'all'
                ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-600 dark:text-pink-300 ring-2 ring-pink-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>{getDateRangeLabel()}</span>
            {dateRangePreset !== 'all' ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setDateRangePreset('all');
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="w-4 h-4 rounded-full bg-pink-200 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 flex items-center justify-center hover:bg-pink-300 text-[10px]"
                title="Clear date filter"
              >
                ✕
              </span>
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Date Range Dropdown Popover */}
          {isDatePickerOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Filter Orders by Date
                  </span>
                </div>
                {dateRangePreset !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateRangePreset('all');
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    className="text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">
                  Quick Presets
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: 'today', label: 'Today' },
                    { id: 'yesterday', label: 'Yesterday' },
                    { id: 'last7', label: 'Last 7 Days' },
                    { id: 'last30', label: 'Last 30 Days' },
                    { id: 'thisMonth', label: 'This Month (Oct)' },
                  ].map((p) => {
                    const isSelected = dateRangePreset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setDateRangePreset(p.id);
                          if (p.id !== 'custom') {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-pink-500 text-white font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date Range */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Custom Range
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value);
                        setDateRangePreset('custom');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => {
                        setCustomEndDate(e.target.value);
                        setDateRangePreset('custom');
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDateRangePreset('custom');
                      setIsDatePickerOpen(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table (Matching Screen 6 in mockup) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Mobile View (< sm) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
          {filtered.map((order) => (
            <div
              key={order.id}
              onClick={() => {
                setSelectedOrderId(order.id);
                setAdminTab('order_detail');
              }}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                  {order.id}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : order.status === 'Processing'
                      ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                      : order.status === 'Shipped'
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  ● {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {order.customer}
                  </div>
                  <div className="text-[10px] text-slate-400">{order.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className="p-1 rounded-lg text-slate-400">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (>= sm) */}
        <div className="hidden sm:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs min-w-[550px]">
            <thead>
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setAdminTab('order_detail');
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {order.customer}
                    </div>
                    <div className="text-[10px] text-slate-400">{order.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : order.status === 'Processing'
                          ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      ● {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 inline-block">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State when no orders match filters */}
        {filtered.length === 0 && (
          <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              No orders found for this date range
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No orders were placed matching {getDateRangeLabel()} and the status "{selectedStatus}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedStatus('All');
                setDateRangePreset('all');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
