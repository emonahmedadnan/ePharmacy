import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ShieldAlert,
  Video,
  ArrowRight,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

export const AiDoctorChatbot: React.FC = () => {
  const { isAiChatOpen, setIsAiChatOpen, setActiveTab, t } = useApp();

  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; time: string }[]
  >([
    {
      role: 'assistant',
      content:
        'আসসালামু আলাইকুম! আমি **eDoc AI** (ই-ডক স্বাস্থ্য সহায়ক)। আপনার বর্তমান শারীরিক লক্ষণ, রোগ বা যে কোনো ঔষধের ব্যাপারে জানতে আমাকে জিজ্ঞেস করুন।',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: '🌡️ জ্বর ও শরীর ব্যথা', text: 'আমার ২ দিন ধরে ১০১ ডিগ্রি জ্বর ও শরীর ব্যথা। করণীয় কী?' },
    { label: '🔥 গ্যাস্ট্রিক ও বুকজ্বালা', text: 'খাওয়ার পর তীব্র বুকজ্বালা ও এসিডিটি হচ্ছে। কোন ঔষধ ভালো হবে?' },
    { label: '🩸 ডায়াবেটিসের ঔষধ', text: 'গ্লুকোফাস্ট ও ডায়াবেটিসের সাধারণ ঔষধের সেবনবিধি কী?' },
    { label: '👶 বাচ্চার সর্দি-কাশি', text: 'শিশুদের সাধারণ সর্দি-কাশির প্রাথমিক যত্ন কীভাবে নিব?' },
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistory = [...messages, { role: 'user' as const, content: textToSend, time }];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Please consult our specialist doctor via video call for exact diagnosis.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.warn('Chat request failed, providing fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'প্রাথমিক পরামর্শ: প্রচুর পানি ও স্যালাইন খান। লক্ষণ তীব্র হলে বা ৩ দিনের বেশি স্থায়ী হলে অবিলম্বে আমাদের ভিডিও কলে স্পেশালিস্ট ডাক্তারের পরামর্শ নিন।',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isAiChatOpen && (
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-4 rounded-full shadow-2xl shadow-emerald-600/40 flex items-center gap-2 group transition-transform hover:scale-105 cursor-pointer ring-4 ring-emerald-100"
          title="Ask eDoc AI Health Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-extrabold text-xs">
            {t('Ask eDoc AI', 'স্বাস্থ্য সহায়ক AI')}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
        </button>
      )}

      {/* Chat Window */}
      {isAiChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-200 ring-2 ring-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>eDoc AI Assistant</span>
                  <span className="text-[10px] bg-emerald-500/40 text-emerald-100 px-1.5 py-0.5 rounded font-medium">
                    Gemini 3.8
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t('Instant Symptom Screening & OTC Guide', 'লক্ষণ যাচাই ও ঔষধ পরামর্শ')}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiChatOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Doctor Link Banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-[11px] text-blue-900 font-medium">
            <span>{t('Need exact doctor advice?', 'ডাক্তারের সাথে সরাসরি কথা বলতে চান?')}</span>
            <button
              onClick={() => {
                setIsAiChatOpen(false);
                setActiveTab('doctors');
              }}
              className="font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5"
            >
              <span>{t('Video Call Doctor', 'ভিডিও কল করুন')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1`}>
                  <div
                    className={`rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 block px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>{t('eDoc AI is analyzing symptoms...', 'লক্ষণ যাচাই করা হচ্ছে...')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full text-[11px] font-medium transition cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('Type symptom or medicine name...', 'লক্ষণ বা ঔষধের নাম লিখুন...')}
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-2.5 rounded-2xl transition cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
