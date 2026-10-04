import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  X,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Lock,
  Smartphone,
  Banknote,
  Flame,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryType: 'express' | 'standard';
  deliveryAddress: string;
  phone: string;
  district: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  deliveryType,
  deliveryAddress,
  phone,
  district,
}) => {
  const {
    cart,
    cartTotal,
    user,
    activeSubscription,
    placeOrder,
    setActiveTab,
    addToast,
    t,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'COD'>('bKash');
  const [usePoints, setUsePoints] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(phone || '01712-345678');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Subscription Discount calculation
  const subDiscountPercent = activeSubscription ? activeSubscription.discountPercentage : 0;
  const subscriptionDiscount = Math.round((cartTotal * subDiscountPercent) / 100);

  // Delivery fee
  const deliveryFee = activeSubscription?.id === 'plan-family' || activeSubscription?.id === 'plan-senior'
    ? 0
    : deliveryType === 'express'
    ? 60
    : 35;

  // Points redemption
  const maxRedeemablePoints = Math.min(user.loyaltyPoints, Math.floor(cartTotal * 0.4));
  const pointsDeduction = usePoints ? maxRedeemablePoints : 0;

  const grandTotal = Math.max(0, cartTotal - subscriptionDiscount - pointsDeduction + deliveryFee);

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethod === 'COD') {
      finalizeOrder(undefined);
      return;
    }

    if (!otpStep) {
      setOtpStep(true);
      addToast(
        `OTP code sent to ${mobileNumber} for ${selectedMethod} payment`,
        `${selectedMethod} পেমেন্টের ওটিপি কোড পাঠানো হয়েছে`,
        'info'
      );
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const txn = `${selectedMethod.toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`;
        finalizeOrder(txn);
      }, 1200);
    }
  };

  const finalizeOrder = (transactionId?: string) => {
    const newOrder = placeOrder({
      customerName: user.name,
      phone: mobileNumber,
      address: deliveryAddress,
      district: district,
      deliveryType: deliveryType,
      paymentMethod: selectedMethod,
      transactionId: transactionId,
      subtotal: cartTotal,
      discount: subscriptionDiscount,
      pointsDiscount: pointsDeduction,
      deliveryFee: deliveryFee,
      total: grandTotal,
    });

    onClose();
    setActiveTab('tracking');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {t('Secure Bangladeshi Payment', 'নিরাপদ পেমেন্ট গেটওয়ে')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('Encrypted checkout with bKash, Nagad, Rocket or Cash on Delivery', 'বিকাশ, নগদ, রকেট বা ক্যাশ অন ডেলিভারিতে পরিশোধ করুন')}
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t('Medicines Subtotal:', 'ঔষধের মোট মূল্য:')}</span>
            <span className="font-semibold text-slate-900">৳{cartTotal}</span>
          </div>

          {activeSubscription && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{activeSubscription.name} ({activeSubscription.discountPercentage}% OFF)</span>
              </span>
              <span>-৳{subscriptionDiscount}</span>
            </div>
          )}

          {user.loyaltyPoints > 0 && (
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700">
                  {t('Redeem Health Points (Available: ', 'হেলথ পয়েন্ট ব্যবহার করুন (জমা: ')}
                  <strong className="text-amber-600">{user.loyaltyPoints} Pts</strong>)
                </span>
              </label>
              {usePoints && <span className="font-bold text-amber-600">-৳{pointsDeduction}</span>}
            </div>
          )}

          <div className="flex justify-between text-slate-600">
            <span>{t('Delivery Charge:', 'ডেলিভারি চার্জ:')}</span>
            <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}</span>
          </div>

          <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
            <span>{t('Total Payable:', 'সর্বমোট প্রদেয়:')}</span>
            <span className="text-emerald-700 text-base">৳{grandTotal}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('Select Payment Gateway', 'পেমেন্ট মাধ্যম বেছে নিন')}
          </label>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {/* bKash */}
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('bKash');
                setOtpStep(false);
              }}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                selectedMethod === 'bKash'
                  ? 'border-pink-500 bg-pink-50/50 shadow-xs ring-2 ring-pink-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs">
                bK
              </div>
              <span className="text-xs font-bold text-slate-800">bKash</span>
            </button>

            {/* Nagad */}
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('Nagad');
                setOtpStep(false);
              }}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                selectedMethod === 'Nagad'
                  ? 'border-orange-500 bg-orange-50/50 shadow-xs ring-2 ring-orange-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                নগদ
              </div>
              <span className="text-xs font-bold text-slate-800">Nagad</span>
            </button>

            {/* Rocket */}
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('Rocket');
                setOtpStep(false);
              }}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                selectedMethod === 'Rocket'
                  ? 'border-purple-500 bg-purple-50/50 shadow-xs ring-2 ring-purple-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                রকেট
              </div>
              <span className="text-xs font-bold text-slate-800">Rocket</span>
            </button>

            {/* Cash on Delivery */}
            <button
              type="button"
              onClick={() => {
                setSelectedMethod('COD');
                setOtpStep(false);
              }}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                selectedMethod === 'COD'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                COD
              </div>
              <span className="text-xs font-bold text-slate-800">{t('Cash on Del.', 'ক্যাশ অন')}</span>
            </button>
          </div>

          {/* Realistic payment form */}
          {selectedMethod === 'COD' ? (
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 text-center space-y-2">
              <Banknote className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm text-emerald-900">
                {t('Pay ৳', 'পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন: ৳')}{grandTotal}
              </div>
              <p className="text-xs text-emerald-700">
                {t(
                  'Please keep exact cash ready. Our delivery hero will deliver your medicines in a sealed tamper-proof bag.',
                  'আমাদের ডেলিভারি রাইডার আপনার ঠিকানায় সিলগালা করা ব্যাগে ঔষধ পৌঁছে দিলে মূল্য পরিশোধ করবেন।'
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleInitiatePayment} className="space-y-3 pt-2">
              {!otpStep ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {t(`Your ${selectedMethod} Mobile Number:`, `আপনার ${selectedMethod} অ্যাকাউন্ট নম্বর:`)}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>{t(`Verification for ${mobileNumber}`, `${mobileNumber} নম্বরে ওটিপি পাঠানো হয়েছে`)}</span>
                    <span className="text-[11px] text-emerald-600 font-mono">OTP: 123456</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">{t('Enter 6-digit OTP:', '৬ ডিজিটের ওটিপি:')}</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-sm font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">{t(`Enter ${selectedMethod} PIN:`, `${selectedMethod} পিন নম্বর দিন:`)}</label>
                    <input
                      type="password"
                      maxLength={5}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="••••"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center text-sm font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isProcessing ? (
                  <span>{t('Processing Transaction...', 'পেমেন্ট সম্পন্ন হচ্ছে...')}</span>
                ) : !otpStep ? (
                  <>
                    <span>{t(`Continue with ${selectedMethod}`, `${selectedMethod} দিয়ে এগিয়ে যান`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{t(`Confirm Payment of ৳${grandTotal}`, `৳${grandTotal} পেমেন্ট নিশ্চিত করুন`)}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {selectedMethod === 'COD' && (
            <button
              onClick={() => finalizeOrder(undefined)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t('Confirm Cash on Delivery Order', 'ক্যাশ অন ডেলিভারি অর্ডার নিশ্চিত করুন')}</span>
            </button>
          )}
        </div>

        {/* Security watermark */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('256-bit SSL Encrypted • Bangladesh Bank Approved Payment Partners', '২৫৬-বিট এনক্রিপ্টেড ও বাংলাদেশ ব্যাংক স্বীকৃত পেমেন্ট ব্যবস্থা')}</span>
        </div>
      </div>
    </div>
  );
};
