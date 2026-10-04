import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Flame,
  Sparkles,
  MapPin,
  Phone,
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    user,
    activeSubscription,
    t,
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<'express' | 'standard'>('express');
  const [deliveryAddress, setDeliveryAddress] = useState(user.address);
  const [deliveryDistrict, setDeliveryDistrict] = useState(user.district || 'Dhaka');
  const [deliveryPhone, setDeliveryPhone] = useState(user.phone);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isCartDrawerOpen) return null;

  const subDiscount = activeSubscription
    ? Math.round((cartTotal * activeSubscription.discountPercentage) / 100)
    : 0;

  const deliveryFee =
    activeSubscription?.id === 'plan-family' || activeSubscription?.id === 'plan-senior'
      ? 0
      : deliveryType === 'express'
      ? 60
      : 35;

  const grandTotal = Math.max(0, cartTotal - subDiscount + deliveryFee);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t('Your Medicine Bag', 'আপনার ঔষধের কার্ট')}
                </h3>
                <span className="text-xs text-slate-500">
                  {cart.length} {t('Items in cart', 'টি আইটেম')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div className="font-bold text-slate-700 text-base">
                  {t('Your Bag is Empty', 'আপনার কার্ট খালি')}
                </div>
                <p className="text-xs text-slate-500 max-w-xs">
                  {t('Search authentic medicines, upload prescription or browse directory.', 'ঔষধ সার্চ করুন বা প্রেসক্রিপশন আপলোড করে সহজে অর্ডার করুন।')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div
                    key={`${item.medicine.id}-${item.unitChoice}`}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.medicine.image}
                        alt={item.medicine.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{item.medicine.name}</span>
                          {item.medicine.isRxRequired && (
                            <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.medicine.strength} • {item.medicine.manufacturer.split(' ')[0]}</div>
                        <div className="text-xs font-bold text-emerald-700 mt-0.5">
                          ৳{item.totalPrice}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (৳{item.unitChoice === 'box' ? item.medicine.pricePerBox : item.medicine.pricePerUnit}/{item.unitChoice})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.unitChoice, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.unitChoice, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.medicine.id, item.unitChoice)}
                        className="text-slate-300 hover:text-rose-500 p-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-4 shadow-lg">
              {/* Delivery Speed Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryType('express')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    deliveryType === 'express'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>⚡ 2-Hr Express</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Dhaka Metro (৳60)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('standard')}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    deliveryType === 'standard'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="font-extrabold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-600" />
                    <span>Standard Regular</span>
                  </div>
                  <div className="text-[10px] text-slate-500">All 64 Districts (৳35)</div>
                </button>
              </div>

              {/* Delivery Address input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('Delivery Address:', 'ডেলিভারি ঠিকানা:')}</span>
                  </span>
                  <input
                    type="text"
                    value={deliveryDistrict}
                    onChange={(e) => setDeliveryDistrict(e.target.value)}
                    className="w-20 text-right bg-transparent font-bold text-slate-800 outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House, Road, Area (e.g. Dhanmondi, Dhaka)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Price summary */}
              <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2">
                <div className="flex justify-between">
                  <span>{t('Subtotal', 'উপমোট')}</span>
                  <span className="font-semibold text-slate-900">৳{cartTotal}</span>
                </div>
                {subDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Care Subscription Discount</span>
                    <span>-৳{subDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('Delivery Charge', 'ডেলিভারি চার্জ')}</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                  <span>{t('Total Amount', 'সর্বমোট')}</span>
                  <span className="text-emerald-700 text-base">৳{grandTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{t('Proceed to bKash / Payment', 'পেমেন্ট করুন (বিকাশ / নগদ / সিওডি)')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setIsCartDrawerOpen(false);
        }}
        deliveryType={deliveryType}
        deliveryAddress={deliveryAddress}
        phone={deliveryPhone}
        district={deliveryDistrict}
      />
    </>
  );
};
