import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Star,
  Clock,
  ShieldCheck,
  Calendar,
  Phone,
  CheckCircle,
  Hospital,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Doctor } from '../types';

export const DoctorDirectory: React.FC = () => {
  const {
    doctors,
    bookAppointment,
    startVideoCall,
    appointments,
    user,
    t,
    addToast,
  } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState(user.name);
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [paymentGateway, setPaymentGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');

  const specialties = [
    { id: 'all', name: t('All Specialists', 'সকল বিশেষজ্ঞ') },
    { id: 'medicine', name: t('Medicine & Diabetes', 'মেডিসিন ও ডায়াবেটিস') },
    { id: 'gynecology', name: t('Gynecology & Women', 'স্ত্রী ও প্রসূতিরোগ') },
    { id: 'pediatrics', name: t('Pediatrics / Child Care', 'শিশু রোগ বিশেষজ্ঞ') },
    { id: 'cardiology', name: t('Cardiology & Heart', 'হৃদরোগ বিশেষজ্ঞ') },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedSpecialty === 'all') return true;
    if (selectedSpecialty === 'medicine') return doc.specialty.toLowerCase().includes('medicine');
    if (selectedSpecialty === 'gynecology') return doc.specialty.toLowerCase().includes('gynecology');
    if (selectedSpecialty === 'pediatrics') return doc.specialty.toLowerCase().includes('pediatric');
    if (selectedSpecialty === 'cardiology') return doc.specialty.toLowerCase().includes('cardio');
    return true;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor) return;

    const newApt = bookAppointment({
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      doctorSpecialty: bookingDoctor.specialty,
      patientName: patientName || user.name,
      patientAge: patientAge || '30',
      patientGender: patientGender || 'Male',
      phone: user.phone || '01712-345678',
      problem: problemDescription || 'General health consultation',
      date: selectedDate,
      slot: selectedSlot || bookingDoctor.slots[0],
      feeBDT: bookingDoctor.feeBDT,
      paymentMethod: paymentGateway,
    });

    setBookingDoctor(null);
    setProblemDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Banner */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-xs">
            <Video className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('Instant & Scheduled Telehealth', 'অনলাইন ডাক্তার ভিডিও কনসালটেশন')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            {t('Consult Top Bangladeshi Doctors via Video Call', 'বাংলাদেশের সেরা বিশেষজ্ঞ ডাক্তারের সাথে কথা বলুন ঘরে বসেই')}
          </h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
            {t(
              'Verified BMDC registered specialist doctors from BSMMU, DMCH, and Square Hospital. Instant digital prescription with 1-click medicine ordering.',
              'বিএমডিসি নিবন্ধিত অভিজ্ঞ বিশেষজ্ঞ চিকিৎসকের সাথে এইচডি ভিডিও ও অডিও কলে পরামর্শ নিন এবং ডিজিটাল প্রেসক্রিপশন পান।'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-emerald-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('100% BMDC Verified Doctors', '১০০% বিএমডিসি নিবন্ধিত ডাক্তার')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('Encrypted Video & Digital Rx', 'নিরাপদ ভিডিও ও ডিজিটাল প্রেসক্রিপশন')}</span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-teal-500/10 pointer-events-none"></div>
      </div>

      {/* Existing Appointments Banner */}
      {appointments.filter((a) => a.status === 'booked').length > 0 && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Video className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-blue-900">
                  {t('Upcoming Video Consultation Ready', 'আপনার আসন্ন ভিডিও কনসালটেশন শিডিউল')}
                </h4>
                <p className="text-xs text-blue-700">
                  {appointments[0].doctorName} • {appointments[0].date} at {appointments[0].slot}
                </p>
              </div>
            </div>

            <button
              onClick={() => startVideoCall(appointments[0])}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{t('Join Video Room Now', 'ভিডিও রুমে প্রবেশ করুন')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Specialties filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        {specialties.map((spec) => (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedSpecialty === spec.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {spec.name}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {doctor.bmdcReg}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 text-[10px]">({doctor.totalConsultations})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{doctor.name}</h3>
                  <div className="text-xs font-semibold text-emerald-600">{doctor.specialty}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{doctor.degrees}</div>
                </div>
              </div>

              {/* Hospital affiliation */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Hospital className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{t('Experience:', 'অভিজ্ঞতা:')} {doctor.experienceYears}+ Years</span>
                  <span>{t('Available:', 'পরামর্শের সময়:')} {doctor.availableDays.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Fee */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{t('Consultation Fee', 'ভিজিট ফি')}</span>
                <span className="text-lg font-black text-slate-900">৳{doctor.feeBDT}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBookingDoctor(doctor);
                    setSelectedSlot(doctor.slots[0]);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{t('Book Video Serial', 'ভিডিও সিরিয়াল নিন')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t('Book Doctor Consultation', 'ডাক্তারের সিরিয়াল বুকিং')}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold">{bookingDoctor.name}</p>
              </div>
              <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                ৳{bookingDoctor.feeBDT}
              </span>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {t('Patient Name', 'রোগীর নাম')}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {t('Patient Age & Gender', 'বয়স ও লিঙ্গ')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age"
                      className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Select Consultation Date', 'পরামর্শের তারিখ')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedDate === d
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Select Time Slot', 'সময় নির্বাচন করুন')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {bookingDoctor.slots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedSlot === slot
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Describe Main Symptoms / Problem', 'সমস্যা বা প্রধান লক্ষণগুলো সংক্ষেপে লিখুন')}
                </label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={t('e.g. Fever for 3 days, body ache, sore throat...', 'যেমন: ৩ দিন ধরে জ্বর, কাশি ও বুক জ্বালাপোড়া...')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('Pay Consultation Fee via', 'ভিজিট ফি পরিশোধের মাধ্যম')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentGateway(method)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        paymentGateway === method
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                >
                  {t(`Pay ৳${bookingDoctor.feeBDT} & Confirm Booking`, `৳${bookingDoctor.feeBDT} প্রদান করে নিশ্চিত করুন`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
