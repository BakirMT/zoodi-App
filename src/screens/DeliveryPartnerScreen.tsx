import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  Shield,
  Send,
  X,
  PhoneCall,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DeliveryPartnerScreen: React.FC = () => {
  const { activeOrder, orders, showToast } = useApp();
  const order = activeOrder || orders[0];
  const partner = order?.deliveryPartner || {
    name: 'Ramesh Kumar',
    phone: '+91 98450 12345',
    rating: 4.8,
    reviews: '2.3k',
    estimatedTime: 'Today, 12:30 PM - 2:30 PM',
    currentLocation: 'Mannarkkad Junction, 1.8 km away',
  };

  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'partner'; text: string; time: string }[]>([
    { sender: 'partner', text: `Hello! I am ${partner.name}, your ZOODI delivery partner. I'm on my way to deliver your order ${order?.id}.`, time: '11:46 AM' },
    { sender: 'user', text: 'Hi! Could you please call me when you reach the gate?', time: '11:48 AM' },
    { sender: 'partner', text: 'Sure thing, will do! Arriving in approx 15 minutes.', time: '11:49 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Driver auto-reply simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'partner',
          text: 'Got it! See you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="pb-40 p-4 flex flex-col gap-4">
      {/* Partner Profile Card (Matching Screenshot 13) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
            <Shield className="w-3 h-3" />
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3">
          {partner.name}
        </h2>
        <span className="text-xs text-slate-400">Delivery Partner</span>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{partner.rating}</span>
          <span className="text-slate-400 font-normal">({partner.reviews})</span>
        </div>

        {/* Action Buttons: Message & Call (Matching Screenshot 13) */}
        <div className="flex items-center justify-center gap-4 mt-4 w-full">
          <button
            type="button"
            onClick={() => setShowChatModal(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>Message</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCallModal(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>Call</span>
          </button>
        </div>
      </div>

      {/* Live Location Card (Matching Screenshot 13) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-pink-500" />
            <span>Live Location</span>
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>GPS Tracking</span>
          </span>
        </div>

        {/* Map Visual */}
        <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220">
            {/* Background Roads Grid */}
            <rect width="400" height="220" fill="#F1F5F9" className="dark:fill-slate-900" />
            <path d="M0 60 H400 M0 140 H400 M120 0 V220 M280 0 V220" stroke="#E2E8F0" strokeWidth="8" className="dark:stroke-slate-800" />
            <path d="M50 200 C 150 150, 200 90, 320 50" fill="none" stroke="#E8317A" strokeWidth="5" strokeDasharray="8 4" />
            
            {/* Customer Home Pin */}
            <circle cx="320" cy="50" r="10" fill="#E8317A" />
            <circle cx="320" cy="50" r="18" fill="#E8317A" opacity="0.25" className="animate-ping" />
            
            {/* Delivery Courier Van Marker */}
            <circle cx="170" cy="115" r="14" fill="#00B4B6" />
          </svg>

          <div className="absolute bottom-2 left-2 right-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {partner.currentLocation}
              </span>
            </div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
              10-15 mins away
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Time (Matching Screenshot 13) */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Estimated Delivery Time
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {partner.estimatedTime}
            </h4>
          </div>
        </div>
      </div>

      {/* Sticky Contact Partner CTA above BottomNav */}
      <div className="fixed bottom-[60px] left-0 right-0 max-w-md mx-auto z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 shadow-lg">
        <button
          type="button"
          onClick={() => setShowChatModal(true)}
          className="w-full h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>Contact Partner</span>
        </button>
      </div>

      {/* Chat Drawer Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md h-[80vh] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {partner.name}
                  </h4>
                  <span className="text-[10px] text-emerald-500 font-medium">Online</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m, idx) => (
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
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1">
                    <span>{m.time}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-pink-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type a message..."
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

      {/* Call Simulator Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between items-center p-8 animate-in fade-in">
          <div className="text-center pt-12">
            <span className="text-xs uppercase text-slate-400 tracking-wider">Calling Driver</span>
            <h3 className="text-xl font-bold mt-2">{partner.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{partner.phone}</p>
          </div>

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl animate-pulse">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
              alt={partner.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full max-w-xs flex justify-around items-center pb-8">
            <button
              type="button"
              onClick={() => {
                setShowCallModal(false);
                showToast('Call ended.', 'info');
              }}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <PhoneCall className="w-6 h-6 rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
