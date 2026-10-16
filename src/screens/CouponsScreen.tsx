import React, { useState } from 'react';
import {
  Tag,
  Check,
  Copy,
  Sparkles,
  ShoppingBag,
  Percent,
  Clock,
  ChevronRight,
  Gift,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Coupon } from '../types';

export const CouponsScreen: React.FC = () => {
  const {
    coupons,
    couponCode,
    applyCoupon,
    removeCoupon,
    appliedCouponDiscount,
    cart,
    cartTotal,
    navigate,
    showToast,
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'fashion' | 'shipping' | 'exclusive'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApplyManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    if (res.success) {
      setInputCode('');
    }
  };

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code "${code}" to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyCard = (coupon: Coupon) => {
    if (couponCode.toUpperCase() === coupon.code.toUpperCase()) {
      removeCoupon();
    } else {
      applyCoupon(coupon.code);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fashion') return c.applicableCategory === 'Women' || c.code.includes('ZOODI');
    if (activeTab === 'shipping') return c.code === 'FREESHIP';
    if (activeTab === 'exclusive') return c.code === 'WELCOME100' || c.code === 'STYLE20';
    return true;
  });

  return (
    <div className="pb-32 p-4 flex flex-col gap-4">
      {/* Top Banner: Active Coupon Status */}
      {couponCode ? (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider font-extrabold bg-white/25 px-2 py-0.5 rounded-full">
                  Applied
                </span>
                <span className="font-extrabold text-sm">{couponCode}</span>
              </div>
              <p className="text-xs text-teal-50 mt-0.5">
                You're saving ₹{appliedCouponDiscount.toLocaleString('en-IN')} on this order!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors shrink-0"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Coupons & Special Discounts</h3>
              <p className="text-xs text-pink-100 mt-0.5">
                Select any voucher below to save up to ₹1,500 instantly
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse shrink-0" />
        </div>
      )}

      {/* Manual Coupon Input Form */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleApplyManual} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter voucher code (e.g. ZOODI50)"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#DF1951] hover:bg-[#C91345] text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Offers' },
          { id: 'fashion', label: 'Fashion & Wear' },
          { id: 'shipping', label: 'Free Delivery' },
          { id: 'exclusive', label: 'Member Specials' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List of Coupons */}
      <div className="flex flex-col gap-3">
        {filteredCoupons.map((coupon) => {
          const isApplied = couponCode.toUpperCase() === coupon.code.toUpperCase();

          return (
            <div
              key={coupon.id}
              className={`relative rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-xs overflow-hidden ${
                isApplied
                  ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-pink-500/40'
              }`}
            >
              {/* Left & Right Coupon ticket decorative notch cutouts */}
              <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800" />
              <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800" />

              <div className="p-4 pl-6 pr-6 flex flex-col gap-2.5">
                {/* Header: Tag + Expiry */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-pink-100 dark:bg-pink-950/60 text-[#DF1951] dark:text-pink-400 uppercase">
                    {coupon.tag || 'SPECIAL OFFER'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{coupon.expiryDate}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {coupon.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Terms / Minimum requirement line */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 border-t border-dashed border-slate-100 dark:border-slate-800/80 pt-2">
                  <span>Min order: ₹{coupon.minOrderValue.toLocaleString('en-IN')}</span>
                  {coupon.maxDiscount && (
                    <span>• Max savings: ₹{coupon.maxDiscount.toLocaleString('en-IN')}</span>
                  )}
                </div>

                {/* Bottom Action Bar: Code Box + Copy + Apply Button */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  {/* Dashed Code Box */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700">
                    <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white font-mono">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      aria-label="Copy code"
                      onClick={(e) => handleCopy(coupon.code, e)}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Apply / Applied Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleApplyCard(coupon)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs ${
                      isApplied
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-[#DF1951] text-white hover:bg-[#C91345]'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <span>Apply Coupon</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Navigation Footer CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-30 flex items-center justify-center">
        <div className="w-full max-w-md flex items-center justify-between gap-3 px-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Cart Total</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              ₹{cartTotal.toLocaleString('en-IN')}
              {couponCode && appliedCouponDiscount > 0 && (
                <span className="text-[10px] text-emerald-500 font-semibold ml-1.5">
                  (-₹{appliedCouponDiscount.toLocaleString('en-IN')} off)
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('cart')}
            className="flex-1 max-w-[200px] py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Cart ({cart.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
