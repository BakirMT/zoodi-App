import React, { useState } from 'react';
import { ChevronRight, Package, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';

export const OrdersScreen: React.FC = () => {
  const { orders, setActiveOrder, cancelOrder, navigate } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterTabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Shipped') {
      return o.status === 'Shipped' || o.status === 'Out for Delivery';
    }
    return o.status === selectedFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-full">
            <Truck className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleOrderClick = (order: any) => {
    setActiveOrder(order);
    navigate('track_order', { orderId: order.id });
  };

  return (
    <div className="pb-28 flex flex-col gap-3">
      {/* Horizontal Status Filter Tabs (Matching Screenshot 11) */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isSelected = selectedFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 flex flex-col gap-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No orders in "{selectedFilter}"
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Your order history for this category will appear here.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-3"
            >
              {/* Top Row: Order ID, Date & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {order.id}
                  </h3>
                  <span className="text-[11px] text-slate-400">{order.date}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items Thumbnail Row */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-slate-400 pl-1 shrink-0 font-medium">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              {/* Bottom Actions: Total & Details */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Amount</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'Processing' && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs font-semibold text-rose-500 hover:underline px-2 py-1"
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOrderClick(order)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
