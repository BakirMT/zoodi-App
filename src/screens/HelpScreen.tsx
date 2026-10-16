import React, { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  RotateCcw,
  Truck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpScreen: React.FC = () => {
  const { navigate, showToast, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Problem form
  const [problemType, setProblemType] = useState('Damaged Item');
  const [problemOrder, setProblemOrder] = useState(orders[0]?.id || '#ZC256784521');
  const [problemDesc, setProblemDesc] = useState('');

  // Support chat
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: 'Hello! Welcome to ZOODI Support. How can we help you today?', time: 'Just now' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'Go to "My Orders" in your Account section and tap "Track Order". You will see real-time updates from packing to out-for-delivery with live partner location.',
    },
    {
      q: 'What is ZOODI’s return & refund policy?',
      a: 'We offer a hassle-free 7-day return policy on all eligible fashion and footwear items. You can initiate a return directly from the order details page.',
    },
    {
      q: 'How do I apply coupon codes?',
      a: 'In your Cart, enter the coupon code (such as ZOODI50 or WELCOME100) in the promo code field and click "Apply" to receive instant discounts.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit cards, Net Banking, ZOODI Wallet, and Cash on Delivery.',
    },
    {
      q: 'How do I change my shipping address?',
      a: 'You can manage, edit, or set default delivery addresses anytime under Account > Addresses.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDesc.trim()) {
      showToast('Please describe the problem', 'error');
      return;
    }
    showToast('Your issue ticket has been submitted. Our team will contact you within 24 hours!');
    setShowProblemModal(false);
    setProblemDesc('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Thank you for reaching out! A ZOODI representative is reviewing your account and will assist you right away.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="pb-28 p-4 flex flex-col gap-4">
      {/* Search Help */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help articles & FAQs..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-pink-500"
        />
      </div>

      {/* Quick Category Action Cards (Matching Screenshot 19) */}
      <div className="flex flex-col gap-2">
        <div
          onClick={() => {
            const el = document.getElementById('faq-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">FAQs</h4>
              <p className="text-[11px] text-slate-400">Find answers to common questions</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setShowChatModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Contact Us
              </h4>
              <p className="text-[11px] text-slate-400">We're here to help you</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            showToast('Return & Refund: You have 7 days easy return window for delivered items.');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Return & Refund
              </h4>
              <p className="text-[11px] text-slate-400">Easy returns within 7 days</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('track_order')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Track Order
              </h4>
              <p className="text-[11px] text-slate-400">Track your order in real-time</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setShowProblemModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Report a Problem
              </h4>
              <p className="text-[11px] text-slate-400">Let us know your concern</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div id="faq-section" className="pt-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Frequently Asked Questions
        </h3>

        <div className="flex flex-col gap-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-800/60 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Report a Problem Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Report a Problem</h3>
              <button
                type="button"
                onClick={() => setShowProblemModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProblemSubmit} className="py-4 flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Issue Category</label>
                <select
                  value={problemType}
                  onChange={(e) => setProblemType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Damaged Item">Damaged Item</option>
                  <option value="Wrong Size/Color">Wrong Size or Color</option>
                  <option value="Delivery Delay">Delivery Delayed</option>
                  <option value="Payment/Refund">Payment / Refund Issue</option>
                  <option value="App Feedback">App Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Related Order</label>
                <select
                  value={problemOrder}
                  onChange={(e) => setProblemOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} ({o.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Describe the Issue</label>
                <textarea
                  required
                  rows={3}
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  placeholder="Please give us more details..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md mt-2"
              >
                Submit Issue Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Support Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-[80vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ZOODI Live Support</h4>
                <span className="text-[10px] text-emerald-500">24/7 Priority Assistance</span>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-pink-500 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask support a question..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
