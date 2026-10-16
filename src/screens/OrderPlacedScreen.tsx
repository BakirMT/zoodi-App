import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PackageCheck, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderPlacedScreen: React.FC = () => {
  const { navigate, screenParams, orders } = useApp();

  const orderId = screenParams?.orderId || orders[0]?.id || '#ZC256784521';
  const order = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00B4B6', '#FFB703', '#FF7A30', '#E8317A', '#3B82F6'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-[580px] p-6 flex flex-col justify-between items-center text-center bg-white dark:bg-slate-950 transition-colors">
      <div className="w-full my-auto flex flex-col items-center">
        {/* Festive Package Illustration */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-pink-500 p-0.5 shadow-xl shadow-pink-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
              <PackageCheck className="w-14 h-14 sm:w-16 sm:h-16 text-pink-500 animate-pulse" />
            </div>
          </div>

          {/* Floating Confetti Sparks */}
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-3 -right-3 animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-teal-400 absolute -bottom-2 -left-2 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-pink-500 absolute top-1 -left-3" />
        </div>

        {/* Heading & Message (Matching Screenshot 10) */}
        <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
          Order Placed!
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-2 leading-relaxed">
          Your order <strong className="text-slate-900 dark:text-white font-bold">{orderId}</strong> has been successfully placed.
        </p>

        {/* Order Details Brief */}
        {order && (
          <div className="w-full max-w-xs p-3.5 mt-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left text-xs">
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span>Amount Paid</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 mt-1.5">
              <span>Payment Mode</span>
              <span className="font-medium text-slate-900 dark:text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 mt-1.5">
              <span>Est. Delivery</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {order.deliveryOption === 'Express' ? '1-2 Days' : '3-5 Days'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions (Matching Screenshot 10) */}
      <div className="w-full flex flex-col gap-2.5 max-w-sm">
        <button
          type="button"
          onClick={() => navigate('orders')}
          className="w-full py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <span>View Orders</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => navigate('home')}
          className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
        >
          Continue Shopping
        </button>

        <p className="text-[11px] text-slate-400 font-medium mt-1">
          Thank you for choosing ZOODI!
        </p>
      </div>
    </div>
  );
};
