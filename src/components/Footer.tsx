import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Mail,
  Truck,
  Heart,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveTab,
    setSearchQuery,
    setSelectedCategory,
    setIsAdminLoginModalOpen,
    isAdminUnlocked,
    unlockAdmin,
    t,
  } = useApp();

  const goHome = () => {
    setActiveTab('shop');
    setSearchQuery('');
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* Top Value Propositions */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">{t('100% Genuine Medicine', '১০০% আসল ঔষধের নিশ্চয়তা')}</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t('Direct from Square, Beximco & Incepta pharmaceutical factories.', 'সরাসরি প্রস্তুতকারক কোম্পানি থেকে সংগৃহীত।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">{t('Express & Nationwide Delivery', 'দ্রুত হোম ডেলিভারি')}</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t('2-hour express delivery in Dhaka Metro; next-day to all 64 districts.', 'ঢাকায় ২ ঘণ্টায় এবং সারা দেশে পরদিন পৌঁছে যাবে।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">{t('A-Grade Certified Pharmacists', 'এ-গ্রেড ফার্মাসিস্ট সাপোর্ট')}</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t('Free dosage guidance & prescription verification call in 15 mins.', '১৫ মিনিটের মধ্যে ভেরিফিকেশন ও ডোজ পরামর্শ।')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">{t('Care Subscription & Points', 'হেলথ পয়েন্ট ও বিশেষ ছাড়')}</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t('Earn ৳1 eCash for every point earned on orders. Monthly discount up to 18%.', 'প্রতি অর্ডারে পয়েন্ট অর্জন ও মাসিক অটো-রিফিল।')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <button
            onClick={goHome}
            className="flex items-center gap-2 group cursor-pointer text-left"
            title="Go to Home"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 transition flex items-center justify-center text-white font-extrabold text-base shadow-md">
              e
            </div>
            <span className="text-xl font-black text-white group-hover:text-emerald-400 transition">epharmacy</span>
          </button>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t(
              'epharmacy is Bangladesh\'s pioneering digital pharmacy and telehealth platform connecting patients with licensed pharmacies and specialist doctors.',
              'ই-ফার্মেসি বাংলাদেশের বিশ্বস্ত অনলাইন ফার্মেসি ও ডিজিটাল স্বাস্থ্যসেবা প্ল্যাটফর্ম।'
            )}
          </p>
          <div className="text-[11px] text-emerald-400 font-mono">
            DGDA Drug License: DA-148920/2026
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t('Healthcare Services', 'স্বাস্থ্য সেবাসমূহ')}</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer">{t('Upload Prescription', 'প্রেসক্রিপশন আপলোড')}</span></li>
            <li><span className="hover:text-white cursor-pointer">{t('Doctor Video Consultation', 'অনলাইন ডাক্তার ভিডিও কল')}</span></li>
            <li><span className="hover:text-white cursor-pointer">{t('Care Monthly Subscriptions', 'মান্থলি কেয়ার সাবস্ক্রিপশন')}</span></li>
            <li><span className="hover:text-white cursor-pointer">{t('Medication Pill Alarms', 'ঔষধ খাওয়ার এলার্ম')}</span></li>
            <li><span className="hover:text-white cursor-pointer">{t('Live Delivery Tracking', 'লাইভ ডেলিভারি ট্র্যাকিং')}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t('Popular Bangladeshi Categories', 'জনপ্রিয় ক্যাটাগরি')}</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer">Paracetamol & Fever (Napa, Ace)</span></li>
            <li><span className="hover:text-white cursor-pointer">Gastric & Ulcer (Seclo, Sergel, Pantonix)</span></li>
            <li><span className="hover:text-white cursor-pointer">Antihistamine (Fexo, Alatrol, Monas)</span></li>
            <li><span className="hover:text-white cursor-pointer">Diabetic Meters & Strips (Accu-Chek)</span></li>
            <li><span className="hover:text-white cursor-pointer">Digital BP Monitors (Omron)</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">{t('Emergency Contacts & Support', 'জরুরী যোগাযোগ')}</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>16263 / 09678-374276</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>care@epharmacy.com.bd</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Level 6, Navana Tower, Gulshan-1, Dhaka</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Badges & Hidden Admin trigger */}
      <div className="border-t border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{t('Accepted Payment Gateways:', 'অনুমোদিত পেমেন্ট মাধ্যম:')}</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <span className="bg-pink-900/60 text-pink-300 px-2 py-0.5 rounded text-[10px]">bKash</span>
              <span className="bg-orange-900/60 text-orange-300 px-2 py-0.5 rounded text-[10px]">Nagad</span>
              <span className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded text-[10px]">Rocket</span>
              <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[10px]">Cash on Delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">
              © 2026 epharmacy Ltd. All rights reserved.
            </span>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => {
                unlockAdmin('admin123');
                setActiveTab('admin_panel');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[11px] text-slate-400 hover:text-purple-300 transition flex items-center gap-1 cursor-pointer bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-2xs font-mono"
              title="Restricted Staff & Admin Management (/admin)"
            >
              <Lock className="w-3 h-3 text-purple-400" />
              <span>{t('🔐 /admin Portal', '🔐 /admin পোর্টাল')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
