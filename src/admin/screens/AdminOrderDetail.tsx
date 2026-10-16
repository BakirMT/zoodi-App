import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Truck,
  Package,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';

export const AdminOrderDetail: React.FC = () => {
  const { selectedOrderId, setAdminTab } = useAdmin();
  const { orders, showToast } = useApp();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const [status, setStatus] = useState<string>(order?.status || 'Processing');

  if (!order) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <button
          type="button"
          onClick={() => setAdminTab('orders')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <Package className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Order not found</h3>
          <p className="text-xs text-slate-400 mt-1">There are no placed orders matching this ID yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
      {/* Top back & title */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAdminTab('orders')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </button>

        {/* Status updater */}
        <select
          value={status}
          onChange={(e) => {
            const next = e.target.value;
            setStatus(next);
            order.status = next as any;
            try {
              localStorage.setItem('zoodi_orders', JSON.stringify(orders));
            } catch {}
            showToast(`Order status updated to ${next}.`);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Main Order Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs p-5 sm:p-6 space-y-4">
        {/* Order ID & Status Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-lg font-mono font-black text-slate-900 dark:text-white">
              {order.id}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>{order.date}</span>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              status === 'Delivered'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
            }`}
          >
            ● {status}
          </span>
        </div>

        {/* Customer & Delivery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Customer Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
              Customer Details
            </span>
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {order.shippingAddress?.name || 'Customer'}
              </div>
              <div className="text-[11px] text-slate-400">
                {order.shippingAddress?.phone || 'Phone not provided'}
              </div>
              <div className="text-[11px] text-slate-500">
                {[
                  order.shippingAddress?.addressLine,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.pincode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
              Delivery Details
            </span>
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">
                {order.deliveryOption || 'Standard Delivery'}
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Payment: <span className="font-bold text-pink-600">{order.paymentMethod || 'Online Payment'}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Tracking: {order.trackingId || 'Generated on dispatch'}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="pt-2">
          <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] mb-2">
            Order Items ({order.items.length})
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{it.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {[it.color, it.size].filter(Boolean).join(' • ')}
                    </div>
                  </div>
                </div>

                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {it.quantity} × ₹{it.price.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping Charge</span>
            <span className="font-mono">₹{order.deliveryCharge.toLocaleString('en-IN')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Discount</span>
              <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Total</span>
            <span className="text-pink-600 font-black">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
