import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  X,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Package,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    setActiveTab,
    t,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = unlockAdmin(pinInput);
    if (success) {
      setPinInput('');
      setIsAdminLoginModalOpen(false);
    } else {
      setErrorMsg(t('Incorrect PIN. Default PIN is: admin123', 'ভুল পিন নম্বর। ডিফল্ট পিন: admin123'));
    }
  };

  const handleQuickDemoUnlock = () => {
    unlockAdmin('admin123');
    setIsAdminLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in zoom-in-95 duration-200 text-slate-900">
        <button
          onClick={() => {
            setIsAdminLoginModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-md shadow-purple-500/10 border border-purple-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Owner & Pharmacist Access
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            {t('Pharmacy HQ Command Center', 'ফার্মেসি ব্যাকঅফিস অ্যাডমিন প্যানেল')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              'Enter owner security PIN to control medicine inventory, view Recharts sales analytics, manage clients, and update orders.',
              'ইনভেন্টরি স্টক আপডেট, সেলস রিপোর্ট দেখা এবং গ্রাহক তথ্য পরিচালনার জন্য পিন নম্বর দিন।'
            )}
          </p>
        </div>

        {/* If already unlocked */}
        {isAdminUnlocked ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-emerald-900 text-xs">
                {t('Admin privileges are currently ACTIVE', 'অ্যাডমিন অ্যাক্সেস বর্তমানে সক্রিয় রয়েছে')}
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {t('You have full administrative privileges to edit stocks, prices and reports.', 'আপনার স্টক ও সেলস রিপোর্ট পরিচালনার পূর্ণ অনুমতি রয়েছে।')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin_panel');
                  setIsAdminLoginModalOpen(false);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t('Go to Admin Hub', 'অ্যাডমিন প্যানেলে যান')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  lockAdmin();
                  setIsAdminLoginModalOpen(false);
                }}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                {t('Lock Admin', 'লক করুন')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('Admin Security PIN / Passcode', 'অ্যাডমিন সিকিউরিটি পিন')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title={showPassword ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Quick Demo Hint */}
            <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-3 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-purple-950 block">
                  {t('Default Passcode:', 'ডিফল্ট পাসকোড:')} <code className="bg-purple-200/70 px-1.5 py-0.5 rounded font-mono font-black text-purple-900">admin123</code>
                </span>
                <span className="text-[11px] text-purple-800">
                  {t('Or shortcut: Press Ctrl+Shift+A anytime to open.', 'যেকোনো সময় Ctrl+Shift+A চাপুন।')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoUnlock}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] shrink-0 transition cursor-pointer shadow-xs whitespace-nowrap"
              >
                {t('1-Click Unlock', '১-ক্লিক আনলক')}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition cursor-pointer text-xs"
            >
              <KeyRound className="w-4 h-4" />
              <span>{t('Unlock Admin Control Center', 'অ্যাডমিন প্যানেলে প্রবেশ করুন')}</span>
            </button>
          </form>
        )}

        {/* Features Preview */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-semibold">
          <div className="p-2 rounded-xl bg-slate-50">
            <Package className="w-3.5 h-3.5 mx-auto mb-1 text-purple-600" />
            <span>{t('Inventory & Stock', 'ইনভেন্টরি কন্ট্রোল')}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <TrendingUp className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
            <span>{t('Sales Analytics', 'রিচার্টস সেলস')}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50">
            <Users className="w-3.5 h-3.5 mx-auto mb-1 text-blue-600" />
            <span>{t('Clients & Wallet', 'ক্লায়েন্ট ব্যবস্থাপনা')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
