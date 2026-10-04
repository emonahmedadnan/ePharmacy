import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  X,
  Volume2,
  Sparkles,
  Flame,
  AlertCircle,
} from 'lucide-react';

export const MedicationReminderModal: React.FC = () => {
  const {
    isPillReminderModalOpen,
    setIsPillReminderModalOpen,
    pillReminders,
    addPillReminder,
    togglePillReminder,
    markPillTaken,
    deletePillReminder,
    t,
    addToast,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('1 Tablet');
  const [time1, setTime1] = useState('08:00');
  const [mealRelation, setMealRelation] = useState<'before_meal' | 'after_meal' | 'with_meal'>('after_meal');

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
      addToast('Medication alarm sound test played', 'রিমাইন্ডার অ্যালার্ম সাউন্ড টেস্ট সম্পন্ন', 'info');
    } catch (e) {
      console.log('AudioContext not allowed without interaction');
    }
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    addPillReminder({
      medicineName: medName,
      dosage: medDose,
      timing: [time1],
      mealRelation: mealRelation,
      mealRelationBn:
        mealRelation === 'before_meal'
          ? 'খাবারের ৩০ মিনিট পূর্বে'
          : mealRelation === 'after_meal'
          ? 'খাবারের পর'
          : 'খাবারের সাথে',
      active: true,
    });

    setIsAddingNew(false);
    setMedName('');
  };

  if (!isPillReminderModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsPillReminderModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {t('Medication Pill Reminders', 'নিয়মিত ঔষধ খাওয়ার রিমাইন্ডার ও অ্যালার্ম')}
            </h3>
            <p className="text-xs text-slate-500">
              {t(
                'Never miss a dose. Earn +10 Health Points 🌟 every time you take your medicines on time.',
                'সময়মতো ঔষধ খেলে পান বোনাস হেলথ পয়েন্ট এবং সুস্থ থাকুন।'
              )}
            </p>
          </div>
        </div>

        {/* Audio Test button */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>{t('Medication Audio Chime Alarm', 'রিমাইন্ডার সুর')}</span>
          </div>
          <button
            onClick={playChime}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-xl transition cursor-pointer"
          >
            {t('Test Chime 🔔', 'শব্দ শুনুন 🔔')}
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
          {pillReminders.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              {t('No medication alarms set yet.', 'কোনো রিমাইন্ডার সেট করা নেই।')}
            </div>
          ) : (
            pillReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  reminder.active ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{reminder.medicineName}</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                      {reminder.dosage}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono text-slate-800 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {reminder.timing.join(', ')}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">{reminder.mealRelationBn}</span>
                  </div>

                  {reminder.streakDays > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>{reminder.streakDays} {t('Days Adherence Streak', 'দিনের স্ট্রিক')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markPillTaken(reminder.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Mark as Taken"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[11px]">{t('Taken', 'খেয়েছি')}</span>
                  </button>

                  <button
                    onClick={() => deletePillReminder(reminder.id)}
                    className="text-slate-300 hover:text-rose-500 p-2 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Reminder Form */}
        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Set New Medicine Alarm', 'নতুন ঔষধের রিমাইন্ডার যোগ করুন')}</span>
          </button>
        ) : (
          <form onSubmit={handleSaveReminder} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('Medicine Name', 'ঔষধের নাম')}
              </label>
              <input
                type="text"
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Seclo 20mg or Napa Extra"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Dosage', 'মাত্রা')}
                </label>
                <input
                  type="text"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                  placeholder="1 Tablet / 1 Capsule"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Alarm Time', 'সময়')}
                </label>
                <input
                  type="time"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('Relation to Meal', 'খাবারের সময়কাল')}
              </label>
              <select
                value={mealRelation}
                onChange={(e) => setMealRelation(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-semibold text-slate-700"
              >
                <option value="after_meal">After Meal (খাবারের পর)</option>
                <option value="before_meal">Before Meal (খাবারের ৩০ মিনিট পূর্বে)</option>
                <option value="with_meal">With Meal (খাবারের সাথে)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-200 rounded-xl"
              >
                {t('Cancel', 'বাতিল')}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                {t('Save Alarm', 'সংরক্ষণ করুন')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
