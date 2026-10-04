import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Medicine,
  CartItem,
  Order,
  Doctor,
  Appointment,
  DigitalRx,
  PillReminder,
  SubscriptionPlan,
  UserProfile,
  Language,
} from '../types';
import {
  INITIAL_MEDICINES,
  INITIAL_DOCTORS,
  SUBSCRIPTION_PLANS,
  INITIAL_PILL_REMINDERS,
  INITIAL_SAMPLE_ORDER,
  INITIAL_SAMPLE_ORDERS,
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const sanitizeMedicine = (raw: any): Medicine => {
  const fallback = INITIAL_MEDICINES.find((im) => im.id === raw?.id) || INITIAL_MEDICINES[0];
  return {
    id: String(raw?.id || fallback.id),
    name: String(raw?.name || fallback.name || 'Medicine'),
    nameBn: raw?.nameBn ? String(raw.nameBn) : fallback.nameBn,
    generic: String(raw?.generic || fallback.generic || ''),
    genericBn: raw?.genericBn ? String(raw.genericBn) : fallback.genericBn,
    strength: String(raw?.strength || fallback.strength || ''),
    category: (raw?.category || fallback.category || 'fever_pain') as Medicine['category'],
    manufacturer: String(raw?.manufacturer || fallback.manufacturer || 'Square Pharmaceuticals Ltd.'),
    pricePerUnit: typeof raw?.pricePerUnit === 'number' && !isNaN(raw.pricePerUnit) ? raw.pricePerUnit : fallback.pricePerUnit,
    pricePerBox: typeof raw?.pricePerBox === 'number' && !isNaN(raw.pricePerBox) ? raw.pricePerBox : fallback.pricePerBox,
    unitType: (raw?.unitType || fallback.unitType || 'Strip') as Medicine['unitType'],
    unitsPerBox: typeof raw?.unitsPerBox === 'number' && !isNaN(raw.unitsPerBox) ? raw.unitsPerBox : fallback.unitsPerBox,
    stockCount: typeof raw?.stockCount === 'number' && !isNaN(raw.stockCount) ? raw.stockCount : 100,
    isRxRequired: Boolean(raw?.isRxRequired),
    description: String(raw?.description || fallback.description || ''),
    descriptionBn: String(raw?.descriptionBn || fallback.descriptionBn || ''),
    dosageAdvice: String(raw?.dosageAdvice || fallback.dosageAdvice || ''),
    sideEffects: String(raw?.sideEffects || fallback.sideEffects || ''),
    image: String(raw?.image || fallback.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'),
    rating: typeof raw?.rating === 'number' && !isNaN(raw.rating) ? raw.rating : 4.8,
    salesCount: typeof raw?.salesCount === 'number' && !isNaN(raw.salesCount) ? raw.salesCount : 500,
    inStock: typeof raw?.inStock === 'boolean' ? raw.inStock : ((raw?.stockCount ?? 100) > 0),
    discountPercentage: typeof raw?.discountPercentage === 'number' ? raw.discountPercentage : 0,
    searchKeywords: Array.isArray(raw?.searchKeywords) ? raw.searchKeywords : (fallback.searchKeywords || []),
  };
};

const cleanForFirestore = <T extends object>(obj: T): Record<string, any> => {
  return JSON.parse(JSON.stringify(obj));
};

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  messageBn: string;
}

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, bn: string) => string;

  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: 'customer' | 'doctor' | 'admin') => void;

  medicines: Medicine[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  updateMedicineStock: (id: string, newCount: number) => void;
  updateMedicinePrice: (id: string, newPrice: number) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  deleteMedicine: (id: string) => void;

  cart: CartItem[];
  addToCart: (medicine: Medicine, quantity?: number, unitChoice?: 'strip' | 'box') => void;
  removeFromCart: (medicineId: string, unitChoice: 'strip' | 'box') => void;
  updateCartQuantity: (medicineId: string, unitChoice: 'strip' | 'box', quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (orderPayload: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], riderDetails?: Partial<Order>) => void;

  doctors: Doctor[];
  appointments: Appointment[];
  bookAppointment: (payload: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  activeCallAppointment: Appointment | null;
  startVideoCall: (appointment: Appointment) => void;
  endVideoCall: () => void;
  saveDigitalRx: (appointmentId: string, rx: DigitalRx) => void;

  pillReminders: PillReminder[];
  addPillReminder: (reminder: Omit<PillReminder, 'id' | 'streakDays'>) => void;
  togglePillReminder: (id: string) => void;
  markPillTaken: (id: string) => void;
  deletePillReminder: (id: string) => void;

  subscriptionPlans: SubscriptionPlan[];
  activeSubscription: SubscriptionPlan | null;
  subscribeToPlan: (planId: string) => void;
  cancelSubscription: () => void;

  // Navigation & Modals
  activeTab: 'home' | 'shop' | 'prescriptions' | 'subscriptions' | 'doctors' | 'tracking' | 'doctor_portal' | 'admin_panel';
  setActiveTab: (tab: 'home' | 'shop' | 'prescriptions' | 'subscriptions' | 'doctors' | 'tracking' | 'doctor_portal' | 'admin_panel') => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  isPrescriptionModalOpen: boolean;
  setIsPrescriptionModalOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  isPillReminderModalOpen: boolean;
  setIsPillReminderModalOpen: (open: boolean) => void;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileInitialTab: 'profile' | 'addresses' | 'wallet' | 'orders';
  setProfileInitialTab: (tab: 'profile' | 'addresses' | 'wallet' | 'orders') => void;
  openProfileTab: (tab?: 'profile' | 'addresses' | 'wallet' | 'orders') => void;
  isAdminUnlocked: boolean;
  unlockAdmin: (pin: string, notify?: boolean) => boolean;
  lockAdmin: () => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;

  toasts: Toast[];
  addToast: (message: string, messageBn: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language toggle
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('epharmacy_lang') as Language) || 'bn';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('epharmacy_lang', next);
      return next;
    });
  };

  const t = (en: string, bn: string) => (language === 'bn' ? bn : en);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('epharmacy_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          walletBalance: parsed.walletBalance ?? 250,
          addresses: parsed.addresses ?? [
            {
              id: 'addr-1',
              label: 'Home (প্রধান ঠিকানা)',
              address: parsed.address || 'House # 42, Road # 11, Dhanmondi',
              district: parsed.district || 'Dhaka',
              phone: parsed.phone || '01712-345678',
              isDefault: true,
            },
          ],
          walletHistory: parsed.walletHistory ?? [
            {
              id: 'txn-init-1',
              type: 'credit',
              amount: 250,
              description: 'Initial Wallet Balance',
              date: new Date().toLocaleDateString(),
            },
          ],
          isLoggedIn: parsed.isLoggedIn ?? false,
        };
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'usr-1',
      name: 'Guest Patient',
      phone: '017XXXXXXXX',
      email: 'patient@epharmacy.bd',
      address: 'Dhanmondi, Dhaka',
      district: 'Dhaka',
      loyaltyPoints: 0,
      walletBalance: 0,
      addresses: [],
      walletHistory: [],
      activeSubscriptionId: undefined,
      role: 'customer',
      isLoggedIn: false, // Initial visitor is not logged in so Login/Register shows!
    };
  });

  useEffect(() => {
    localStorage.setItem('epharmacy_user', JSON.stringify(user));
  }, [user]);

  const switchRole = (role: 'customer' | 'doctor' | 'admin') => {
    setUser((prev) => ({ ...prev, role }));
    if (role === 'doctor') {
      setActiveTab('doctor_portal');
      addToast('Switched to Doctor Portal (Dr. Shahriar Kabir)', 'ডাক্তার পোর্টালে স্যুইচ করা হয়েছে', 'info');
    } else if (role === 'admin') {
      setIsAdminUnlocked(true);
      setActiveTab('admin_panel');
      addToast('Admin Management Console Opened', 'অ্যাডমিন কন্ট্রোল প্যানেল খোলা হয়েছে', 'info');
    } else {
      setActiveTab('shop');
      addToast('Switched to Patient / Customer Mode', 'পেশেন্ট মোডে ফিরে এসেছেন', 'info');
    }
  };

  // Medicine Inventory
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('epharmacy_medicines');
    if (saved) {
      try {
        const parsed: Medicine[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingInitial = INITIAL_MEDICINES.filter((im) => !existingIds.has(im.id));
        const merged = [...parsed, ...missingInitial];
        return merged.map((m) => {
          const init = INITIAL_MEDICINES.find((im) => im.id === m.id);
          return {
            ...m,
            nameBn: m.nameBn || init?.nameBn,
            genericBn: m.genericBn || init?.genericBn,
            searchKeywords: m.searchKeywords || init?.searchKeywords,
            salesCount: m.salesCount ?? init?.salesCount ?? 1200,
          };
        });
      } catch (e) {}
    }
    return INITIAL_MEDICINES;
  });

  useEffect(() => {
    localStorage.setItem('epharmacy_medicines', JSON.stringify(medicines));
  }, [medicines]);

  // Sync medicines with Firebase Firestore cloud database
  useEffect(() => {
    let isSubscribed = true;
    async function loadCloudMedicines() {
      try {
        const querySnapshot = await getDocs(collection(db, 'medicines'));
        if (!querySnapshot.empty) {
          const cloudMeds: Medicine[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.name) {
              cloudMeds.push(sanitizeMedicine(data));
            }
          });
          if (isSubscribed && cloudMeds.length > 0) {
            setMedicines(cloudMeds);
          }
        } else {
          // Initial population of Firestore with top essential medicines
          INITIAL_MEDICINES.slice(0, 30).forEach((med) => {
            const cleaned = cleanForFirestore(sanitizeMedicine(med));
            setDoc(doc(db, 'medicines', med.id), cleaned).catch(() => {});
          });
        }
      } catch (err) {
        console.warn('Firebase Firestore read notice:', err);
      }
    }
    loadCloudMedicines();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const updateMedicineStock = (id: string, newCount: number) => {
    const finalCount = Math.max(0, newCount);
    setMedicines((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, stockCount: finalCount, inStock: finalCount > 0 } : med
      )
    );
    // Persist to Firebase Firestore
    updateDoc(doc(db, 'medicines', id), {
      stockCount: finalCount,
      inStock: finalCount > 0,
    }).catch(() => {});
    addToast('Medicine stock updated successfully', 'ঔষধের স্টক সফলভাবে আপডেট হয়েছে', 'success');
  };

  const updateMedicinePrice = (id: string, newPrice: number) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, pricePerUnit: newPrice } : med))
    );
    // Persist to Firebase Firestore
    updateDoc(doc(db, 'medicines', id), {
      pricePerUnit: newPrice,
    }).catch(() => {});
    addToast('Medicine unit price updated', 'ঔষধের খুচরা মূল্য হালনাগাদ করা হয়েছে', 'success');
  };

  const addMedicine = (newMed: Omit<Medicine, 'id'>) => {
    const fullMed: Medicine = sanitizeMedicine({
      ...newMed,
      id: `med-${Date.now()}`,
    });
    setMedicines((prev) => [fullMed, ...prev]);
    // Persist to Firebase Firestore
    setDoc(doc(db, 'medicines', fullMed.id), cleanForFirestore(fullMed)).catch(() => {});
    addToast('New medicine cataloged into inventory', 'নতুন ঔষধ ইনভেন্টরিতে যুক্ত করা হয়েছে', 'success');
  };

  const deleteMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((med) => med.id !== id));
    // Persist to Firebase Firestore
    deleteDoc(doc(db, 'medicines', id)).catch(() => {});
    addToast('Medicine removed from inventory', 'ঔষধটি ইনভেন্টরি থেকে মুছে ফেলা হয়েছে', 'info');
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('epharmacy_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('epharmacy_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (medicine: Medicine, quantity = 1, unitChoice: 'strip' | 'box' = 'strip') => {
    if (medicine.stockCount <= 0) {
      addToast('Sorry, this medicine is currently out of stock!', 'দুঃখিত, এই ঔষধটি বর্তমানে স্টকে নেই!', 'warning');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.medicine.id === medicine.id && item.unitChoice === unitChoice
      );

      const price =
        unitChoice === 'box' && medicine.pricePerBox
          ? medicine.pricePerBox
          : medicine.pricePerUnit;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * price,
        };
        return updated;
      }

      return [
        ...prev,
        {
          medicine,
          quantity,
          unitChoice,
          totalPrice: quantity * price,
        },
      ];
    });

    addToast(
      `Added ${quantity} ${unitChoice} of ${medicine.name} to cart`,
      `${medicine.name} কার্টে যোগ করা হয়েছে`,
      'success'
    );
  };

  const removeFromCart = (medicineId: string, unitChoice: 'strip' | 'box') => {
    setCart((prev) =>
      prev.filter((item) => !(item.medicine.id === medicineId && item.unitChoice === unitChoice))
    );
    addToast('Item removed from cart', 'কার্ট থেকে আইটেম সরানো হয়েছে', 'info');
  };

  const updateCartQuantity = (medicineId: string, unitChoice: 'strip' | 'box', quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId, unitChoice);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.medicine.id === medicineId && item.unitChoice === unitChoice) {
          const price =
            unitChoice === 'box' && item.medicine.pricePerBox
              ? item.medicine.pricePerBox
              : item.medicine.pricePerUnit;
          return {
            ...item,
            quantity,
            totalPrice: quantity * price,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders & Live Tracking
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('epharmacy_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => orders[0] || null);

  useEffect(() => {
    localStorage.setItem('epharmacy_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync orders with Firebase Firestore
  useEffect(() => {
    let isSubscribed = true;
    async function loadCloudOrders() {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        if (!querySnapshot.empty) {
          const cloudOrders: Order[] = [];
          querySnapshot.forEach((docSnap) => {
            cloudOrders.push(docSnap.data() as Order);
          });
          if (isSubscribed && cloudOrders.length > 0) {
            setOrders(cloudOrders);
          }
        }
      } catch (err) {
        console.warn('Orders Firestore read notice:', err);
      }
    }
    loadCloudOrders();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const placeOrder = (orderPayload: Partial<Order>): Order => {
    const orderNum = `EPH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: orderPayload.customerName || user.name,
      phone: orderPayload.phone || user.phone,
      address: orderPayload.address || user.address,
      district: orderPayload.district || user.district,
      deliveryType: orderPayload.deliveryType || 'express',
      paymentMethod: orderPayload.paymentMethod || 'bKash',
      paymentStatus: orderPayload.paymentMethod === 'COD' ? 'cod' : 'paid',
      transactionId:
        orderPayload.transactionId ||
        (orderPayload.paymentMethod !== 'COD' ? `TXN${Math.floor(100000 + Math.random() * 900000)}` : undefined),
      items: [...cart],
      subtotal: cartTotal,
      discount: orderPayload.discount || 0,
      pointsDiscount: orderPayload.pointsDiscount || 0,
      deliveryFee: orderPayload.deliveryType === 'express' ? 60 : 35,
      total: orderPayload.total || cartTotal,
      status: 'confirmed',
      riderName: 'Md. Kamrul Hasan',
      riderPhone: '01819-554433',
      riderBikeNo: 'Dhaka-Metro-La-1842',
      estimatedMinutes: orderPayload.deliveryType === 'express' ? 35 : 120,
      createdAt: new Date().toISOString(),
      prescriptionImage: orderPayload.prescriptionImage,
      prescriptionVerified: !cart.some((item) => item.medicine.isRxRequired),
    };

    // Deduct stock in real-time
    setMedicines((prevMeds) =>
      prevMeds.map((med) => {
        const cartItem = cart.find((c) => c.medicine.id === med.id);
        if (cartItem) {
          const qty = cartItem.unitChoice === 'box' && med.unitsPerBox ? cartItem.quantity * med.unitsPerBox : cartItem.quantity;
          const remaining = Math.max(0, med.stockCount - qty);
          return {
            ...med,
            stockCount: remaining,
            inStock: remaining > 0,
            salesCount: med.salesCount + cartItem.quantity,
          };
        }
        return med;
      })
    );

    // Reward Loyalty Health Points (2% cashback points)
    const earnedPoints = Math.floor(newOrder.total * 0.02);
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: Math.max(0, prev.loyaltyPoints - (orderPayload.pointsDiscount || 0)) + earnedPoints,
    }));

    // If paid via digital wallet, deduct wallet balance and add transaction
    if (newOrder.paymentMethod === 'Wallet') {
      setUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, (prev.walletBalance || 0) - newOrder.total),
        walletHistory: [
          {
            id: `txn-${Date.now()}`,
            type: 'debit',
            amount: newOrder.total,
            description: `Payment for Order #${orderNum}`,
            date: new Date().toLocaleDateString(),
            method: 'epharmacy Wallet',
          },
          ...(prev.walletHistory || []),
        ],
      }));
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    // Persist to Firebase Firestore
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(() => {});

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    addToast(
      `Order #${orderNum} placed! Earned 🌟 ${earnedPoints} Health Points`,
      `অর্ডার #${orderNum} সফল হয়েছে! আপনি পেয়েছেন 🌟 ${earnedPoints} হেলথ পয়েন্ট`,
      'success'
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], riderDetails?: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status, ...riderDetails } : ord))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status, ...riderDetails } : null));
    }
    // Persist status change to Firebase Firestore
    updateDoc(doc(db, 'orders', orderId), { status, ...(riderDetails || {}) }).catch(() => {});
    addToast(`Order status updated to: ${status}`, `অর্ডারের অগ্রগতি আপডেট করা হয়েছে: ${status}`, 'info');
  };

  // Doctors & Video Consultation
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('epharmacy_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'apt-1',
        doctorId: 'doc-1',
        doctorName: 'Prof. Dr. Shahriar Kabir',
        doctorSpecialty: 'General Medicine & Diabetology',
        patientName: 'Tanvir Ahmed',
        patientAge: '32',
        patientGender: 'Male',
        phone: '01712-345678',
        problem: 'Fever for 2 days, mild cough and gastric bloating',
        date: 'Today',
        slot: '07:30 PM',
        status: 'booked',
        feeBDT: 500,
        paymentMethod: 'bKash',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('epharmacy_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const [activeCallAppointment, setActiveCallAppointment] = useState<Appointment | null>(null);

  const bookAppointment = (payload: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const newApt: Appointment = {
      ...payload,
      id: `apt-${Date.now()}`,
      status: 'booked',
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);

    addToast(
      `Appointment booked with ${payload.doctorName}! SMS & Email notification sent.`,
      `${payload.doctorName}-এর সাথে অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে! এসএমএস পাঠানো হয়েছে।`,
      'success'
    );
    return newApt;
  };

  const startVideoCall = (appointment: Appointment) => {
    setActiveCallAppointment(appointment);
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointment.id ? { ...a, status: 'in_call' } : a))
    );
    addToast('Joining encrypted video consultation room...', 'ভিডিও কনসালটেশন রুমে প্রবেশ করছেন...', 'info');
  };

  const endVideoCall = () => {
    if (activeCallAppointment) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === activeCallAppointment.id ? { ...a, status: 'completed' } : a))
      );
    }
    setActiveCallAppointment(null);
    addToast('Video consultation ended successfully', 'ভিডিও পরামর্শ সম্পন্ন হয়েছে', 'info');
  };

  const saveDigitalRx = (appointmentId: string, rx: DigitalRx) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, prescriptionGenerated: rx } : a))
    );
    addToast('Digital Prescription issued and saved to patient record', 'ডিজিটাল প্রেসক্রিপশন তৈরি ও সংরক্ষিত হয়েছে', 'success');
  };

  // Pill Reminders
  const [pillReminders, setPillReminders] = useState<PillReminder[]>(() => {
    const saved = localStorage.getItem('epharmacy_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PILL_REMINDERS;
  });

  useEffect(() => {
    localStorage.setItem('epharmacy_reminders', JSON.stringify(pillReminders));
  }, [pillReminders]);

  const addPillReminder = (reminder: Omit<PillReminder, 'id' | 'streakDays'>) => {
    const newRem: PillReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      streakDays: 1,
    };
    setPillReminders((prev) => [newRem, ...prev]);
    addToast('Medication alarm reminder set!', 'ঔষধ খাওয়ার রিমাইন্ডার সেট করা হয়েছে!', 'success');
  };

  const togglePillReminder = (id: string) => {
    setPillReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const markPillTaken = (id: string) => {
    setPillReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              lastTaken: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              streakDays: r.streakDays + 1,
            }
          : r
      )
    );
    // Award 10 health points for adherence!
    setUser((prev) => ({ ...prev, loyaltyPoints: prev.loyaltyPoints + 10 }));
    addToast('Great job! Medication logged (+10 Health Points 🌟)', 'চমৎকার! ঔষধ গ্রহণ নিশ্চিত হয়েছে (+১০ পয়েন্ট 🌟)', 'success');
  };

  const deletePillReminder = (id: string) => {
    setPillReminders((prev) => prev.filter((r) => r.id !== id));
    addToast('Reminder removed', 'রিমাইন্ডার মুছে ফেলা হয়েছে', 'info');
  };

  // Subscriptions
  const [subscriptionPlans] = useState<SubscriptionPlan[]>(SUBSCRIPTION_PLANS);
  const activeSubscription =
    subscriptionPlans.find((p) => p.id === user.activeSubscriptionId) || null;

  const subscribeToPlan = (planId: string) => {
    setUser((prev) => ({ ...prev, activeSubscriptionId: planId }));
    const plan = subscriptionPlans.find((p) => p.id === planId);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    addToast(
      `Subscribed to ${plan?.name}! Enrolled in monthly discount & free delivery.`,
      `${plan?.nameBn} সাবস্ক্রিপশন সক্রিয় হয়েছে! বিশেষ ছাড় উপভোগ করুন।`,
      'success'
    );
  };

  const cancelSubscription = () => {
    setUser((prev) => ({ ...prev, activeSubscriptionId: undefined }));
    addToast('Monthly Care Subscription cancelled', 'সাবস্ক্রিপশন বাতিল করা হয়েছে', 'info');
  };

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<
    'home' | 'shop' | 'prescriptions' | 'subscriptions' | 'doctors' | 'tracking' | 'doctor_portal' | 'admin_panel'
  >('home');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isPillReminderModalOpen, setIsPillReminderModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'addresses' | 'wallet' | 'orders'>('profile');

  const openProfileTab = (tab: 'profile' | 'addresses' | 'wallet' | 'orders' = 'profile') => {
    setProfileInitialTab(tab);
    setIsProfileModalOpen(true);
  };

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Toasts with duplicate suppression
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, messageBn: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => {
      if (prev.some((t) => t.message === message)) return prev;
      return [...prev, { id, message, messageBn, type }];
    });
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const unlockAdmin = useCallback((pin: string, notify: boolean = true) => {
    const clean = (pin || '').trim();
    if (clean === 'admin123' || clean.toLowerCase() === 'epharmacy' || clean === '1234') {
      setIsAdminUnlocked(true);
      setUser((prev) => ({ ...prev, role: 'admin' }));
      setActiveTab('admin_panel');
      setIsAdminLoginModalOpen(false);
      try {
        if (!window.location.pathname.includes('admin') && !window.location.hash.includes('admin')) {
          window.history.pushState(null, '', '/admin');
        }
      } catch (e) {
        // ignore
      }
      if (notify) {
        addToast('Admin HQ Access Granted 🛡️', 'অ্যাডমিন একাউন্টে সফলভাবে লগইন হয়েছে 🛡️', 'success');
      }
      return true;
    }
    if (notify) {
      addToast('Incorrect Admin Passcode (Default: admin123)', 'ভুল অ্যাডমিন পাসকোড (ডিফল্ট: admin123)', 'error');
    }
    return false;
  }, [addToast]);

  const lockAdmin = useCallback(() => {
    setIsAdminUnlocked(false);
    setUser((prev) => ({ ...prev, role: 'customer' }));
    try {
      if (window.location.pathname.includes('admin') || window.location.hash.includes('admin')) {
        window.history.pushState(null, '', '/');
      }
    } catch (e) {
      // ignore
    }
    setActiveTab((prev) => (prev === 'admin_panel' ? 'home' : prev));
    addToast('Admin Mode Locked', 'অ্যাডমিন মোড সুরক্ষিতভাবে লক করা হয়েছে', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        language,
        toggleLanguage,
        t,
        user,
        setUser,
        switchRole,
        medicines,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        updateMedicineStock,
        updateMedicinePrice,
        addMedicine,
        deleteMedicine,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        doctors,
        appointments,
        bookAppointment,
        activeCallAppointment,
        startVideoCall,
        endVideoCall,
        saveDigitalRx,
        pillReminders,
        addPillReminder,
        togglePillReminder,
        markPillTaken,
        deletePillReminder,
        subscriptionPlans,
        activeSubscription,
        subscribeToPlan,
        cancelSubscription,
        activeTab,
        setActiveTab,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isPrescriptionModalOpen,
        setIsPrescriptionModalOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        isPillReminderModalOpen,
        setIsPillReminderModalOpen,
        isSubscriptionModalOpen,
        setIsSubscriptionModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        profileInitialTab,
        setProfileInitialTab,
        openProfileTab,
        isAdminUnlocked,
        unlockAdmin,
        lockAdmin,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
