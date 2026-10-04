import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Volume2,
  Search,
  CheckCircle,
  ArrowRight,
  Globe,
  Radio,
} from 'lucide-react';
import { normalizeBanglaVoiceSearch, BANGLA_MEDICINE_DICTIONARY } from '../utils/banglaVoiceSearch';

export const VoiceSearchModal: React.FC = () => {
  const {
    isVoiceSearchOpen,
    setIsVoiceSearchOpen,
    setSearchQuery,
    setActiveTab,
    t,
    addToast,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchedMedicine, setMatchedMedicine] = useState('');
  const [voiceLang, setVoiceLang] = useState<'bn-BD' | 'en-US'>('bn-BD'); // Default to Bangla!
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isVoiceSearchOpen) {
      stopListening();
      setTranscript('');
      setMatchedMedicine('');
      setErrorMessage('');
      return;
    }

    // Auto-start listening in Bengali
    startListening(voiceLang);
  }, [isVoiceSearchOpen, voiceLang]);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = (lang: 'bn-BD' | 'en-US') => {
    stopListening();
    setErrorMessage('');
    setTranscript('');
    setMatchedMedicine('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        t(
          'Web Speech Recognition is not supported in this browser. Please tap any medicine keyword below.',
          'আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট করছে না। নিচের ঔষধের নামে ট্যাপ করুন।'
        )
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang; // 'bn-BD' for pure Bengali speech capture!
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);

        // Intelligently normalize Bangla to medicine
        const normalized = normalizeBanglaVoiceSearch(text);
        if (normalized.matchedMedicineName) {
          setMatchedMedicine(normalized.matchedMedicineName);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage(
            t(
              'Microphone access was denied. Please allow microphone permission in browser.',
              'মাইক্রোফোনের অনুমতি প্রদান করা হয়নি। ব্রাউজার সেটিংসে গিয়ে পারমিশন অন করুন।'
            )
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage(
            t('No voice detected. Tap microphone and speak clearly.', 'কোনো ভয়েস পাওয়া যায়নি। মাইক্রোফোনে ট্যাপ করে স্পষ্ট করে বলুন।')
          );
        } else {
          setErrorMessage(
            t('Voice capture error. Try speaking again or pick an example.', 'ভয়েস ধারণে সমস্যা হয়েছে। আবার চেষ্টা করুন।')
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition exception:', err);
      setIsListening(false);
      setErrorMessage(
        t('Microphone could not start. Please select a medicine below.', 'মাইক্রোফোন চালু করা যায়নি। নিচে থেকে ঔষধ সিলেক্ট করুন।')
      );
    }
  };

  const handleApply = (searchTerm: string) => {
    // If we have a matched clean medicine name, prefer that
    const query = matchedMedicine || searchTerm;
    setSearchQuery(query);
    setIsVoiceSearchOpen(false);
    setActiveTab('shop');
    addToast(
      `Filtered catalog for: "${query}"`,
      `"${query}" এর জন্য ঔষধ তালিকা ফিল্টার করা হয়েছে`,
      'info'
    );
  };

  if (!isVoiceSearchOpen) return null;

  // Bengali common medicine voice shortcuts
  const sampleBanglaKeywords = [
    { bn: 'নাপা এক্সট্রা', en: 'Napa Extra' },
    { bn: 'সেক্লো ২০', en: 'Seclo 20mg' },
    { bn: 'সার্জেল ২০', en: 'Sergel 20mg' },
    { bn: 'মোনাস ১০', en: 'Monas 10mg' },
    { bn: 'ফেক্সো ১২০', en: 'Fexo 120mg' },
    { bn: 'সিভিট ২৫০', en: 'Ceevit 250mg' },
    { bn: 'গ্লুকোফাস্ট', en: 'Glucofast' },
    { bn: 'আকুচেক গ্লুকোমিটার', en: 'Accu-Chek' },
    { bn: 'ওমরন প্রেসার মেশিন', en: 'Omron' },
    { bn: 'গ্যাস্ট্রিকের ঔষধ', en: 'Seclo' },
    { bn: 'জ্বরের ঔষধ', en: 'Napa' },
    { bn: 'কাশির সিরাপ', en: 'Tofen' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            stopListening();
            setIsVoiceSearchOpen(false);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Language Mode Toggle Badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{voiceLang === 'bn-BD' ? '🇧🇩 বাংলা ভয়েস সক্রিয়' : '🇬🇧 English Voice'}</span>
            </span>

            <button
              onClick={() => {
                const nextLang = voiceLang === 'bn-BD' ? 'en-US' : 'bn-BD';
                setVoiceLang(nextLang);
              }}
              className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-full border border-slate-200 transition cursor-pointer"
            >
              {voiceLang === 'bn-BD' ? '🇬🇧 Switch to English' : '🇧🇩 বাংলায় বলুন'}
            </button>
          </div>

          <h3 className="text-xl font-black text-slate-900 mb-1">
            {voiceLang === 'bn-BD'
              ? 'বাংলায় ঔষধের নাম বলুন'
              : 'Speak Medicine Name'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            {voiceLang === 'bn-BD'
              ? 'স্পষ্ট করে বলুন: "নাপা এক্সট্রা", "সেক্লো ২০", "গ্যাস্ট্রিকের ঔষধ", "মোনাস"'
              : 'Say "Napa Extra", "Seclo 20", "Gastric medicine", "Glucofast"'}
          </p>

          {/* Animated Microphone Circle */}
          <div className="relative flex items-center justify-center my-6">
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-emerald-400/20 animate-ping"></div>
                <div className="absolute w-36 h-36 rounded-full bg-teal-400/15 animate-pulse"></div>
              </>
            )}

            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening(voiceLang);
                }
              }}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white shadow-rose-500/30 ring-4 ring-rose-200'
                  : 'bg-emerald-600 text-white shadow-emerald-600/30'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Transcript / Result Box */}
          <div className="min-h-16 flex flex-col items-center justify-center mb-5">
            {isListening ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-sm">
                  <span className="flex gap-1 items-end h-4">
                    <span className="w-1 bg-emerald-500 h-3 animate-pulse"></span>
                    <span className="w-1 bg-emerald-600 h-4 animate-bounce"></span>
                    <span className="w-1 bg-emerald-400 h-2 animate-pulse"></span>
                  </span>
                  <span>
                    {transcript
                      ? `"${transcript}"`
                      : 'শুনছি... এখন বাংলায় নাম বলুন'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  (কথা বলা শেষ হলে স্বয়ংক্রিয়ভাবে শনাক্ত হবে)
                </span>
              </div>
            ) : transcript ? (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 w-full text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <span>{t('Voice Recognized:', 'ভয়েসে যা শোনা গেছে:')}</span>
                  <strong className="text-slate-800">"{transcript}"</strong>
                </div>

                {matchedMedicine && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 py-1 px-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>শনাক্তকৃত ঔষধ: {matchedMedicine}</span>
                  </div>
                )}
              </div>
            ) : errorMessage ? (
              <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 w-full">
                {errorMessage}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">
                {t('Tap the green microphone icon to speak', 'কথা বলতে সবুজ মাইক আইকনে চাপ দিন')}
              </div>
            )}
          </div>

          {/* Search Trigger Button */}
          {transcript && (
            <button
              onClick={() => handleApply(matchedMedicine || transcript)}
              className="w-full py-3 mb-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>
                "{matchedMedicine || transcript}" {t('Search in Catalog', 'দিয়ে খুঁজুন')}
              </span>
            </button>
          )}

          {/* Quick Bengali Medicine Chips */}
          <div className="border-t border-slate-100 pt-4 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              {t('Or Tap Popular Bangla Medicine Names:', 'অথবা সরাসরি বাংলায় ট্যাপ করুন:')}
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {sampleBanglaKeywords.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(item.bn);
                    setMatchedMedicine(item.en);
                    handleApply(item.en);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{item.bn}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({item.en})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
