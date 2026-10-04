export type Language = 'bn' | 'en';

export interface Medicine {
  id: string;
  name: string;
  nameBn?: string;
  generic: string;
  genericBn?: string;
  strength: string;
  category:
    | 'fever_pain'
    | 'gastric'
    | 'allergy_cough'
    | 'diabetes'
    | 'vitamins'
    | 'cardiac'
    | 'pediatric'
    | 'devices'
    | 'antibiotics'
    | 'beauty_skincare'
    | 'personal_care'
    | 'womens_care';
  manufacturer: string;
  pricePerUnit: number; // BDT per strip or bottle
  pricePerBox?: number;
  unitType: 'Strip' | 'Bottle' | 'Box' | 'Piece' | 'Tube' | 'Pack';
  unitsPerBox?: number;
  stockCount: number;
  isRxRequired: boolean;
  description: string;
  descriptionBn: string;
  dosageAdvice: string;
  sideEffects: string;
  image: string;
  rating: number;
  salesCount: number;
  inStock: boolean;
  discountPercentage?: number;
  searchKeywords?: string[];
}

export interface CartItem {
  medicine: Medicine;
  quantity: number; // number of strips/bottles or boxes
  unitChoice: 'strip' | 'box';
  totalPrice: number;
}

export interface DeliveryTimelineStep {
  title: string;
  titleBn: string;
  time: string;
  done: boolean;
  active: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  deliveryType: 'express' | 'standard'; // Express: 2 hours in Dhaka
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'COD' | 'Wallet';
  paymentStatus: 'paid' | 'pending' | 'cod';
  transactionId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  pointsDiscount: number;
  deliveryFee: number;
  total: number;
  status: 'confirmed' | 'presc_verified' | 'packed' | 'rider_assigned' | 'out_for_delivery' | 'delivered';
  riderName?: string;
  riderPhone?: string;
  riderBikeNo?: string;
  estimatedMinutes?: number;
  createdAt: string;
  prescriptionImage?: string;
  prescriptionVerified?: boolean;
  notes?: string;
}

export interface PillReminder {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "1 Tablet"
  timing: string[]; // e.g. ["08:00", "20:00"]
  mealRelation: 'before_meal' | 'after_meal' | 'with_meal';
  mealRelationBn: string;
  active: boolean;
  lastTaken?: string;
  streakDays: number;
}

export interface Doctor {
  id: string;
  name: string;
  degrees: string;
  specialty: string;
  specialtyBn: string;
  hospital: string;
  bmdcReg: string;
  experienceYears: number;
  feeBDT: number;
  rating: number;
  totalConsultations: number;
  avatar: string;
  availableDays: string[];
  slots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  phone: string;
  problem: string;
  date: string;
  slot: string;
  status: 'booked' | 'in_call' | 'completed' | 'cancelled';
  feeBDT: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  prescriptionGenerated?: DigitalRx;
  createdAt: string;
}

export interface DigitalRx {
  id: string;
  appointmentId: string;
  doctorName: string;
  bmdcReg: string;
  degrees: string;
  patientName: string;
  patientAge: string;
  date: string;
  diagnosis: string;
  medicines: {
    brandName: string;
    generic: string;
    dosage: string; // 1+0+1
    timing: string; // After meal
    duration: string; // 7 days
  }[];
  advice: string;
  nextFollowUp: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameBn: string;
  tagline: string;
  priceMonthly: number;
  discountPercentage: number;
  features: string[];
  featuresBn: string[];
  recommendedFor: string;
  popular?: boolean;
}

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  district: string;
  phone: string;
  isDefault: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  method?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  loyaltyPoints: number; // 1 point = 1 BDT
  walletBalance: number; // BDT ৳
  addresses: UserAddress[];
  walletHistory: WalletTransaction[];
  activeSubscriptionId?: string;
  role: 'customer' | 'doctor' | 'admin';
  isLoggedIn: boolean;
}
