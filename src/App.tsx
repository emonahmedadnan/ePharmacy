/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MedicineCatalog } from './components/MedicineCatalog';
import { DeliveryTracker } from './components/DeliveryTracker';
import { DoctorDirectory } from './components/DoctorDirectory';
import { DoctorDashboard } from './components/DoctorDashboard';
import { HiddenAdminPanel } from './components/HiddenAdminPanel';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { CartDrawer } from './components/CartDrawer';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { MedicationReminderModal } from './components/MedicationReminderModal';
import { AiDoctorChatbot } from './components/AiDoctorChatbot';
import { VideoConsultationRoom } from './components/VideoConsultationRoom';
import { ToastContainer } from './components/ToastContainer';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ShieldCheck, Lock } from 'lucide-react';

function MainApp() {
  const {
    activeTab,
    setActiveTab,
    activeCallAppointment,
    isProfileModalOpen,
    setIsProfileModalOpen,
    profileInitialTab,
    isAdminUnlocked,
    unlockAdmin,
    lockAdmin,
    setIsAdminLoginModalOpen,
  } = useApp();

  // Global hotkey: Ctrl + Shift + A (or Cmd + Shift + A) to trigger Admin Login Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminLoginModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminLoginModalOpen]);

  // Hidden URL routing detection for secure Admin access (e.g. /admin, #admin, ?admin)
  useEffect(() => {
    const handleSecretAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (
        path.includes('admin') ||
        hash.includes('admin') ||
        search.includes('admin') ||
        path.includes('secret-admin') ||
        hash.includes('secret-admin')
      ) {
        unlockAdmin('admin123');
        setActiveTab('admin_panel');
      }
    };

    handleSecretAdminRoute();
    window.addEventListener('hashchange', handleSecretAdminRoute);
    window.addEventListener('popstate', handleSecretAdminRoute);

    return () => {
      window.removeEventListener('hashchange', handleSecretAdminRoute);
      window.removeEventListener('popstate', handleSecretAdminRoute);
    };
  }, [unlockAdmin, setActiveTab]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <div>
        <Header />

        <main className="pb-12">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'shop' && <MedicineCatalog />}
          {activeTab === 'prescriptions' && <MedicineCatalog />}
          {activeTab === 'subscriptions' && <SubscriptionPlansModal />}
          {activeTab === 'doctors' && <DoctorDirectory />}
          {activeTab === 'tracking' && <DeliveryTracker />}
          {activeTab === 'doctor_portal' && <DoctorDashboard />}
          {activeTab === 'admin_panel' && <HiddenAdminPanel />}
        </main>
      </div>

      <Footer />

      {/* Overlays & Modals */}
      <CartDrawer />
      <VoiceSearchModal />
      <PrescriptionUploadModal />
      <MedicationReminderModal />
      <AiDoctorChatbot />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} initialTab={profileInitialTab} />
      <AdminLoginModal />
      <ToastContainer />

      {/* Floating Owner Admin Quick Control Bar when unlocked */}
      {isAdminUnlocked && activeTab !== 'admin_panel' && (
        <div className="fixed bottom-5 right-5 z-40 bg-slate-900/95 text-white p-2.5 px-4 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold font-mono text-purple-300">Admin Mode Active</span>
          </div>
          <button
            onClick={() => {
              setActiveTab('admin_panel');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span>Open Admin Hub</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={lockAdmin}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer text-xs"
            title="Lock Admin Mode"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active WebRTC Video Room */}
      {activeCallAppointment && <VideoConsultationRoom />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
