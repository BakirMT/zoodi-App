import React, { useState } from 'react';
import { Calendar, TrendingUp, Sparkles, Shirt, ShoppingBag, Users, IndianRupee, Package, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Sales' | 'Orders' | 'Customers'>('Sales');
  const { customers, categories, setAdminTab } = useAdmin();
  const { orders, products } = useApp();

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Aggregate sales by date from actual orders
  const salesByDate: Record<string, number> = {};
  orders.forEach((o) => {
    const rawDate = o.date ? o.date.split(',')[0].trim() : 'Today';
    salesByDate[rawDate] = (salesByDate[rawDate] || 0) + (o.total || 0);
  });

  const dateEntries = Object.entries(salesByDate);
  const maxDaySales = Math.max(...dateEntries.map(([, val]) => val), 1);

  // Compute top ordered product
  const productSalesMap: Record<string, { count: number; revenue: number; name: string; image: string }> = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          count: 0,
          revenue: 0,
          name: item.name,
          image: item.image,
        };
      }
      productSalesMap[item.productId].count += item.quantity || 1;
      productSalesMap[item.productId].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const sortedProducts = Object.values(productSalesMap).sort((a, b) => b.count - a.count);
  const topProduct = sortedProducts[0];

  // Compute top category
  const categorySalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const cat = item.category || 'General';
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price || 0) * (item.quantity || 1);
    });
  });

  const sortedCategories = Object.entries(categorySalesMap).sort(([, a], [, b]) => b - a);
  const topCategoryName = sortedCategories[0]?.[0];
  const topCategorySales = sortedCategories[0]?.[1] || 0;
  const topCategoryPercent = totalSales > 0 ? Math.round((topCategorySales / totalSales) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time sales tracking, customer growth, and catalog performance
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-pink-500" />
            <span>Live Data Sync</span>
          </div>
        </div>
      </div>

      {/* Tabs (Sales | Orders | Customers) */}
      <div className="flex items-center gap-2">
        {(['Sales', 'Orders', 'Customers'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#E11D48] text-white shadow-md shadow-rose-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Primary Metric Overview Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-400">
              {activeTab === 'Sales' ? 'Total Store Revenue' : activeTab === 'Orders' ? 'Total Orders Placed' : 'Total Registered Customers'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {activeTab === 'Sales'
                ? `₹ ${totalSales.toLocaleString('en-IN')}`
                : activeTab === 'Orders'
                ? totalOrders.toLocaleString('en-IN')
                : totalCustomers.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-1">
              <span>
                {activeTab === 'Sales'
                  ? `Avg. Order Value: ₹${averageOrderValue.toLocaleString('en-IN')}`
                  : activeTab === 'Orders'
                  ? `${orders.filter((o) => o.status === 'Delivered').length} orders delivered`
                  : `${products.length} catalog products available`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {orders.length === 0 ? 'Awaiting First Order' : `${orders.length} Records Tracked`}
            </span>
          </div>
        </div>

        {/* Graphical Representation */}
        {orders.length === 0 ? (
          <div className="py-12 border-t border-slate-100 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No sales or transaction history yet
            </h4>
            <p className="text-[11px] text-slate-400 max-w-sm">
              As soon as customers place orders, daily revenue bars and live conversion charts will automatically populate here.
            </p>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="h-44 flex items-end justify-between gap-2 px-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              {dateEntries.slice(0, 10).map(([d, val], i) => {
                const heightPct = Math.max(15, Math.min(100, Math.round((val / maxDaySales) * 100)));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[9px] font-bold text-pink-600 dark:text-pink-400 mb-1">
                      ₹{val.toLocaleString('en-IN')}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-pink-600 to-rose-400 hover:from-pink-500 hover:to-rose-300 transition-all cursor-pointer shadow-xs"
                    />
                    <span className="text-[9px] text-slate-400 truncate w-full text-center mt-1">
                      {d}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top Product & Top Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Top Product */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Top Selling Product
            </span>
            {topProduct ? (
              <>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {topProduct.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{topProduct.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="ml-1 text-[11px] text-pink-500 font-semibold">
                    ({topProduct.count} sold)
                  </span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No sales recorded yet
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Top performing items will display here after purchases.
                </p>
              </>
            )}
          </div>

          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center text-slate-400">
            {topProduct?.image ? (
              <img
                src={topProduct.image}
                alt={topProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Top Category */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Top Category
            </span>
            {topCategoryName ? (
              <>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {topCategoryName}
                </h3>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  {topCategoryPercent}% of total revenue (₹{topCategorySales.toLocaleString('en-IN')})
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No category data yet
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Category breakdown will appear as orders are fulfilled.
                </p>
              </>
            )}
          </div>

          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
            <Shirt className="w-6 h-6 stroke-[1.8]" />
          </div>
        </div>
      </div>
    </div>
  );
};
