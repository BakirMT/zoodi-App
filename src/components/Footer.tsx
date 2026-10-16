import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Send,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, setSelectedCategory, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('🎉 Thank you for subscribing! Check your inbox for 15% off coupon code.');
    setEmailInput('');
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    navigate('category_listing', { category: cat });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoriesList = [
    'Women',
    'Men',
    'Footwear',
    'Bags',
    'Home',
    'Electronics',
    'Beauty',
  ];

  return (
    <footer className="mt-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400">
      {/* Value Proposition Badges */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">Free Delivery</h5>
              <p className="text-[10px] text-slate-400">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">7 Days Return</h5>
              <p className="text-[10px] text-slate-400">Hassle-free easy refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">100% Genuine</h5>
              <p className="text-[10px] text-slate-400">Direct from top brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white">24/7 Support</h5>
              <p className="text-[10px] text-slate-400">Always here to assist you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="px-4 py-8 max-w-5xl mx-auto flex flex-col gap-8">
        {/* Brand & Newsletter Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col gap-1.5 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-pink-600 dark:text-pink-500">
                ZOODI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
                Lifestyle & Fashion
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your premier destination for trendsetting styles, authentic ethnic wear, footwear, and modern everyday essentials.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="flex flex-col gap-2 w-full sm:max-w-xs">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Get 15% OFF Your Next Order
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Subscribe for flash sales, newly arrived collections & secret deals.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center mt-1">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-3 pr-20 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Join</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
            {isSubscribed && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Subscribed successfully! Welcome to Zoodi Club.
              </span>
            )}
          </div>
        </div>

        {/* 3 Column Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          {/* Shop Categories */}
          <div className="flex flex-col gap-2.5">
            <h6 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Shop Categories
            </h6>
            <ul className="flex flex-col gap-2 text-slate-500 dark:text-slate-400">
              {categoriesList.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-1 text-left cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                    <span>{cat} Collection</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <h6 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Customer Service
            </h6>
            <ul className="flex flex-col gap-2 text-slate-500 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('track_order');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Return & Exchange
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('help');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Help & FAQs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('help');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('help');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* My Account */}
          <div className="flex flex-col gap-2.5">
            <h6 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              My Account
            </h6>
            <ul className="flex flex-col gap-2 text-slate-500 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  My Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Order History
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('wishlist');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  My Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('coupons');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Saved Coupons & Offers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate('addresses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer"
                >
                  Delivery Addresses
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Social */}
          <div className="flex flex-col gap-2.5">
            <h6 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Get In Touch
            </h6>
            <div className="flex flex-col gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>support@zoodi.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                <span>Mannarkkad, Palakkad, Kerala 678583</span>
              </div>
            </div>

            {/* Social Media icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="#instagram"
                aria-label="Instagram"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Follow Zoodi on Instagram @zoodiofficial');
                }}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/40 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#facebook"
                aria-label="Facebook"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Follow Zoodi on Facebook');
                }}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter / X"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Follow Zoodi on X (Twitter)');
                }}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Subscribe to Zoodi on YouTube');
                }}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods Badges & Security */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-[11px] font-semibold text-slate-500">100% Secure Payments:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Visa', 'Mastercard', 'RuPay', 'Net Banking', 'Cash on Delivery'].map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Copyright and Legal Notice */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© 2026 ZOODI Lifestyle & Fashion Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => showToast('Terms of Service: Standard e-commerce terms apply.')}
              className="hover:underline cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => showToast('Privacy Policy: Your data is protected and never shared.')}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => showToast('Zoodi Security: Encrypted and verified merchant.')}
              className="hover:underline cursor-pointer"
            >
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
