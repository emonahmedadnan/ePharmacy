import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Package,
  FileCheck,
  ChevronRight,
  Printer,
  Sparkles,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { Order } from '../types';

export const DeliveryTracker: React.FC = () => {
  const {
    orders,
    activeOrder,
    setActiveOrder,
    updateOrderStatus,
    t,
    addToast,
  } = useApp();

  const [simulatedMinutes, setSimulatedMinutes] = useState(
    activeOrder?.estimatedMinutes || 24
  );

  // Auto-countdown simulation
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const timer = setInterval(() => {
      setSimulatedMinutes((prev) => {
        if (prev <= 1) {
          updateOrderStatus(activeOrder.id, 'delivered');
          return 0;
        }
        return prev - 1;
      });
    }, 12000);

    return () => clearInterval(timer);
  }, [activeOrder]);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {t('No Active Delivery Orders', 'আপনার কোনো চলমান অর্ডার নেই')}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {t(
            'Order medicines or healthcare products to track live delivery in real-time.',
            'লাইভ ডেলিভারি ট্র্যাক করতে ঔষধ বা হেলথকেয়ার পণ্য অর্ডার করুন।'
          )}
        </p>
      </div>
    );
  }

  const currentOrder: Order = activeOrder || orders[0];

  const steps = [
    {
      key: 'confirmed',
      title: t('Order Placed', 'অর্ডার সম্পন্ন'),
      desc: t('Received at epharmacy Central Hub', 'ই-ফার্মেসি সেন্ট্রাল হাবে গ্রহণ করা হয়েছে'),
      icon: Package,
    },
    {
      key: 'presc_verified',
      title: t('Pharmacist Verification', 'ফার্মাসিস্ট ভেরিফিকেশন'),
      desc: t('Verified by Registered Pharmacist (Reg. A-14982)', 'রেজিস্টার্ড এ-গ্রেড ফার্মাসিস্ট দ্বারা নিরীক্ষিত'),
      icon: FileCheck,
    },
    {
      key: 'packed',
      title: t('Temperature-Controlled Packing', 'তাপমাত্রা নিয়ন্ত্রিত প্যাকেজিং'),
      desc: t('Packed in sealed tamper-proof cold bag', 'সুরক্ষিত কুলিং ব্যাগে সিলগালা করা হয়েছে'),
      icon: ShieldCheck,
    },
    {
      key: 'rider_assigned',
      title: t('Delivery Hero Assigned', 'ডেলিভারি রাইডার নির্ধারিত'),
      desc: `${currentOrder.riderName || 'Md. Rafiqul Islam'} (${currentOrder.riderBikeNo || 'Dhaka-Metro-Ha-3421'})`,
      icon: Navigation,
    },
    {
      key: 'out_for_delivery',
      title: t('Out for Delivery', 'ডেলিভারির পথে'),
      desc: t('Rider is on the way to your doorstep', 'রাইডার আপনার বাসার উদ্দেশ্যে রওনা দিয়েছেন'),
      icon: Truck,
    },
    {
      key: 'delivered',
      title: t('Delivered', 'ডেলিভারি সম্পন্ন'),
      desc: t('Handed over safely to patient', 'সফলভাবে গ্রাহকের কাছে হস্তান্তর করা হয়েছে'),
      icon: CheckCircle,
    },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'presc_verified':
        return 1;
      case 'packed':
        return 2;
      case 'rider_assigned':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentOrder.status);

  const handleCallRider = () => {
    addToast(
      `Calling Delivery Hero ${currentOrder.riderName} (${currentOrder.riderPhone})...`,
      `ডেলিভারি রাইডার ${currentOrder.riderName}-কে কল করা হচ্ছে...`,
      'info'
    );
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Order Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {t('Live GPS Delivery Tracking', 'লাইভ জিপিএস ডেলিভারি ট্র্যাকিং')}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {t('Tracking Order #', 'অর্ডার ট্র্যাকিং #')}{currentOrder.orderNumber}
          </h2>
          <p className="text-xs text-slate-500">
            {t('Placed on:', 'অর্ডারের সময়:')}{' '}
            {new Date(currentOrder.createdAt).toLocaleDateString([], {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Orders Switcher */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 font-semibold">{t('Orders:', 'অর্ডারসমূহ:')}</span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => setActiveOrder(ord)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  currentOrder.id === ord.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                #{ord.orderNumber} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Live Map & Rider Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Animated Interactive Map Visualizer */}
          <div className="relative h-80 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
            {/* Map styling & Dhaka street grid simulation */}
            <div className="absolute inset-0 bg-[#e5e3df] opacity-90">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d5d3ce" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Road lines */}
                <path d="M 20 180 Q 250 80 500 220 T 900 160" fill="none" stroke="#ffffff" strokeWidth="16" />
                <path d="M 20 180 Q 250 80 500 220 T 900 160" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="6,6" />
                <path d="M 120 30 L 280 320" fill="none" stroke="#ffffff" strokeWidth="12" />
                <path d="M 450 10 L 410 320" fill="none" stroke="#ffffff" strokeWidth="10" />
                {/* Lake / Park polygon (like Dhanmondi / Gulshan Lake) */}
                <path d="M 280 90 Q 360 40 340 140 T 260 210 Z" fill="#bae6fd" />
              </svg>
            </div>

            {/* Hub Marker */}
            <div className="absolute top-16 left-12 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-white/95 px-2 py-0.5 rounded shadow mt-1 text-slate-800">
                {t('epharmacy Tejgaon Hub', 'ই-ফার্মেসি সেন্ট্রাল হাব')}
              </span>
            </div>

            {/* Destination / Patient Marker */}
            <div className="absolute bottom-16 right-16 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold bg-white/95 px-2 py-0.5 rounded shadow mt-1 text-slate-800 max-w-[130px] truncate">
                {currentOrder.address}
              </span>
            </div>

            {/* Animated Delivery Rider Marker */}
            {currentOrder.status !== 'delivered' && (
              <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce duration-1000">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-emerald-200">
                  <Truck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg mt-1 flex items-center gap-1 whitespace-nowrap">
                  <span>{currentOrder.riderName}</span>
                  <span className="text-emerald-400">⚡ {simulatedMinutes} mins</span>
                </div>
              </div>
            )}

            {/* Map Top Overlay: ETA Status */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentOrder.status === 'delivered'
                    ? t('Delivery Completed', 'ডেলিভারি সম্পন্ন')
                    : t('Estimated Arrival', 'আনুমানিক পৌঁছানোর সময়')}
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {currentOrder.status === 'delivered'
                    ? t('Delivered at Doorstep', 'গ্রাহকের নিকট হস্তান্তরিত')
                    : `${simulatedMinutes} ${t('Minutes', 'মিনিট')}`}
                </span>
              </div>
            </div>

            {/* Express Delivery Badge */}
            <div className="absolute bottom-4 left-4 bg-emerald-900/90 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('⚡ 2-Hour Guaranteed Express Delivery', '⚡ ২ ঘণ্টার মধ্যে গ্যারান্টেড এক্সপ্রেস ডেলিভারি')}</span>
            </div>
          </div>

          {/* Rider Profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                {currentOrder.riderName ? currentOrder.riderName.slice(0, 2) : 'RH'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900">{currentOrder.riderName || 'Md. Rafiqul Islam'}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    ★ 4.9 (1.2k+ deliveries)
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {t('Delivery Hero • Bike:', 'ডেলিভারি হিরো • বাইক:')}{' '}
                  <span className="font-mono text-slate-700">{currentOrder.riderBikeNo || 'Dhaka-Metro-Ha-3421'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCallRider}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{t('Call Delivery Hero', 'রাইডারকে কল দিন')}</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-6">
              {t('Fulfillment & Delivery Progress', 'ডেলিভারির অগ্রগতি ও ধাপসমূহ')}
            </h3>

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Vertical connecting line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-10 ${
                          idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      ></div>
                    )}

                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-sm ${
                            isCurrent
                              ? 'text-emerald-700'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                            {t('Active Stage', 'চলমান')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Invoice & Ordered Medicines */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('Order Summary', 'অর্ডার বিবরণী')}</span>
                <div className="font-extrabold text-slate-900">#{currentOrder.orderNumber}</div>
              </div>
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('Print Invoice', 'ইনভয়েস')}</span>
              </button>
            </div>

            {/* Medicines List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">{item.medicine.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.quantity} × {item.unitChoice} ({item.medicine.strength})
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">৳{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>{t('Subtotal:', 'উপমোট:')}</span>
                <span>৳{currentOrder.subtotal}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('Subscription Savings:', 'সাবস্ক্রিপশন ছাড়:')}</span>
                  <span>-৳{currentOrder.discount}</span>
                </div>
              )}
              {currentOrder.pointsDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>{t('Health Points Redeemed:', 'পয়েন্ট ব্যবহার:')}</span>
                  <span>-৳{currentOrder.pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('Delivery Fee:', 'ডেলিভারি চার্জ:')}</span>
                <span>৳{currentOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-100 pt-2">
                <span>{t('Total Paid:', 'সর্বমোট পরিশোধিত:')}</span>
                <span className="text-emerald-700">৳{currentOrder.total}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Payment Method:', 'পেমেন্ট মেথড:')}</span>
                <span className="font-bold text-slate-800">{currentOrder.paymentMethod}</span>
              </div>
              {currentOrder.transactionId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('Transaction ID:', 'ট্রানজেকশন আইডি:')}</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentOrder.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{t('Delivery To:', 'ডেলিভারির ঠিকানা:')}</span>
                <span className="font-medium text-slate-800 max-w-[160px] truncate">{currentOrder.address}</span>
              </div>
            </div>

            {/* DGDA Pharmacist Stamp */}
            <div className="border border-emerald-200 bg-emerald-50/50 p-3 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-[11px] text-emerald-900 leading-tight">
                <strong>{t('A-Grade Pharmacist Verified', 'এ-গ্রেড ফার্মাসিস্ট দ্বারা নিরীক্ষিত')}</strong>
                <p className="text-emerald-700 mt-0.5">
                  Reg No: DGDA/PH-A/14982. Expiry dates & tamper seals strictly verified before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
