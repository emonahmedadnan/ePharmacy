import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Truck,
  Video,
  X,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { SubscriptionPlan } from '../types';

export const SubscriptionPlansModal: React.FC = () => {
  const {
    subscriptionPlans,
    activeSubscription,
    subscribeToPlan,
    cancelSubscription,
    isSubscriptionModalOpen,
    setIsSubscriptionModalOpen,
    t,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    activeSubscription?.id || subscriptionPlans[1].id
  );
  const [deliveryDate, setDeliveryDate] = useState('1st of every month');

  const handleSubscribe = (planId: string) => {
    subscribeToPlan(planId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('Arogga Care Monthly Subscription', 'মাসিক কেয়ার সাবস্ক্রিপশন ও বিশেষ ছাড়')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          {t('Never Run Out of Essential Medicines', 'নিয়মিত ঔষধে পান সর্বোচ্চ ১৮% নিশ্চিত ছাড় ও ফ্রি ডেলিভারি')}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            'Specialized monthly medicine auto-refill subscriptions designed for regular Diabetes, Blood Pressure, Heart and Elderly patients in Bangladesh.',
            'ডায়াবেটিস, প্রেশার বা বয়োবৃদ্ধ রোগীদের জন্য ঝামেলামুক্ত নিয়মিত ঔষধের নিশ্চয়তা। প্রতিমাসে পছন্দের তারিখে স্বয়ংক্রিয় ডেলিভারি।'
          )}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {subscriptionPlans.map((plan) => {
          const isCurrentActive = activeSubscription?.id === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition relative ${
                isPopular
                  ? 'bg-linear-to-b from-emerald-900 to-teal-950 text-white shadow-xl ring-2 ring-emerald-500 scale-102 z-10'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md">
                  ★ Most Popular for Families
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-lg">{plan.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isPopular ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {plan.discountPercentage}% OFF
                  </span>
                </div>

                <p className={`text-xs mb-6 ${isPopular ? 'text-emerald-200' : 'text-slate-500'}`}>
                  {plan.tagline}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black">৳{plan.priceMonthly}</span>
                  <span className={`text-xs font-medium ${isPopular ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {t('/ month', '/ প্রতিমাসে')}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-xs">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isPopular ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      />
                      <span className={isPopular ? 'text-slate-100' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div>
                {isCurrentActive ? (
                  <div className="space-y-2">
                    <div className="w-full py-3 bg-emerald-500 text-white text-center font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('Active Plan', 'আপনার বর্তমান প্ল্যান')}</span>
                    </div>
                    <button
                      onClick={cancelSubscription}
                      className="w-full text-center text-xs text-rose-500 hover:text-rose-700 font-semibold py-1 cursor-pointer"
                    >
                      {t('Cancel Plan', 'সাবস্ক্রিপশন বাতিল')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <span>{t(`Subscribe for ৳${plan.priceMonthly}/mo`, `সাবস্ক্রাইব করুন (৳${plan.priceMonthly}/মাস)`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto Refill Setting Card */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base mb-1">
              {t('Set Monthly Auto-Refill Delivery Date', 'প্রতিমাসের ঔষধ ডেলিভারির তারিখ নির্ধারণ করুন')}
            </h4>
            <p className="text-xs text-slate-600">
              {t(
                'Our pharmacist team packages your chronic prescriptions and dispatches them automatically on this date each month.',
                'ফার্মাসিস্টরা আপনার নিয়মিত ঔষধ স্বয়ংক্রিয়ভাবে প্যাক করে এই তারিখে ডেলিভারি করবেন।'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="px-4 py-3 bg-white border border-emerald-300 rounded-2xl text-xs font-bold text-slate-800 shadow-xs outline-none"
          >
            <option value="1st of every month">1st of every month</option>
            <option value="5th of every month">5th of every month</option>
            <option value="10th of every month">10th of every month</option>
            <option value="15th of every month">15th of every month</option>
            <option value="25th of every month">25th of every month</option>
          </select>
        </div>
      </div>
    </div>
  );
};
