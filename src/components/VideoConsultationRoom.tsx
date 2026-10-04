import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Share2,
  ShieldCheck,
  Send,
  Plus,
  ShoppingCart,
  User,
  CheckCircle,
  Clock,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { DigitalRx } from '../types';

export const VideoConsultationRoom: React.FC = () => {
  const {
    activeCallAppointment,
    endVideoCall,
    saveDigitalRx,
    addToCart,
    medicines,
    setIsCartDrawerOpen,
    user,
    addToast,
    t,
  } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [activeSidePanel, setActiveSidePanel] = useState<'chat' | 'prescription' | null>('prescription');

  // In-call chat
  const [chatMessages, setChatMessages] = useState<
    { sender: 'doctor' | 'patient'; text: string; time: string }[]
  >([
    {
      sender: 'doctor',
      text: 'আসসালামু আলাইকুম। আমি আপনার লক্ষণগুলো দেখতে পাচ্ছি। আপনি কি স্পষ্টভাবে শুনতে পাচ্ছেন?',
      time: 'Just now',
    },
  ]);
  const [inputChatText, setInputChatText] = useState('');

  // Live Digital Rx Builder
  const [prescribedList, setPrescribedList] = useState<
    { brandName: string; generic: string; dosage: string; timing: string; duration: string }[]
  >([
    {
      brandName: 'Napa Extra',
      generic: 'Paracetamol 500mg + Caffeine 65mg',
      dosage: '1+0+1',
      timing: 'After meal',
      duration: '5 days',
    },
    {
      brandName: 'Seclo 20mg',
      generic: 'Omeprazole',
      dosage: '1+0+0',
      timing: '30 mins before breakfast',
      duration: '14 days',
    },
  ]);
  const [doctorAdvice, setDoctorAdvice] = useState('Drink plenty of boiled warm water. Rest for 2 days.');
  const [newMedName, setNewMedName] = useState('Monas 10mg');
  const [newMedDose, setNewMedDose] = useState('0+0+1 (At bedtime)');

  // Local camera stream reference
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState(false);

  // Initialize camera and mic
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Could not access real webcam/mic:', err);
        setStreamError(true);
      }
    }

    setupCamera();

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChatText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      {
        sender: user.role === 'doctor' ? 'doctor' : 'patient',
        text: inputChatText,
        time,
      },
    ]);
    setInputChatText('');

    // Simulate doctor reply if patient typed
    if (user.role !== 'doctor') {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'doctor',
            text: 'I noted this symptom. I am updating your digital prescription right now.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1500);
    }
  };

  const handleAddMedToRx = () => {
    if (!newMedName) return;
    setPrescribedList((prev) => [
      ...prev,
      {
        brandName: newMedName,
        generic: 'Generic as specified',
        dosage: newMedDose,
        timing: 'As directed',
        duration: '7 days',
      },
    ]);
    addToast(`Added ${newMedName} to prescription pad`, `${newMedName} প্রেসক্রিপশনে যুক্ত হয়েছে`, 'info');
  };

  const handleSaveRx = () => {
    if (!activeCallAppointment) return;
    const digitalRx: DigitalRx = {
      id: `rx-${Date.now()}`,
      appointmentId: activeCallAppointment.id,
      doctorName: activeCallAppointment.doctorName,
      bmdcReg: 'BMDC-A-24819',
      degrees: 'MBBS, FCPS, MD',
      patientName: activeCallAppointment.patientName,
      patientAge: activeCallAppointment.patientAge,
      date: new Date().toLocaleDateString(),
      diagnosis: 'Acute upper respiratory tract irritation & dyspepsia',
      medicines: prescribedList,
      advice: doctorAdvice,
      nextFollowUp: 'After 7 days',
    };
    saveDigitalRx(activeCallAppointment.id, digitalRx);
  };

  const handleOrderPrescribedNow = () => {
    handleSaveRx();
    let added = 0;
    prescribedList.forEach((rxMed) => {
      const match = medicines.find((m) =>
        m.name.toLowerCase().includes(rxMed.brandName.toLowerCase())
      );
      if (match) {
        addToCart(match, 1, 'strip');
        added++;
      }
    });

    setIsCartDrawerOpen(true);
    addToast(
      `Added ${added} prescribed medicines to cart!`,
      `প্রেসক্রিপশনের ${added}টি ঔষধ কার্টে যুক্ত করা হয়েছে`,
      'success'
    );
  };

  if (!activeCallAppointment) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <span>{activeCallAppointment.doctorName}</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                BMDC-A-24819
              </span>
            </h3>
            <div className="text-xs text-slate-400">
              {t('Patient:', 'রোগী:')} {activeCallAppointment.patientName} ({activeCallAppointment.patientAge} Yrs, {activeCallAppointment.patientGender})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('256-bit Encrypted Consultation Room', 'নিরাপদ এনক্রিপ্টেড ভিডিও কনসালটেশন')}</span>
          </div>
        </div>
      </div>

      {/* Main Video & Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Video Streams */}
        <div className="flex-1 bg-slate-900 relative p-4 flex flex-col justify-center items-center">
          {/* Main Stage (Doctor View) */}
          <div className="w-full h-full max-h-[75vh] rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 relative flex items-center justify-center shadow-2xl">
            {/* Simulated high-quality Doctor Video Feed */}
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1000&auto=format&fit=crop&q=80"
              alt="Doctor stream"
              className="w-full h-full object-cover"
            />

            {/* Doctor Label Badge */}
            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{activeCallAppointment.doctorName}</span>
              <span className="text-[10px] text-slate-400">| HD 1080p</span>
            </div>

            {/* Picture-in-Picture: Patient's Video Feed (Webcam Stream) */}
            <div className="absolute top-4 right-4 w-40 sm:w-56 aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-600 shadow-2xl z-20">
              {streamError || !isVideoOn ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
                  <User className="w-8 h-8 mb-1 text-slate-500" />
                  <span>{activeCallAppointment.patientName}</span>
                  <span className="text-[10px] text-slate-500">{isVideoOn ? 'Camera Offline' : 'Video Muted'}</span>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-bold">
                You ({activeCallAppointment.patientName})
              </div>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={toggleMic}
              className={`p-3.5 rounded-2xl transition cursor-pointer ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-2xl transition cursor-pointer ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isVideoOn ? 'Stop Camera' : 'Start Camera'}
            >
              {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'chat' ? null : 'chat')}
              className={`p-3.5 rounded-2xl transition cursor-pointer ${
                activeSidePanel === 'chat' ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Live Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveSidePanel(activeSidePanel === 'prescription' ? null : 'prescription')}
              className={`p-3.5 rounded-2xl transition cursor-pointer ${
                activeSidePanel === 'prescription' ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title="Digital Prescription"
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              onClick={endVideoCall}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>{t('End Consultation', 'কল সমাপ্ত করুন')}</span>
            </button>
          </div>
        </div>

        {/* Right Side Panel: Chat or Digital Prescription */}
        {activeSidePanel && (
          <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20">
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveSidePanel('prescription')}
                className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'prescription'
                    ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{t('Digital Rx Pad', 'ডিজিটাল প্রেসক্রিপশন')}</span>
              </button>

              <button
                onClick={() => setActiveSidePanel('chat')}
                className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeSidePanel === 'chat'
                    ? 'border-b-2 border-emerald-500 text-emerald-400 bg-slate-800/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('Live Chat', 'লাইভ চ্যাট')}</span>
              </button>
            </div>

            {/* Prescription Pad Tab */}
            {activeSidePanel === 'prescription' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      {t('Clinical Diagnosis', 'রোগ নির্ণয়')}
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-0.5">
                      Acute Upper Respiratory Irritation, Fever & Acidity
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <span>{t('Prescribed Medicines (Rx)', 'নির্দেশিত ঔষধসমূহ')}</span>
                    </div>

                    {prescribedList.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-0.5"
                      >
                        <div className="font-extrabold text-white flex justify-between">
                          <span>{item.brandName}</span>
                          <span className="text-emerald-400 font-mono text-[11px]">{item.dosage}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.timing} • {item.duration}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add more medicine (Doctor simulation) */}
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-2">
                    <span className="text-[11px] text-slate-400 font-semibold block">
                      {t('Add Medicine to Prescription:', 'প্রেসক্রিপশনে ঔষধ যোগ করুন:')}
                    </span>
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="Medicine Name"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMedDose}
                        onChange={(e) => setNewMedDose(e.target.value)}
                        placeholder="Dosage (1+0+1)"
                        className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs outline-none"
                      />
                      <button
                        onClick={handleAddMedToRx}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Doctor Advice */}
                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      {t('Doctor Advice', 'চিকিৎসকের পরামর্শ')}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{doctorAdvice}</p>
                  </div>
                </div>

                {/* Instant Order Prescription CTA */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleOrderPrescribedNow}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t('Order These Medicines Now (2-Hr Delivery)', 'প্রেসক্রিপশনের ঔষধ এখনই অর্ডার করুন (২ ঘণ্টায় ডেলিভারি)')}</span>
                  </button>
                  <button
                    onClick={handleSaveRx}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                  >
                    {t('Save Digital Rx to Patient Profile', 'প্রেসক্রিপশন প্রোফাইলে সেভ করুন')}
                  </button>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === (user.role === 'doctor' ? 'doctor' : 'patient')
                          ? 'items-end'
                          : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          msg.sender === (user.role === 'doctor' ? 'doctor' : 'patient')
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={inputChatText}
                    onChange={(e) => setInputChatText(e.target.value)}
                    placeholder={t('Type symptom or question...', 'মেসেজ বা লক্ষণ লিখুন...')}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
