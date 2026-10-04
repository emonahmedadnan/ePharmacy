import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Video,
  Calendar,
  Users,
  Clock,
  FileText,
  CheckCircle,
  Plus,
  Send,
  Sparkles,
  Phone,
  Mail,
  Search,
} from 'lucide-react';
import { Appointment, DigitalRx } from '../types';

export const DoctorDashboard: React.FC = () => {
  const {
    appointments,
    startVideoCall,
    saveDigitalRx,
    medicines,
    user,
    t,
    addToast,
  } = useApp();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(
    appointments[0] || null
  );

  // Digital Rx Form states
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Bronchitis & Dyspepsia');
  const [rxMedicines, setRxMedicines] = useState<
    { brandName: string; generic: string; dosage: string; timing: string; duration: string }[]
  >([
    {
      brandName: 'Napa Extra',
      generic: 'Paracetamol + Caffeine',
      dosage: '1+0+1',
      timing: 'After meal',
      duration: '5 days',
    },
    {
      brandName: 'Monas 10mg',
      generic: 'Montelukast Sodium',
      dosage: '0+0+1',
      timing: 'Night before sleep',
      duration: '14 days',
    },
    {
      brandName: 'Seclo 20mg',
      generic: 'Omeprazole',
      dosage: '1+0+0',
      timing: 'Before breakfast',
      duration: '14 days',
    },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1+0+1');
  const [rxAdvice, setRxAdvice] = useState('Avoid cold food & drinks. Take steam inhalation. Complete full dosage.');

  const handleAddMed = () => {
    if (!newMedName) return;
    setRxMedicines((prev) => [
      ...prev,
      {
        brandName: newMedName,
        generic: 'Clinical formulation',
        dosage: newMedDose,
        timing: 'As directed',
        duration: '7 days',
      },
    ]);
    setNewMedName('');
    addToast('Medicine added to prescription list', 'ঔষধ প্রেসক্রিপশনে যুক্ত হয়েছে', 'info');
  };

  const handleIssueRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const digitalRx: DigitalRx = {
      id: `rx-${Date.now()}`,
      appointmentId: selectedAppointment.id,
      doctorName: 'Prof. Dr. Shahriar Kabir',
      bmdcReg: 'BMDC-A-24819',
      degrees: 'MBBS, FCPS (Medicine), MD',
      patientName: selectedAppointment.patientName,
      patientAge: selectedAppointment.patientAge,
      date: new Date().toLocaleDateString(),
      diagnosis: rxDiagnosis,
      medicines: rxMedicines,
      advice: rxAdvice,
      nextFollowUp: 'Follow up in 7 days or SOS',
    };

    saveDigitalRx(selectedAppointment.id, digitalRx);
    addToast(
      `Digital Rx issued & emailed to ${selectedAppointment.patientName}!`,
      `প্রেসক্রিপশন সফলভাবে রোগীর ইমেইল ও অ্যাপে পাঠানো হয়েছে!`,
      'success'
    );
  };

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'booked').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Doctor Profile Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-2xl border border-teal-200">
            Dr
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Prof. Dr. Shahriar Kabir</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                BMDC: BMDC-A-24819
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              MBBS, FCPS (Medicine), MD • BSMMU (PG Hospital)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center min-w-24">
            <span className="text-slate-400 block font-semibold">{t('Today Queue', 'আজকের সিরিয়াল')}</span>
            <span className="text-lg font-black text-slate-900">{appointments.length}</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center min-w-24">
            <span className="text-emerald-700 block font-semibold">{t('Completed', 'পরামর্শ সম্পন্ন')}</span>
            <span className="text-lg font-black text-emerald-800">{completedCount}</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center min-w-24">
            <span className="text-amber-700 block font-semibold">{t('Waiting', 'অপেক্ষমান')}</span>
            <span className="text-lg font-black text-amber-800">{pendingCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Appointments Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              {t('Patient Appointments Queue', 'রোগীদের সিরিয়াল ও অ্যাপয়েন্টমেন্ট')}
            </h3>
            <span className="text-xs font-bold text-slate-400 font-mono">Today</span>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const isSelected = selectedAppointment?.id === apt.id;
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className={`p-4 rounded-3xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{apt.patientName}</h4>
                      <div className="text-xs text-slate-500">
                        {apt.patientAge} Yrs • {apt.patientGender} • {apt.phone}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : apt.status === 'in_call'
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {apt.status === 'completed' ? 'Completed' : apt.slot}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-1 bg-white/70 p-1.5 rounded-lg border border-slate-100">
                    <strong className="text-slate-700">Problem:</strong> {apt.problem}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-mono text-emerald-700 font-bold">
                      Fee: ৳{apt.feeBDT} ({apt.paymentMethod})
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startVideoCall(apt);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{t('Start Video Call', 'ভিডিও কল শুরু')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Patient Medical History & Digital Rx Pad */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAppointment ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    {t('Active Patient Record', 'রোগীর মেডিকেল হিস্টোরি')}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedAppointment.patientName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                    <span>{t('Age:', 'বয়স:')} {selectedAppointment.patientAge}</span>
                    <span>•</span>
                    <span>{t('Gender:', 'লিঙ্গ:')} {selectedAppointment.patientGender}</span>
                    <span>•</span>
                    <span>{selectedAppointment.phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => startVideoCall(selectedAppointment)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>{t('Join Video Consultation Room', 'ভিডিও কলে যুক্ত হন')}</span>
                </button>
              </div>

              {/* Patient's Symptoms Description */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  {t('Reported Symptoms & Chief Complaints:', 'রোগীর লক্ষণ ও সমস্যার বিবরণ:')}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedAppointment.problem}
                </p>
              </div>

              {/* Digital Prescription Form Pad */}
              <form onSubmit={handleIssueRx} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>{t('Prescribe Digital Rx (BMDC Certified)', 'ডিজিটাল প্রেসক্রিপশন প্রস্তুত করুন')}</span>
                  </h4>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {t('Provisional Diagnosis', 'রোগ নির্ণয় (Diagnosis)')}
                  </label>
                  <input
                    type="text"
                    value={rxDiagnosis}
                    onChange={(e) => setRxDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Prescribed List Table */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">
                    {t('Medicines List (Rx)', 'ঔষধ ও সেবনবিধি')}
                  </label>
                  {rxMedicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{med.brandName}</div>
                        <div className="text-[11px] text-slate-500">
                          {med.dosage} • {med.timing} • {med.duration}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRxMedicines(rxMedicines.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Medicine */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {t('Add New Medicine from Inventory:', 'নতুন ঔষধ যোগ করুন:')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="e.g. Fexo 120mg"
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      placeholder="Dosage (1+0+1 After meal)"
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddMed}
                      className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold py-2 cursor-pointer"
                    >
                      + Add Medicine
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {t('Doctor Advice & Instructions', 'পরামর্শ ও নির্দেশাবলী')}
                  </label>
                  <textarea
                    rows={2}
                    value={rxAdvice}
                    onChange={(e) => setRxAdvice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('Issue Prescription & Send Notification to Patient', 'প্রেসক্রিপশন ইস্যু করুন এবং রোগীকে পাঠান')}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              {t('Select an appointment from the queue to view medical history', 'মেডিকেল হিস্টোরি দেখতে সিরিয়াল থেকে পেশেন্ট সিলেক্ট করুন')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
