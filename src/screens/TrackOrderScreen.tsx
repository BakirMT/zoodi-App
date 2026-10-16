import React from 'react';
import {
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronRight,
  Package,
  Phone,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TrackOrderScreen: React.FC = () => {
  const { activeOrder, orders, navigate } = useApp();

  const order = activeOrder || orders[0];

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">No order selected for tracking.</p>
        <button
          onClick={() => navigate('orders')}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl text-xs"
        >
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 p-4 flex flex-col gap-4">
      {/* Order Summary Header Card (Matching Screenshot 12) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Order ID</span>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            {order.id}
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Placed on {order.date}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('orders')}
          className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
        >
          View Details
        </button>
      </div>

      {/* Visual Timeline Step Tracker (Matching Screenshot 12) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Delivery Progress
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {order.timeline.map((step, idx) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;

            return (
              <div key={idx} className="relative flex items-start gap-3">
                {/* Dot / Icon indicator */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-pink-500 ring-4 ring-pink-500/20 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Clock className="w-3 h-3" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-pink-600 dark:text-pink-400'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.status}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {step.date !== '--' ? `${step.date}, ` : ''}{step.time}
                    </span>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Out for Delivery Notice Box (Matching Screenshot 12) */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Out for Delivery
          </h4>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5 leading-relaxed">
            Your package is out for delivery with our delivery partner.
          </p>
        </div>
      </div>

      {/* Courier & Tracking Info */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-800 dark:text-slate-200">
            DLV
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Logistics Partner</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Delhivery Express
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">Tracking ID</span>
          <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400">
            {order.trackingId}
          </span>
        </div>
      </div>

      {/* Interactive Map Preview Card */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="relative h-40 bg-slate-200 dark:bg-slate-800 overflow-hidden">
          {/* Simulated Map SVG */}
          <svg className="w-full h-full object-cover opacity-60" viewBox="0 0 400 200">
            <rect width="400" height="200" fill="#E2E8F0" className="dark:fill-slate-800" />
            <path
              d="M20 50 Q 120 40, 180 90 T 360 140"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="12"
              className="dark:stroke-slate-700"
            />
            <path
              d="M60 180 Q 150 140, 220 80 T 380 40"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="8"
              className="dark:stroke-slate-700"
            />
            {/* Delivery route line */}
            <path
              d="M70 140 Q 160 100, 260 70"
              fill="none"
              stroke="#E8317A"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            {/* Origin marker */}
            <circle cx="70" cy="140" r="6" fill="#1E2D4A" />
            {/* Destination marker */}
            <circle cx="260" cy="70" r="8" fill="#E8317A" />
            <circle cx="260" cy="70" r="14" fill="#E8317A" opacity="0.3" />
            {/* Moving van marker */}
            <circle cx="180" cy="98" r="10" fill="#00B4B6" />
          </svg>

          {/* Delivery Partner Trigger Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
            <div className="flex items-center justify-between w-full text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-bold">
                  {order.deliveryPartner?.currentLocation || '1.8 km away'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('delivery_partner')}
                className="px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <span>Live Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Partner Mini Card */}
        <div
          onClick={() => navigate('delivery_partner')}
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Delivery Partner"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {order.deliveryPartner?.name || 'Ramesh Kumar'}
              </h4>
              <p className="text-[11px] text-slate-400">
                Delivery Partner • ⭐ {order.deliveryPartner?.rating || '4.8'}
              </p>
            </div>
          </div>

          <div className="p-2 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
            <Phone className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
