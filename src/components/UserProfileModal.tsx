import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  X,
  MapPin,
  Wallet,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  CheckCircle2,
  CreditCard,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Flame,
  ArrowRight,
  Edit2,
  Clock,
  Smartphone,
  RotateCcw,
  Truck,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Search,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAddress, Order, CartItem } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'addresses' | 'wallet' | 'orders';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, initialTab }) => {
  const {
    user,
    setUser,
    orders,
    setActiveOrder,
    setActiveTab,
    addToCart,
    setIsCartDrawerOpen,
    setIsAdminLoginModalOpen,
    isAdminUnlocked,
    addToast,
    t,
  } = useApp();

  const [activeTab, setActiveProfileTab] = useState<'profile' | 'addresses' | 'wallet' | 'orders'>('profile');

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveProfileTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Registration / Login Form States
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPhone, setAuthPhone] = useState('');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authDistrict, setAuthDistrict] = useState('Dhaka');
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  // Edit Profile Form States
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editDistrict, setEditDistrict] = useState(user.district || 'Dhaka');

  useEffect(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditDistrict(user.district || 'Dhaka');
  }, [user]);

  // Add Address Form States
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressDistrict, setNewAddressDistrict] = useState('Dhaka');
  const [newAddressPhone, setNewAddressPhone] = useState(user.phone);

  // Add Money / Wallet Recharge States
  const [isRechargingWallet, setIsRechargingWallet] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [rechargeGateway, setRechargeGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [rechargePhone, setRechargePhone] = useState(user.phone || '01712-345678');
  const [rechargeProcessing, setRechargeProcessing] = useState(false);

  // Order History Filter & Search States
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleReorderAll = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      addToast('No items found in this order', 'এই অর্ডারে কোনো ঔষধ পাওয়া যায়নি', 'warning');
      return;
    }

    order.items.forEach((item) => {
      addToCart(item.medicine, item.quantity, item.unitChoice);
    });

    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch (e) {}

    addToast(
      `Reordered ${order.items.length} items from #${order.orderNumber}! Added to cart.`,
      `অর্ডার #${order.orderNumber}-এর ${order.items.length}টি ঔষধ পুনরায় কার্টে যোগ করা হয়েছে!`,
      'success'
    );

    onClose();
    setIsCartDrawerOpen(true);
  };

  const handleReorderSingleItem = (item: CartItem) => {
    addToCart(item.medicine, item.quantity, item.unitChoice);
    addToast(
      `Added ${item.medicine.name} to cart!`,
      `${item.medicine.name} কার্টে যোগ করা হয়েছে!`,
      'success'
    );
  };

  const handleTrackOrder = (order: Order) => {
    setActiveOrder(order);
    setActiveTab('tracking');
    onClose();
  };

  const handleCopyOrderInfo = (order: Order) => {
    const text = `epharmacy Healthcare BD - Order Receipt
Order No: #${order.orderNumber}
Date: ${order.createdAt}
Status: ${order.status.toUpperCase()}
Delivery: ${order.deliveryType === 'express' ? '2-Hour Express Delivery' : 'Standard 24h Delivery'}
Delivery Address: ${order.address}, ${order.district}
Payment: ${order.paymentMethod} (Paid)

Items:
${order.items.map((it, idx) => `${idx + 1}. ${it.medicine.name} (${it.quantity} ${it.unitChoice}) - ৳${it.totalPrice}`).join('\n')}

Total Amount Paid: BDT ৳${order.total}`;

    navigator.clipboard.writeText(text);
    addToast(
      `Order #${order.orderNumber} receipt copied to clipboard!`,
      `অর্ডার #${order.orderNumber}-এর রশিদ ক্লিপবোর্ডে কপি করা হয়েছে!`,
      'success'
    );
  };

  if (!isOpen) return null;

  // Handle Login & Registration
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpStep) {
      if (!authPhone || authPhone.length < 11) {
        addToast('Please enter a valid 11-digit mobile number', '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন', 'warning');
        return;
      }
      setOtpStep(true);
      addToast(`OTP code 123456 sent to ${authPhone}`, `${authPhone} নম্বরে ওটিপি কোড পাঠানো হয়েছে`, 'info');
    } else {
      // Complete Registration / Login
      const newAddresses: UserAddress[] = [
        {
          id: `addr-${Date.now()}`,
          label: 'Home (প্রধান ঠিকানা)',
          address: authAddress || 'House # 42, Road # 11, Dhanmondi',
          district: authDistrict || 'Dhaka',
          phone: authPhone,
          isDefault: true,
        },
      ];

      setUser({
        id: `usr-${Date.now()}`,
        name: authName || (authMode === 'register' ? 'New Patient' : 'Registered Patient'),
        phone: authPhone,
        email: authEmail || `${authPhone}@epharmacy.bd`,
        address: authAddress || 'House # 42, Road # 11, Dhanmondi',
        district: authDistrict || 'Dhaka',
        loyaltyPoints: 100, // Welcome gift!
        walletBalance: 150, // Welcome credit!
        addresses: newAddresses,
        walletHistory: [
          {
            id: `txn-welcome`,
            type: 'credit',
            amount: 150,
            description: 'New Account Welcome Bonus Credit',
            date: new Date().toLocaleDateString(),
          },
        ],
        activeSubscriptionId: undefined,
        role: 'customer',
        isLoggedIn: true,
      });

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}

      addToast(
        `Welcome to epharmacy! Received ৳150 Welcome Wallet Credit 🌟`,
        `ই-ফার্মেসিতে স্বাগতম! আপনি পেয়েছেন ৳১৫০ ফ্রি ওয়ালেট ব্যালেন্স 🌟`,
        'success'
      );
      setOtpStep(false);
    }
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    addToast('You have been logged out successfully', 'সফলভাবে লগআউট হয়েছেন', 'info');
  };

  // Handle Profile Update
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone,
      district: editDistrict,
    }));
    addToast('Profile information updated successfully', 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে', 'success');
  };

  // Handle Address Management
  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText) return;

    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel,
      address: newAddressText,
      district: newAddressDistrict,
      phone: newAddressPhone || user.phone,
      isDefault: user.addresses?.length === 0,
    };

    setUser((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), newAddr],
    }));

    setIsAddingAddress(false);
    setNewAddressText('');
    addToast('New delivery address saved', 'নতুন ডেলিভারি ঠিকানা যুক্ত হয়েছে', 'success');
  };

  const handleSetDefaultAddress = (addrId: string) => {
    const updated = (user.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addrId,
    }));
    const defaultAddr = updated.find((a) => a.id === addrId);

    setUser((prev) => ({
      ...prev,
      addresses: updated,
      address: defaultAddr?.address || prev.address,
      district: defaultAddr?.district || prev.district,
    }));
    addToast('Default delivery address updated', 'প্রধান ডেলিভারি ঠিকানা নির্বাচিত হয়েছে', 'info');
  };

  const handleDeleteAddress = (addrId: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: (prev.addresses || []).filter((a) => a.id !== addrId),
    }));
    addToast('Address removed', 'ঠিকানা মুছে ফেলা হয়েছে', 'info');
  };

  // Handle Wallet Recharge
  const handleAddWalletMoney = (e: React.FormEvent) => {
    e.preventDefault();
    setRechargeProcessing(true);

    setTimeout(() => {
      setRechargeProcessing(false);
      const newTxn = {
        id: `txn-${Date.now()}`,
        type: 'credit' as const,
        amount: rechargeAmount,
        description: `Wallet top-up via ${rechargeGateway}`,
        date: new Date().toLocaleDateString(),
        method: rechargeGateway,
      };

      setUser((prev) => ({
        ...prev,
        walletBalance: (prev.walletBalance || 0) + rechargeAmount,
        walletHistory: [newTxn, ...(prev.walletHistory || [])],
      }));

      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch (e) {}

      setIsRechargingWallet(false);
      addToast(
        `Successfully added ৳${rechargeAmount} to your epharmacy Wallet via ${rechargeGateway}!`,
        `${rechargeGateway}-এর মাধ্যমে ওয়ালেটে ৳${rechargeAmount} সফলভাবে রিচার্জ হয়েছে!`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl lg:max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If User is NOT logged in: Show Login / Registration View */}
        {!user.isLoggedIn ? (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-md">
                <User className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {authMode === 'login'
                  ? t('Login to epharmacy', 'ই-ফার্মেসিতে লগইন করুন')
                  : t('Create Patient Account', 'নতুন একাউন্ট রেজিস্ট্রেশন করুন')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'Manage your medicine orders, saved addresses, wallet balance and doctor video appointments.',
                  'আপনার ঔষধ অর্ডার, ওয়ালেট রিচার্জ, ডেলিভারি ঠিকানা ও প্রেসক্রিপশন হিস্টোরি পরিচালনা করুন।'
                )}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl max-w-xs mx-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setOtpStep(false);
                }}
                className={`flex-1 py-2 rounded-xl transition ${
                  authMode === 'login' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('Quick Login', 'লগইন')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setOtpStep(false);
                }}
                className={`flex-1 py-2 rounded-xl transition ${
                  authMode === 'register' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                {t('Register New', 'রেজিস্ট্রেশন')}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 max-w-md mx-auto">
              {!otpStep ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('Mobile Number (১১ ডিজিট)', 'মোবাইল নম্বর')}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('Full Name', 'আপনার পূর্ণ নাম')}
                        </label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('Delivery Address', 'আপনার ডেলিভারি ঠিকানা')}
                        </label>
                        <input
                          type="text"
                          required
                          value={authAddress}
                          onChange={(e) => setAuthAddress(e.target.value)}
                          placeholder="House, Road, Area (e.g. Dhanmondi, Dhaka)"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('District', 'জেলা')}
                        </label>
                        <select
                          value={authDistrict}
                          onChange={(e) => setAuthDistrict(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                        >
                          <option value="Dhaka">Dhaka (ঢাকা)</option>
                          <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                          <option value="Sylhet">Sylhet (সিলেট)</option>
                          <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                          <option value="Khulna">Khulna (খুলনা)</option>
                          <option value="Barisal">Barisal (বরিশাল)</option>
                          <option value="Rangpur">Rangpur (রংপুর)</option>
                          <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                        </select>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                  <div className="text-xs text-slate-600">
                    {t(`Enter 6-digit OTP code sent to:`, `৬ ডিজিটের ওটিপি কোড দিন:`)}
                    <div className="font-bold text-slate-900 mt-0.5">{authPhone}</div>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-center text-lg font-mono tracking-widest bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="text-[11px] text-emerald-700 font-mono">Demo OTP: 123456</div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer text-xs"
              >
                <span>
                  {!otpStep
                    ? t('Send Verification OTP', 'ওটিপি কোড পাঠান')
                    : authMode === 'register'
                    ? t('Verify & Complete Registration (+৳150 Bonus)', 'ভেরিফাই ও রেজিস্ট্রেশন সম্পন্ন করুন (+৳১৫০ ফ্রি)')
                    : t('Verify & Login to Account', 'ভেরিফাই ও একাউন্টে প্রবেশ করুন')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400">
                {t('By signing in, you agree to epharmacy Health & Prescription terms.', 'সাইন ইন করার মাধ্যমে আপনি ই-ফার্মেসি শর্তাবলী মেনে নিচ্ছেন।')}
              </div>
            </form>
          </div>
        ) : (
          /* If User IS logged in: Show Complete Profile Dashboard */
          <div className="space-y-6">
            {/* Header Profile Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-lg">{user.name}</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified Patient
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{user.phone}</span>
                    <span>•</span>
                    <span>{user.district || 'Dhaka'}</span>
                  </div>
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl text-left">
                  <span className="text-[10px] text-emerald-800 font-bold block">{t('Wallet Balance', 'ওয়ালেট ব্যালেন্স')}</span>
                  <span className="text-sm font-black text-emerald-700">৳{user.walletBalance || 0}</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-left">
                  <span className="text-[10px] text-amber-800 font-bold block">{t('Health Points', 'হেলথ পয়েন্ট')}</span>
                  <span className="text-sm font-black text-amber-600">🌟 {user.loyaltyPoints || 0}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveProfileTab('profile')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('Personal Info', 'ব্যক্তিগত তথ্য')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveProfileTab('addresses')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('Delivery Addresses', 'ডেলিভারি ঠিকানা')}</span>
                <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full text-[10px]">
                  {user.addresses?.length || 1}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveProfileTab('wallet')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{t('Health Wallet (টাকা রিচার্জ)', 'ওয়ালেট ও রিচার্জ')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveProfileTab('orders')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{t('My Orders', 'আমার অর্ডারসমূহ')}</span>
                {orders.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === 'orders'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {orders.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: Personal Info */}
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Full Name', 'পূর্ণ নাম')}</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Mobile Number', 'মোবাইল নম্বর')}</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Email Address', 'ইমেইল')}</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Default City / District', 'জেলা')}</label>
                    <select
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Dhaka">Dhaka (ঢাকা)</option>
                      <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                      <option value="Sylhet">Sylhet (সিলেট)</option>
                      <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                      <option value="Khulna">Khulna (খুলনা)</option>
                    </select>
                  </div>
                </div>

                {/* Owner & Pharmacy Staff Portal Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t('Store Owner / Staff Control:', 'মালিক ও স্টাফদের জন্য:')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (isAdminUnlocked) {
                        setActiveTab('admin_panel');
                      } else {
                        setIsAdminLoginModalOpen(true);
                      }
                    }}
                    className="text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>{t('Pharmacy Admin & Inventory Hub', 'ফার্মেসি অ্যাডমিন পোর্টাল')}</span>
                  </button>
                </div>

                <div className="pt-1 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('Log Out of Account', 'একাউন্ট থেকে লগআউট')}</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    {t('Save Changes', 'তথ্য হালনাগাদ করুন')}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Address Book */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    {t('Saved Delivery Locations in Bangladesh', 'সংরক্ষিত ডেলিভারি ঠিকানাসমূহ')}
                  </h4>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('Add New Address', 'নতুন ঠিকানা যোগ করুন')}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleSaveNewAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Address Label', 'লেবেল')}</label>
                        <select
                          value={newAddressLabel}
                          onChange={(e) => setNewAddressLabel(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold outline-none"
                        >
                          <option value="Home">Home (বাসা)</option>
                          <option value="Office">Office (অফিস)</option>
                          <option value="Parents">Parents' Home (পিতা-মাতার বাসা)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('District', 'জেলা')}</label>
                        <select
                          value={newAddressDistrict}
                          onChange={(e) => setNewAddressDistrict(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold outline-none"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Full Street Address', 'বিস্তারিত ঠিকানা')}</label>
                      <input
                        type="text"
                        required
                        value={newAddressText}
                        onChange={(e) => setNewAddressText(e.target.value)}
                        placeholder="House, Flat, Road, Area (e.g. House 14, Road 4, Banani)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shadow-xs"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="space-y-2.5">
                  {(user.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                        addr.isDefault ? 'bg-emerald-50/50 border-emerald-500 shadow-2xs' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className={`w-4 h-4 mt-0.5 ${addr.isDefault ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                                Default (প্রধান)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{addr.address}, {addr.district}</p>
                          <span className="text-[11px] text-slate-400 font-mono">{addr.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 transition"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Digital Health Wallet */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                {/* Wallet Balance Card */}
                <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-36">
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <span className="text-xs text-emerald-200 font-semibold block uppercase tracking-wider">
                        {t('epharmacy Digital Cash Balance', 'ই-ফার্মেসি ক্যাশ ওয়ালেট ব্যালেন্স')}
                      </span>
                      <div className="text-3xl font-black mt-1">৳{user.walletBalance || 0}</div>
                      <span className="text-[11px] text-emerald-200 mt-0.5 block">
                        Instant 1-Click Checkout with zero extra transaction fees.
                      </span>
                    </div>

                    <button
                      onClick={() => setIsRechargingWallet(!isRechargingWallet)}
                      className="bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>{t('Add Money (টাকা রিচার্জ)', 'টাকা রিচার্জ করুন')}</span>
                    </button>
                  </div>
                </div>

                {/* Recharge Box */}
                {isRechargingWallet && (
                  <form onSubmit={handleAddWalletMoney} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <h5 className="font-extrabold text-slate-900 text-sm">
                      {t('Recharge Wallet via bKash / Nagad / Rocket', 'বিকাশ / নগদ / রকেটের মাধ্যমে টাকা রিচার্জ')}
                    </h5>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Select Recharge Amount (৳)', 'টাকার পরিমাণ নির্বাচন করুন')}</label>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {[200, 500, 1000, 2000].map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => setRechargeAmount(amt)}
                            className={`py-2 rounded-xl font-bold border transition ${
                              rechargeAmount === amt
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            ৳{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                        <button
                          type="button"
                          key={method}
                          onClick={() => setRechargeGateway(method)}
                          className={`py-2 rounded-xl font-bold border transition ${
                            rechargeGateway === method
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRechargingWallet(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={rechargeProcessing}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-md shadow-emerald-600/20"
                      >
                        {rechargeProcessing ? 'Processing...' : `Confirm Recharge ৳${rechargeAmount}`}
                      </button>
                    </div>
                  </form>
                )}

                {/* Wallet Transactions History */}
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs mb-2">
                    {t('Wallet Transaction History', 'ওয়ালেট লেনদেনের হিস্টোরি')}
                  </h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(user.walletHistory || []).map((txn) => (
                      <div key={txn.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-800">{txn.description}</div>
                          <div className="text-[10px] text-slate-400">{txn.date}</div>
                        </div>
                        <span className={`font-black ${txn.type === 'credit' ? 'text-emerald-700' : 'text-slate-700'}`}>
                          {txn.type === 'credit' ? '+' : '-'}৳{txn.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: My Orders & Purchase History */}
            {activeTab === 'orders' && (
              <div className="space-y-4 text-xs">
                {/* Section Header with Stats & Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
                  <div>
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-600" />
                      <span>{t('My Orders & Purchase History', 'আমার অর্ডার ও ক্রয়ের হিস্টোরি')}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t(
                        'Review past medicine purchases, monitor real-time delivery progress, and reorder routine medications with 1 click.',
                        'পূর্ববর্তী ক্রয়ের তালিকা দেখুন, লাইভ ডেলিভারি স্ট্যাটাস ট্র্যাকিং করুন এবং সহজেই পুনরায় অর্ডার করুন।'
                      )}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setOrderFilter('all')}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition cursor-pointer ${
                        orderFilter === 'all'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('All Orders', 'সকল')} ({orders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('active')}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition cursor-pointer ${
                        orderFilter === 'active'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('Active', 'চলমান')} ({orders.filter((o) => o.status !== 'delivered').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('delivered')}
                      className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition cursor-pointer ${
                        orderFilter === 'delivered'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t('Delivered', 'সম্পন্ন')} ({orders.filter((o) => o.status === 'delivered').length})
                    </button>
                  </div>
                </div>

                {/* Search Bar for Orders */}
                {orders.length > 1 && (
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder={t(
                        'Search past orders by Order # or medicine name (e.g. Napa, Seclo, Sergel)...',
                        'অর্ডার নম্বর বা ঔষধের নাম দিয়ে খুঁজুন (নাপা, সেক্লো, সার্জেল)...'
                      )}
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                    />
                    {orderSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                {/* Orders List */}
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        {t('No past orders yet', 'এখনও কোনো পূর্ববর্তী অর্ডার নেই')}
                      </h4>
                      <p className="text-slate-500 text-xs max-w-sm mx-auto">
                        {t(
                          'Your prescribed and OTC medicine purchases will appear here for easy delivery tracking and 1-click reordering.',
                          'আপনার সকল ঔষধ ক্রয়ের হিস্টোরি এখানে সংরক্ষিত থাকবে এবং এক ক্লিকেই পুনরায় অর্ডার করতে পারবেন।'
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('shop');
                          onClose();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                      >
                        {t('Browse Medicines & Order Now', 'ঔষধ দেখুন ও অর্ডার করুন')}
                      </button>
                    </div>
                  ) : (
                    (() => {
                      const filteredOrders = orders.filter((ord) => {
                        if (orderFilter === 'active' && ord.status === 'delivered') return false;
                        if (orderFilter === 'delivered' && ord.status !== 'delivered') return false;
                        if (orderSearchQuery.trim()) {
                          const q = orderSearchQuery.toLowerCase().trim();
                          const matchNum = ord.orderNumber.toLowerCase().includes(q);
                          const matchItem = ord.items.some(
                            (it) =>
                              it.medicine.name.toLowerCase().includes(q) ||
                              it.medicine.generic.toLowerCase().includes(q) ||
                              it.medicine.manufacturer.toLowerCase().includes(q)
                          );
                          if (!matchNum && !matchItem) return false;
                        }
                        return true;
                      });

                      if (filteredOrders.length === 0) {
                        return (
                          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-500 font-semibold">
                            {t('No past orders match your search.', 'আপনার সার্চের সাথে কোনো অর্ডার মেলেনি।')}
                          </div>
                        );
                      }

                      return filteredOrders.map((ord) => {
                        const isExpanded = expandedOrders[ord.id] ?? true;

                        // Status Badge metadata & progress calculation
                        const getStatusMeta = () => {
                          switch (ord.status) {
                            case 'delivered':
                              return {
                                step: 5,
                                percent: 100,
                                label: t('Delivered', 'ডেলিভার্ড'),
                                bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                                icon: CheckCircle2,
                                isPulse: false,
                                message: t('Delivered safely to doorstep', 'সফলভাবে দরজায় ডেলিভার্ড'),
                              };
                            case 'out_for_delivery':
                              return {
                                step: 4,
                                percent: 80,
                                label: t('Out for Delivery', 'ডেলিভারিতে রয়েছে'),
                                bg: 'bg-teal-100 text-teal-800 border-teal-300',
                                icon: Truck,
                                isPulse: true,
                                message: t(
                                  `Rider en route • ETA ~${ord.estimatedMinutes || 18} mins`,
                                  `রাইডার পথে রয়েছে • আনুমানিক সময় ~${ord.estimatedMinutes || 18} মিনিট`
                                ),
                              };
                            case 'rider_assigned':
                              return {
                                step: 4,
                                percent: 75,
                                label: t('Rider Assigned', 'রাইডার প্রস্তুত'),
                                bg: 'bg-blue-100 text-blue-800 border-blue-300',
                                icon: User,
                                isPulse: false,
                                message: t('Delivery partner dispatched to pharmacy hub', 'রাইডার পার্সেল সংগ্রহ করছে'),
                              };
                            case 'packed':
                              return {
                                step: 3,
                                percent: 60,
                                label: t('Packed in Cold Bag', 'প্যাকেজিং সম্পন্ন'),
                                bg: 'bg-amber-100 text-amber-800 border-amber-300',
                                icon: Package,
                                isPulse: false,
                                message: t('Sealed in temperature-insulated cold bag', 'তাপমাত্রা-নিয়ন্ত্রিত ব্যাগে প্যাকড'),
                              };
                            case 'presc_verified':
                              return {
                                step: 2,
                                percent: 40,
                                label: t('Prescription Verified', 'প্রেসক্রিপশন ভেরিফাইড'),
                                bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
                                icon: FileCheck,
                                isPulse: false,
                                message: t('Verified by registered BMDC pharmacist', 'ফার্মাসিস্ট দ্বারা প্রেসক্রিপশন যাচাইকৃত'),
                              };
                            case 'confirmed':
                            default:
                              return {
                                step: 1,
                                percent: 20,
                                label: t('Order Confirmed', 'অর্ডার কনফার্মড'),
                                bg: 'bg-purple-100 text-purple-800 border-purple-300',
                                icon: Clock,
                                isPulse: false,
                                message: t('Order queued for pharmacy fulfillment', 'ফার্মেসিতে অর্ডার প্রস্তুত হচ্ছে'),
                              };
                          }
                        };

                        const statusMeta = getStatusMeta();
                        const StatusIcon = statusMeta.icon;

                        // Formatted Date
                        let formattedDate = ord.createdAt;
                        try {
                          const d = new Date(ord.createdAt);
                          if (!isNaN(d.getTime())) {
                            formattedDate = d.toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          }
                        } catch (e) {}

                        return (
                          <div
                            key={ord.id}
                            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition overflow-hidden"
                          >
                            {/* Card Top Header */}
                            <div className="bg-slate-50/90 p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-black text-slate-900 text-sm">
                                  #{ord.orderNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOrderInfo(ord)}
                                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition cursor-pointer"
                                  title={t('Copy Order Receipt', 'রশিদ কপি করুন')}
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[11px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{formattedDate}</span>
                                </span>
                                {ord.deliveryType === 'express' ? (
                                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                                    <Flame className="w-3 h-3 text-amber-600 animate-pulse" />
                                    <span>2-Hour Express</span>
                                  </span>
                                ) : (
                                  <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Standard 24h
                                  </span>
                                )}
                              </div>

                              {/* Status Badge */}
                              <div
                                className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 shadow-2xs ${statusMeta.bg}`}
                              >
                                <StatusIcon
                                  className={`w-3.5 h-3.5 ${statusMeta.isPulse ? 'animate-bounce' : ''}`}
                                />
                                <span>{statusMeta.label}</span>
                              </div>
                            </div>

                            {/* 5-Step Visual Status Progress Tracker Bar */}
                            <div className="px-4 py-3 bg-slate-50/40 border-b border-slate-100 space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span>Status: {statusMeta.message}</span>
                                </span>
                                <span className="font-mono font-bold text-emerald-700">
                                  {statusMeta.percent}% Completed
                                </span>
                              </div>

                              {/* Visual Progress Line */}
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-linear-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${statusMeta.percent}%` }}
                                ></div>
                              </div>

                              {/* 5 Milestone Step Indicators */}
                              <div className="grid grid-cols-5 gap-1 text-[10px] font-bold text-center pt-0.5">
                                <span className={statusMeta.step >= 1 ? 'text-emerald-700' : 'text-slate-400'}>
                                  ✓ Placed
                                </span>
                                <span className={statusMeta.step >= 2 ? 'text-emerald-700' : 'text-slate-400'}>
                                  {statusMeta.step >= 2 ? '✓' : '•'} Rx Verified
                                </span>
                                <span className={statusMeta.step >= 3 ? 'text-emerald-700' : 'text-slate-400'}>
                                  {statusMeta.step >= 3 ? '✓' : '•'} Cold-Packed
                                </span>
                                <span className={statusMeta.step >= 4 ? 'text-emerald-700' : 'text-slate-400'}>
                                  {statusMeta.step >= 4 ? '✓' : '•'} Dispatched
                                </span>
                                <span className={statusMeta.step >= 5 ? 'text-emerald-700' : 'text-slate-400'}>
                                  {statusMeta.step >= 5 ? '✓' : '•'} Delivered
                                </span>
                              </div>
                            </div>

                            {/* Active Rider Notification (If out for delivery) */}
                            {ord.status === 'out_for_delivery' && (
                              <div className="bg-teal-50/70 border-b border-teal-100 px-4 py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-teal-600 animate-pulse" />
                                  <span className="font-semibold text-teal-900">
                                    Rider: <strong>{ord.riderName || 'Md. Rafiqul Islam'}</strong> ({ord.riderPhone || '01823-998877'}) • {ord.riderBikeNo || 'Dhaka-Metro-Ha-3421'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleTrackOrder(ord)}
                                  className="text-teal-700 hover:text-teal-900 font-black text-[11px] underline cursor-pointer"
                                >
                                  Track Live on Map →
                                </button>
                              </div>
                            )}

                            {/* Medicines Items List */}
                            <div className="p-4 space-y-3">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-0.5">
                                <span>
                                  {t('Medicines in this purchase', 'অর্ডারকৃত ঔষধসমূহ')} ({ord.items.length})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleOrderExpand(ord.id)}
                                  className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-extrabold cursor-pointer"
                                >
                                  <span>{isExpanded ? t('Hide Items', 'সংক্ষিপ্ত করুন') : t('View Items', 'বিস্তারিত দেখুন')}</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="space-y-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                                  {ord.items.map((item, idx) => (
                                    <div
                                      key={`${ord.id}-item-${idx}`}
                                      className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img
                                          src={item.medicine.image}
                                          alt={item.medicine.name}
                                          className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80';
                                          }}
                                        />
                                        <div className="min-w-0">
                                          <div className="font-black text-slate-900 text-xs truncate flex items-center gap-1.5">
                                            <span>{item.medicine.name}</span>
                                            {item.medicine.isRxRequired && (
                                              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1 rounded">
                                                Rx
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[10px] text-slate-500 truncate">
                                            {item.medicine.strength} • {item.medicine.manufacturer.split(' ')[0]}
                                          </div>
                                          <div className="text-[10px] text-emerald-700 font-bold">
                                            {item.quantity}{' '}
                                            {item.unitChoice === 'box'
                                              ? t('Box (১০ পাতা)', 'বক্স')
                                              : t('Strip (পাতা)', 'পাতা')}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Line Price & Individual Item Reorder */}
                                      <div className="flex items-center gap-3 shrink-0">
                                        <span className="font-black text-slate-900 text-xs">
                                          ৳{item.totalPrice}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleReorderSingleItem(item)}
                                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                                          title={t('Reorder this single medicine item', 'এই ঔষধটি পুনরায় অর্ডার করুন')}
                                        >
                                          <Plus className="w-3 h-3 text-emerald-700" />
                                          <span>{t('Reorder Item', 'অর্ডার')}</span>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Delivery Address & Contact info */}
                              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                                <div className="flex items-start gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                  <span className="truncate">
                                    {ord.address}, {ord.district}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{ord.phone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer with Summary & Reorder Action Buttons */}
                            <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                                  {t('Total Paid via', 'পরিশোধ মাধ্যম')} {ord.paymentMethod}
                                </span>
                                <div className="text-lg font-black text-slate-900">
                                  ৳{ord.total}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Track Delivery Button */}
                                <button
                                  type="button"
                                  onClick={() => handleTrackOrder(ord)}
                                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                                >
                                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{t('Track Delivery', 'লাইভ ট্র্যাক')}</span>
                                </button>

                                {/* Reorder Entire Order Button */}
                                <button
                                  type="button"
                                  onClick={() => handleReorderAll(ord)}
                                  className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer whitespace-nowrap"
                                  title={t('Add all medicines in this past order to cart', 'এই অর্ডারের সকল ঔষধ কার্টে যোগ করুন')}
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>{t('Reorder All Items', 'পুনরায় অর্ডার করুন')}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
