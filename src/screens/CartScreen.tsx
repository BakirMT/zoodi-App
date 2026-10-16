import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  Tag,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  TicketPercent,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from '../components/ProductImage';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryCharge,
    cartTotal,
    couponCode,
    appliedCouponDiscount,
    coupons,
    applyCoupon,
    removeCoupon,
    navigate,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
    setInputCoupon('');
  };

  if (cart.length === 0) {
    return (
      <div className="pb-20 p-6 flex flex-col items-center justify-center min-h-[460px] text-center">
        <div className="w-20 h-20 rounded-full bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-500 mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 mb-6">
          Looks like you haven't added anything to your cart yet. Explore our latest fashion collections!
        </p>
        <button
          type="button"
          onClick={() => navigate('category_listing', { category: 'Women' })}
          className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-40 p-4 flex flex-col gap-4">
      {/* Cart Items List */}
      <div className="flex flex-col gap-3">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-800">
              <ProductImage
                src={item.image}
                alt={item.name}
                category={item.category}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.color} • {item.size}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, -1)}
                    className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, 1)}
                    className="w-5 h-5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons & Discounts Card */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center shrink-0">
              <TicketPercent className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Coupons & Discounts</h4>
              <p className="text-[10px] text-slate-400">Save extra with store promo codes</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('coupons')}
            className="text-xs font-bold text-[#DF1951] hover:underline flex items-center gap-0.5"
          >
            <span>View All ({coupons.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {couponCode ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  '{couponCode}' Applied
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  You saved ₹{appliedCouponDiscount.toLocaleString('en-IN')} with this coupon
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 underline px-1 shrink-0"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter promo code (e.g. ZOODI50)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs shrink-0"
              >
                Apply
              </button>
            </form>

            {/* Quick 1-tap coupon suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {coupons.slice(0, 3).map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => applyCoupon(cp.code)}
                  className="px-2.5 py-1 rounded-lg bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/40 text-[10px] font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-100 flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                >
                  <Tag className="w-2.5 h-2.5" />
                  <span>{cp.code}</span>
                  <span className="text-slate-400 font-normal">
                    ({cp.discountType === 'percent' ? `${cp.discountValue}%` : `₹${cp.discountValue}`} off)
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Price Details Card (Matching Screenshot 8) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Price Details
        </h3>

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ₹{cartSubtotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Discount {couponCode ? `(${couponCode})` : ''}
          </span>
          <span
            className={`font-semibold ${
              cartDiscount > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {cartDiscount > 0 ? `-₹${cartDiscount.toLocaleString('en-IN')}` : '₹0'}
          </span>
        </div>

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Delivery Charges</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {cartDeliveryCharge === 0 ? 'FREE' : `₹${cartDeliveryCharge}`}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-sm font-black text-slate-900 dark:text-white">
          <span>Total</span>
          <span>₹{cartTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Sticky Checkout CTA above BottomNav */}
      <div className="fixed bottom-[60px] left-0 right-0 max-w-md mx-auto z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 shadow-lg">
        <button
          type="button"
          onClick={() => navigate('checkout')}
          className="w-full h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
