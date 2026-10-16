import React from 'react';
import { ArrowLeft, ShoppingBag, IndianRupee, Wallet, Package } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminCustomerDetail: React.FC = () => {
  const { customers, selectedCustomerId, setAdminTab, setSelectedOrderId } = useAdmin();
  const { orders } = useApp();

  const customer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  if (!customer) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <button
          type="button"
          onClick={() => setAdminTab('customers')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </button>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer not found</h3>
          <p className="text-xs text-slate-400 mt-1">Select a customer from the customer list to inspect activity.</p>
        </div>
      </div>
    );
  }

  const customerOrders = orders.filter(
    (o) =>
      (customer.phone && o.shippingAddress?.phone === customer.phone) ||
      (customer.name && o.shippingAddress?.name?.toLowerCase() === customer.name.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Top back */}
      <button
        type="button"
        onClick={() => setAdminTab('customers')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customers</span>
      </button>

      {/* Customer Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3.5">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-14 h-14 rounded-full object-cover ring-4 ring-pink-50 dark:ring-pink-950/40"
          />
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              {customer.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{customer.email}</p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{customer.phone}</p>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
              {customerOrders.length || customer.totalOrders || 0}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Spent
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">
              ₹{(customerOrders.reduce((sum, o) => sum + (o.total || 0), 0) || customer.totalSpent || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Wallet Balance
            </span>
            <span className="text-lg font-black text-pink-600 dark:text-pink-400 mt-1 block">
              ₹{customer.walletBalance || 0}
            </span>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="pt-2">
          <span className="font-bold text-slate-900 dark:text-white text-xs block mb-2.5">
            Customer Orders ({customerOrders.length})
          </span>
          {customerOrders.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
              No orders placed by this customer yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {customerOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setAdminTab('order_detail');
                  }}
                  className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {ord.id}
                  </span>

                  <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                    ₹{ord.total.toLocaleString('en-IN')}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    ● {ord.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Orders Button */}
        <button
          type="button"
          onClick={() => setAdminTab('orders')}
          className="w-full py-3 rounded-2xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs shadow-md shadow-rose-900/20 active:scale-95 transition-all mt-2"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};
