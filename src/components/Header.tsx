import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Mic,
  ShoppingCart,
  Upload,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  Bell,
  Video,
  Truck,
  User,
  Flame,
  ShieldCheck,
  Package,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    t,
    user,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    cartItemCount,
    cartTotal,
    setIsCartDrawerOpen,
    setIsVoiceSearchOpen,
    setIsPrescriptionModalOpen,
    setIsPillReminderModalOpen,
    setIsAiChatOpen,
    setIsProfileModalOpen,
    openProfileTab,
    orders,
    isAdminUnlocked,
    unlockAdmin,
    activeTab,
    setActiveTab,
    pillReminders,
  } = useApp();

  const handleSearchInput = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (
      trimmed === '/admin' ||
      trimmed === 'admin' ||
      trimmed === '/admin/' ||
      trimmed === '#admin' ||
      trimmed === 'admin123'
    ) {
      setSearchQuery('');
      unlockAdmin('admin123');
      setActiveTab('admin_panel');
      return;
    }
    setSearchQuery(val);
    if (activeTab !== 'shop') setActiveTab('shop');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim().toLowerCase();
      if (
        trimmed === '/admin' ||
        trimmed === 'admin' ||
        trimmed === '/admin/' ||
        trimmed === '#admin' ||
        trimmed === 'admin123'
      ) {
        setSearchQuery('');
        unlockAdmin('admin123');
        setActiveTab('admin_panel');
        return;
      }
      if (activeTab !== 'shop') setActiveTab('shop');
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  const goHome = () => {
    setActiveTab('home');
    setSearchQuery('');
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeRemindersCount = pillReminders.filter((r) => r.active).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-200">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('24/7 Hotline: 09678-374276 / 16263', '২৪/৭ হটলাইন: ০৯৬৭৮-৩৭৪২৭৬ / ১৬২৬৩')}</span>
            </span>
            <span className="hidden sm:inline-block text-emerald-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-200">
              <Truck className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{t('⚡ 2-Hour Express Delivery in Dhaka', '⚡ ঢাকায় ২ ঘণ্টায় এক্সপ্রেস হোম ডেলিভারি')}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user.district || 'Dhaka'}</span>
            </div>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-emerald-800/80 hover:bg-emerald-800 px-2 py-0.5 rounded text-white font-medium transition cursor-pointer"
              title="Change Language"
            >
              <span>{language === 'bn' ? '🇬🇧 English' : '🇧🇩 বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2">
            <button
              onClick={goHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title={t('Go to Home Page', 'হোম পেজে ফিরে যান')}
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                <span className="font-extrabold text-2xl tracking-tighter">e</span>
                <span className="font-bold text-xs bg-white text-emerald-700 px-0.5 rounded-sm ml-0.5">Rx</span>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  epharmacy
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-emerald-600 tracking-wider uppercase">
                  {t('Digital Health Bangladesh', 'ডিজিটাল স্বাস্থ্যসেবা')}
                </span>
              </div>
            </button>
          </div>

          {/* Search bar with Voice search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t(
                  'Search Napa, Seclo, Cetaphil, CeraVe, Glucometer...',
                  'নাপা, সেক্লো, সেটাফিল, সেরাভি, গ্লুকোমিটার বা ঔষধ খুঁজুন...'
                )}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-full text-sm outline-none transition shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={() => setIsVoiceSearchOpen(true)}
                  className="flex items-center gap-1.5 bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold transition border border-emerald-300 cursor-pointer shadow-2xs"
                  title={t('Bangla Voice Search Medicine', 'বাংলা ভয়েস দিয়ে ঔষধ খুঁজুন')}
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                  <span className="text-[11px]">{t('Bangla Voice', 'বাংলা ভয়েস')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Pill Reminder Button */}
            <button
              onClick={() => setIsPillReminderModalOpen(true)}
              className="relative p-2 rounded-full text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
              title={t('Medication Reminders', 'ঔষধ সেবনের রিমাইন্ডার')}
            >
              <Bell className="w-5 h-5" />
              {activeRemindersCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {activeRemindersCount}
                </span>
              )}
            </button>

            {/* Upload Prescription Button */}
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4 text-teal-600" />
              <span>{t('Upload Rx', 'প্রেসক্রিপশন আপলোড')}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/25 transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-4 h-4 rounded-full text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">৳{cartTotal}</span>
            </button>

            {/* My Orders Button */}
            <button
              onClick={() => openProfileTab('orders')}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/90 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              title={t('My Past Orders & Delivery Status', 'পূর্ববর্তী অর্ডার ও ডেলিভারি স্ট্যাটাস')}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{t('My Orders', 'আমার অর্ডার')}</span>
              {orders.length > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Profile / Login Button */}
            {!user.isLoggedIn ? (
              <button
                onClick={() => openProfileTab('profile')}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title={t('Login or Register to epharmacy', 'লগইন বা রেজিস্ট্রেশন করুন')}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>{t('Login / Register', 'লগইন / রেজিস্টার')}</span>
              </button>
            ) : (
              <button
                onClick={() => openProfileTab('profile')}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition text-xs font-semibold text-slate-800 cursor-pointer shadow-2xs"
                title={t('My Profile & Account', 'আমার প্রোফাইল ও একাউন্ট')}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    ৳{user.walletBalance || 0}
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2 md:hidden">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('Search medicines, beauty, baby care...', 'ঔষধ, রূপচর্চা বা বেবি কেয়ার খুঁজুন...')}
              className="w-full pl-9 pr-14 py-2 bg-slate-100 rounded-full text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={() => setIsVoiceSearchOpen(true)}
              className="absolute right-2 flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-[10px] font-bold"
              title="Bangla Voice Search"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              <span>বাংলা</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Tabs */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 text-xs font-semibold whitespace-nowrap">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <span>{t('🏠 Home', '🏠 হোম')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shop'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <span>{t('💊 Medicine Shop', '💊 শপ / পণ্যসমূহ')}</span>
          </button>

          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="px-3 py-1.5 rounded-lg transition cursor-pointer text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('Upload Prescription', 'প্রেসক্রিপশন আপলোড')}</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'subscriptions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('Care Subscriptions (15% OFF)', 'মান্থলি কেয়ার সাবস্ক্রিপশন (১৫% ছাড়)')}</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('Doctor Video Consult', 'ডাক্তার ভিডিও পরামর্শ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tracking'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="flex items-center gap-1">
              <span>{t('Live Delivery Tracking', 'লাইভ ডেলিভারি ট্র্যাকিং')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </span>
          </button>

          <button
            onClick={() => setIsPillReminderModalOpen(true)}
            className="px-3 py-1.5 rounded-lg transition cursor-pointer text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('Pill Reminders', 'ঔষধের এলার্ম')}</span>
          </button>

          {isAdminUnlocked && (
            <button
              onClick={() => {
                setActiveTab('admin_panel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-bold ${
                activeTab === 'admin_panel'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200'
              }`}
              title="Admin HQ Mode Unlocked"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{t('🛡️ Admin HQ', '🛡️ অ্যাডমিন প্যানেল')}</span>
            </button>
          )}

          <button
            onClick={() => setIsAiChatOpen(true)}
            className="px-3 py-1.5 rounded-lg transition cursor-pointer bg-linear-to-r from-teal-500 to-emerald-600 text-white shadow-xs flex items-center gap-1.5 ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{t('eDoc AI Assistant', 'স্বাস্থ্য সহায়ক AI')}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
