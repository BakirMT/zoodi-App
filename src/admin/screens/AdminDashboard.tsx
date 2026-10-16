import React from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  Eye,
  Calendar,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { setAdminTab, setSelectedOrderId, customers } = useAdmin();
  const { orders, products } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, Store Admin! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>Today's Overview</span>
          </div>
        </div>
      </div>

      {/* 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalOrders}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
              <span>{totalOrders > 0 ? 'Live orders' : 'Waiting for first order'}</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
              <span>{totalRevenue > 0 ? 'Gross store sales' : '₹0.00 earned so far'}</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalProducts}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
              <span>{totalProducts > 0 ? 'Active in catalog' : 'No products uploaded'}</span>
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalCustomers}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mt-1">
              <span>{totalCustomers > 0 ? 'Registered buyers' : '0 registered shoppers'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Overview Chart Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Sales Overview
            </h2>
            <p className="text-xs text-slate-400">Monthly revenue trends and real-time order volume</p>
          </div>

          {/* Chart Legends */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span>Current Sales</span>
            </div>
          </div>
        </div>

        {/* Sales Overview Display */}
        {orders.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No sales activity recorded yet
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
              As soon as customers checkout and place orders, live sales performance and revenue charts will render here.
            </p>
          </div>
        ) : (
          <div className="relative pt-6 pb-2 w-full overflow-hidden">
            <div className="h-44 w-full flex items-end justify-between gap-2 px-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {orders.slice(0, 7).map((o, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-pink-600">₹{o.total}</span>
                  <div
                    style={{ height: `${Math.min(100, Math.max(25, (o.total / 5000) * 100))}%` }}
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-pink-600 to-rose-400 shadow-xs"
                  />
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">
                    {o.date.split(',')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders Preview */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Recent Orders ({orders.length})
          </h2>
          <button
            type="button"
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No customer orders yet
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Orders placed from the storefront will arrive here instantly.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View (< sm) */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setAdminTab('order_detail');
                  }}
                  className="py-3 flex items-center justify-between gap-3 active:bg-slate-50 dark:active:bg-slate-800/60 rounded-xl px-1.5 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                        {o.id}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : o.status === 'Shipped'
                            ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate font-medium">
                        {o.shippingAddress?.name || 'Customer'}
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white shrink-0 ml-2">
                        ₹{o.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet / Desktop View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold whitespace-nowrap">
                    <th className="pb-2.5 pr-4">Order ID</th>
                    <th className="pb-2.5 px-4">Customer</th>
                    <th className="pb-2.5 px-4">Total</th>
                    <th className="pb-2.5 px-4">Status</th>
                    <th className="pb-2.5 pl-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                        {o.id}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {o.shippingAddress?.name || 'Customer'}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">
                        ₹{o.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                              : o.status === 'Shipped'
                              ? 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400'
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderId(o.id);
                            setAdminTab('order_detail');
                          }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-pink-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
