import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Package,
  Truck,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Video,
  Eye,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Order, Medicine, Appointment } from '../types';

// Client Interface for Admin Customer Management
interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
  loyaltyPoints: number;
  activePlan: string;
  joinedDate: string;
}

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'cl-1',
    name: 'Tanvir Ahmed',
    phone: '01712-345678',
    email: 'tanvir.ahmed@gmail.com',
    district: 'Dhanmondi, Dhaka',
    totalOrders: 6,
    totalSpent: 4850,
    walletBalance: 250,
    loyaltyPoints: 180,
    activePlan: 'Chronic Diabetic Care',
    joinedDate: '15 Jan 2026',
  },
  {
    id: 'cl-2',
    name: 'Nusrat Jahan',
    phone: '01819-876543',
    email: 'nusrat.jahan@yahoo.com',
    district: 'Uttara, Dhaka',
    totalOrders: 4,
    totalSpent: 3420,
    walletBalance: 120,
    loyaltyPoints: 95,
    activePlan: 'Mother & Baby Care',
    joinedDate: '02 Feb 2026',
  },
  {
    id: 'cl-3',
    name: 'Dr. Rafiqul Hasan',
    phone: '01911-223344',
    email: 'dr.rafiq@bmdc.org.bd',
    district: 'Gulshan-2, Dhaka',
    totalOrders: 9,
    totalSpent: 12800,
    walletBalance: 500,
    loyaltyPoints: 340,
    activePlan: 'Family Complete Shield',
    joinedDate: '10 Dec 2025',
  },
  {
    id: 'cl-4',
    name: 'Sabrina Rahman',
    phone: '01678-554433',
    email: 'sabrina.r@outlook.com',
    district: 'Mirpur-10, Dhaka',
    totalOrders: 3,
    totalSpent: 1850,
    walletBalance: 50,
    loyaltyPoints: 40,
    activePlan: 'None',
    joinedDate: '22 Feb 2026',
  },
  {
    id: 'cl-5',
    name: 'Mahfuzur Rahman',
    phone: '01733-998877',
    email: 'mahfuz.ctg@gmail.com',
    district: 'Agrabad, Chittagong',
    totalOrders: 5,
    totalSpent: 5600,
    walletBalance: 310,
    loyaltyPoints: 150,
    activePlan: 'Cardiac Health Shield',
    joinedDate: '08 Jan 2026',
  },
  {
    id: 'cl-6',
    name: 'Farhana Akter',
    phone: '01855-667788',
    email: 'farhana.syl@gmail.com',
    district: 'Zindabazar, Sylhet',
    totalOrders: 2,
    totalSpent: 1450,
    walletBalance: 80,
    loyaltyPoints: 30,
    activePlan: 'None',
    joinedDate: '18 Mar 2026',
  },
  {
    id: 'cl-7',
    name: 'Asif Chowdhury',
    phone: '01521-443322',
    email: 'asif.raj@gmail.com',
    district: 'Kazihata, Rajshahi',
    totalOrders: 7,
    totalSpent: 8200,
    walletBalance: 420,
    loyaltyPoints: 210,
    activePlan: 'Chronic Diabetic Care',
    joinedDate: '05 Jan 2026',
  },
];

// Daily Trend Dataset (Last 7 Days)
const DAILY_SALES_DATA = [
  {
    period: 'Mon',
    label: 'Monday (Sep 28)',
    revenue: 34200,
    profit: 7524,
    orders: 42,
    rxOrders: 26,
    otcOrders: 16,
    expressCount: 32,
  },
  {
    period: 'Tue',
    label: 'Tuesday (Sep 29)',
    revenue: 38900,
    profit: 8558,
    orders: 48,
    rxOrders: 30,
    otcOrders: 18,
    expressCount: 37,
  },
  {
    period: 'Wed',
    label: 'Wednesday (Sep 30)',
    revenue: 43500,
    profit: 9570,
    orders: 54,
    rxOrders: 35,
    otcOrders: 19,
    expressCount: 42,
  },
  {
    period: 'Thu',
    label: 'Thursday (Oct 1)',
    revenue: 41200,
    profit: 9064,
    orders: 51,
    rxOrders: 32,
    otcOrders: 19,
    expressCount: 39,
  },
  {
    period: 'Fri',
    label: 'Friday (Oct 2)',
    revenue: 48900,
    profit: 10758,
    orders: 62,
    rxOrders: 39,
    otcOrders: 23,
    expressCount: 48,
  },
  {
    period: 'Sat',
    label: 'Saturday (Yesterday)',
    revenue: 54600,
    profit: 12012,
    orders: 71,
    rxOrders: 46,
    otcOrders: 25,
    expressCount: 56,
  },
  {
    period: 'Sun',
    label: 'Sunday (Today Live)',
    revenue: 61800,
    profit: 13596,
    orders: 82,
    rxOrders: 53,
    otcOrders: 29,
    expressCount: 66,
  },
];

// Weekly Trend Dataset (Last 8 Weeks)
const WEEKLY_SALES_DATA = [
  {
    period: 'Wk 33',
    label: 'Week 33 (Mid Aug)',
    revenue: 168000,
    profit: 36960,
    orders: 215,
    rxOrders: 135,
    otcOrders: 80,
    expressCount: 162,
  },
  {
    period: 'Wk 34',
    label: 'Week 34 (Late Aug)',
    revenue: 182500,
    profit: 40150,
    orders: 232,
    rxOrders: 148,
    otcOrders: 84,
    expressCount: 178,
  },
  {
    period: 'Wk 35',
    label: 'Week 35 (Early Sep)',
    revenue: 198000,
    profit: 43560,
    orders: 254,
    rxOrders: 162,
    otcOrders: 92,
    expressCount: 196,
  },
  {
    period: 'Wk 36',
    label: 'Week 36 (Mid Sep)',
    revenue: 215400,
    profit: 47388,
    orders: 278,
    rxOrders: 176,
    otcOrders: 102,
    expressCount: 215,
  },
  {
    period: 'Wk 37',
    label: 'Week 37 (Late Sep)',
    revenue: 238000,
    profit: 52360,
    orders: 308,
    rxOrders: 196,
    otcOrders: 112,
    expressCount: 242,
  },
  {
    period: 'Wk 38',
    label: 'Week 38 (End Sep)',
    revenue: 264500,
    profit: 58190,
    orders: 342,
    rxOrders: 220,
    otcOrders: 122,
    expressCount: 268,
  },
  {
    period: 'Wk 39',
    label: 'Week 39 (Early Oct)',
    revenue: 295000,
    profit: 64900,
    orders: 382,
    rxOrders: 248,
    otcOrders: 134,
    expressCount: 302,
  },
  {
    period: 'Wk 40',
    label: 'Week 40 (Current Week)',
    revenue: 326000,
    profit: 71720,
    orders: 425,
    rxOrders: 278,
    otcOrders: 147,
    expressCount: 338,
  },
];

// Monthly Trend Dataset (Last 12 Months)
const MONTHLY_SALES_DATA = [
  {
    period: 'Nov 25',
    label: 'November 2025',
    revenue: 680000,
    profit: 149600,
    orders: 890,
    rxOrders: 560,
    otcOrders: 330,
    expressCount: 680,
  },
  {
    period: 'Dec 25',
    label: 'December 2025',
    revenue: 750000,
    profit: 165000,
    orders: 980,
    rxOrders: 620,
    otcOrders: 360,
    expressCount: 755,
  },
  {
    period: 'Jan 26',
    label: 'January 2026',
    revenue: 830000,
    profit: 182600,
    orders: 1090,
    rxOrders: 690,
    otcOrders: 400,
    expressCount: 845,
  },
  {
    period: 'Feb 26',
    label: 'February 2026',
    revenue: 895000,
    profit: 196900,
    orders: 1180,
    rxOrders: 750,
    otcOrders: 430,
    expressCount: 920,
  },
  {
    period: 'Mar 26',
    label: 'March 2026',
    revenue: 990000,
    profit: 217800,
    orders: 1310,
    rxOrders: 840,
    otcOrders: 470,
    expressCount: 1025,
  },
  {
    period: 'Apr 26',
    label: 'April 2026',
    revenue: 1080000,
    profit: 237600,
    orders: 1440,
    rxOrders: 920,
    otcOrders: 520,
    expressCount: 1130,
  },
  {
    period: 'May 26',
    label: 'May 2026',
    revenue: 1195000,
    profit: 262900,
    orders: 1590,
    rxOrders: 1020,
    otcOrders: 570,
    expressCount: 1255,
  },
  {
    period: 'Jun 26',
    label: 'June 2026',
    revenue: 1310000,
    profit: 288200,
    orders: 1740,
    rxOrders: 1120,
    otcOrders: 620,
    expressCount: 1380,
  },
  {
    period: 'Jul 26',
    label: 'July 2026',
    revenue: 1435000,
    profit: 315700,
    orders: 1910,
    rxOrders: 1230,
    otcOrders: 680,
    expressCount: 1520,
  },
  {
    period: 'Aug 26',
    label: 'August 2026',
    revenue: 1580000,
    profit: 347600,
    orders: 2100,
    rxOrders: 1360,
    otcOrders: 740,
    expressCount: 1680,
  },
  {
    period: 'Sep 26',
    label: 'September 2026',
    revenue: 1720000,
    profit: 378400,
    orders: 2290,
    rxOrders: 1490,
    otcOrders: 800,
    expressCount: 1840,
  },
  {
    period: 'Oct 26',
    label: 'October 2026 (Live)',
    revenue: 1890000,
    profit: 415800,
    orders: 2520,
    rxOrders: 1640,
    otcOrders: 880,
    expressCount: 2030,
  },
];

// Category Share Data for Donut Chart
const CATEGORY_SHARE_DATA = [
  { name: 'Fever & Pain Relief', value: 32, revenue: 580000, color: '#10b981' },
  { name: 'Gastric & Acidity', value: 24, revenue: 435000, color: '#3b82f6' },
  { name: 'Skincare & Beauty', value: 16, revenue: 290000, color: '#ec4899' },
  { name: 'Baby & Child Care', value: 12, revenue: 217000, color: '#f59e0b' },
  { name: 'Medical Devices & BP', value: 9, revenue: 163000, color: '#8b5cf6' },
  { name: 'Cardiac & Diabetic', value: 7, revenue: 126000, color: '#ef4444' },
];

export const HiddenAdminPanel: React.FC = () => {
  const {
    medicines,
    updateMedicineStock,
    updateMedicinePrice,
    addMedicine,
    deleteMedicine,
    orders,
    updateOrderStatus,
    appointments,
    switchRole,
    setActiveTab,
    lockAdmin,
    t,
    addToast,
  } = useApp();

  // Active Admin Tab: default to 'overview' for Recharts Dashboard
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'inventory' | 'reports' | 'clients' | 'orders' | 'doctors'
  >('overview');

  // Trend Period Switcher: 'daily' | 'weekly' | 'monthly'
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Trend Metric View: 'revenue' | 'orders'
  const [trendMetric, setTrendMetric] = useState<'revenue' | 'orders'>('revenue');

  // Inventory Search & Filter states
  const [stockSearch, setStockSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // New Medicine form states
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedStrength, setNewMedStrength] = useState('500mg');
  const [newMedCategory, setNewMedCategory] = useState<Medicine['category']>('fever_pain');
  const [newMedCompany, setNewMedCompany] = useState('Square Pharmaceuticals Ltd.');
  const [newMedPrice, setNewMedPrice] = useState('35');
  const [newMedStock, setNewMedStock] = useState('100');
  const [newMedIsRx, setNewMedIsRx] = useState(false);
  const [newMedImage, setNewMedImage] = useState(
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'
  );

  // Client Management States
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientForWallet, setSelectedClientForWallet] = useState<ClientRecord | null>(null);
  const [walletAddAmount, setWalletAddAmount] = useState('200');

  // Dedicated Update Stock Modal & Draft States for Inventory Management
  const [updateStockModalMed, setUpdateStockModalMed] = useState<Medicine | null>(null);
  const [modalStockInput, setModalStockInput] = useState<number>(0);
  const [modalPriceInput, setModalPriceInput] = useState<number>(0);
  const [rowStockDrafts, setRowStockDrafts] = useState<Record<string, number>>({});

  const openUpdateStockModal = (med: Medicine) => {
    setUpdateStockModalMed(med);
    setModalStockInput(med.stockCount);
    setModalPriceInput(med.pricePerUnit);
  };

  const handleUpdateStockSubmit = (med: Medicine, newStock: number) => {
    const finalStock = Math.max(0, newStock);
    updateMedicineStock(med.id, finalStock);
    addToast(
      `Stock updated for ${med.name}: ${finalStock} ${med.unitType}s in stock`,
      `${med.name} এর স্টক সফলভাবে আপডেট হয়েছে: ${finalStock} টি`,
      'success'
    );
  };

  const handleModalSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateStockModalMed) return;
    const finalStock = Math.max(0, Number(modalStockInput));
    updateMedicineStock(updateStockModalMed.id, finalStock);
    if (modalPriceInput > 0 && modalPriceInput !== updateStockModalMed.pricePerUnit) {
      updateMedicinePrice(updateStockModalMed.id, Number(modalPriceInput));
    }
    addToast(
      `Stock updated for ${updateStockModalMed.name}: ${finalStock} ${updateStockModalMed.unitType}s (৳${modalPriceInput})`,
      `${updateStockModalMed.name} এর স্টক আপডেট সম্পন্ন: ${finalStock} টি (৳${modalPriceInput})`,
      'success'
    );
    setUpdateStockModalMed(null);
  };

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Active dataset based on selected period (Daily, Weekly, Monthly)
  const currentTrendData = useMemo(() => {
    if (trendPeriod === 'weekly') return WEEKLY_SALES_DATA;
    if (trendPeriod === 'monthly') return MONTHLY_SALES_DATA;
    return DAILY_SALES_DATA;
  }, [trendPeriod]);

  // Current Period Totals
  const currentPeriodTotalRevenue = useMemo(() => {
    return currentTrendData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [currentTrendData]);

  const currentPeriodTotalOrders = useMemo(() => {
    return currentTrendData.reduce((acc, curr) => acc + curr.orders, 0);
  }, [currentTrendData]);

  const currentPeriodTotalProfit = useMemo(() => {
    return currentTrendData.reduce((acc, curr) => acc + curr.profit, 0);
  }, [currentTrendData]);

  // Filtered Medicines
  const filteredMedicines = useMemo(() => {
    return (medicines || []).filter((m) => {
      if (!m) return false;
      const name = (m.name || '').toLowerCase();
      const generic = (m.generic || '').toLowerCase();
      const manufacturer = (m.manufacturer || '').toLowerCase();
      const search = (stockSearch || '').toLowerCase();

      const matchesSearch =
        name.includes(search) ||
        generic.includes(search) ||
        manufacturer.includes(search);

      if (!matchesSearch) return false;

      const stock = typeof m.stockCount === 'number' ? m.stockCount : 0;
      if (stockFilter === 'low') return stock > 0 && stock <= 25;
      if (stockFilter === 'out') return stock <= 0 || !m.inStock;
      if (stockFilter === 'in') return stock > 25;
      return true;
    });
  }, [medicines, stockSearch, stockFilter]);

  // Low stock counter
  const lowStockCount = useMemo(
    () => (medicines || []).filter((m) => m && typeof m.stockCount === 'number' && m.stockCount > 0 && m.stockCount <= 25).length,
    [medicines]
  );
  const outOfStockCount = useMemo(
    () => (medicines || []).filter((m) => m && ((typeof m.stockCount === 'number' && m.stockCount <= 0) || !m.inStock)).length,
    [medicines]
  );

  // Bulk restock handler
  const handleBulkRestock = () => {
    medicines.forEach((m) => {
      if (m.stockCount <= 25) {
        updateMedicineStock(m.id, m.stockCount + 50);
      }
    });
    addToast(
      'Bulk Restock Completed! +50 units added to all low stock items',
      'বাল্ক রিস্টক সম্পন্ন! সকল স্বল্প মজুত ঔষধে ৫০টি ইউনিট যুক্ত হয়েছে',
      'success'
    );
  };

  // Create Medicine Handler
  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedGeneric) return;

    addMedicine({
      name: newMedName,
      generic: newMedGeneric,
      strength: newMedStrength,
      category: newMedCategory,
      manufacturer: newMedCompany,
      pricePerUnit: parseFloat(newMedPrice) || 30,
      pricePerBox: (parseFloat(newMedPrice) || 30) * 10 * 0.95,
      unitType: 'Strip',
      unitsPerBox: 10,
      stockCount: parseInt(newMedStock, 10) || 100,
      isRxRequired: newMedIsRx,
      description: `${newMedName} genuine pharmaceutical formulation by ${newMedCompany}`,
      descriptionBn: `${newMedCompany} এর প্রস্তুতকৃত খাঁটি ঔষধ।`,
      dosageAdvice: 'As prescribed by registered physician',
      sideEffects: 'Consult product packaging pamphlet',
      image: newMedImage,
      rating: 4.9,
      salesCount: 0,
      inStock: true,
    });

    setIsAddMedModalOpen(false);
    setNewMedName('');
    setNewMedGeneric('');
    addToast('Medicine added to catalog', 'নতুন ঔষধ সফলভাবে ক্যাটালগে যুক্ত হয়েছে', 'success');
  };

  // Wallet Credit Handler for Client
  const handleAddClientWallet = () => {
    if (!selectedClientForWallet) return;
    const amount = parseFloat(walletAddAmount) || 0;
    if (amount <= 0) return;

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClientForWallet.id
          ? {
              ...c,
              walletBalance: c.walletBalance + amount,
              loyaltyPoints: c.loyaltyPoints + Math.floor(amount * 0.1),
            }
          : c
      )
    );

    addToast(
      `৳${amount} credited to ${selectedClientForWallet.name}'s wallet!`,
      `${selectedClientForWallet.name} এর ওয়ালেটে ৳${amount} যোগ করা হয়েছে!`,
      'success'
    );
    setSelectedClientForWallet(null);
  };

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone.includes(clientSearch) ||
        c.district.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  // Global KPIs
  const totalRevenueBDT = useMemo(
    () => (orders || []).reduce((sum, ord) => sum + (ord?.total || 0), 0),
    [orders]
  );
  const totalInventoryUnits = useMemo(
    () => (medicines || []).reduce((sum, m) => sum + (m?.stockCount || 0), 0),
    [medicines]
  );
  const totalInventoryValueBDT = useMemo(
    () => (medicines || []).reduce((sum, m) => sum + (m?.stockCount || 0) * (m?.pricePerUnit || 0), 0),
    [medicines]
  );
  const estimatedProfit = useMemo(
    () => Math.round(totalRevenueBDT * 0.22),
    [totalRevenueBDT]
  );

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  // Export Report
  const handleExportReport = () => {
    const reportText = `epharmacy Healthcare Business Report
Date: ${new Date().toLocaleDateString()}
Selected Trend Mode: ${trendPeriod.toUpperCase()}
Total Gross Sales: BDT ${totalRevenueBDT}
Inventory Strip Count: ${totalInventoryUnits}
Inventory Asset Value: BDT ${totalInventoryValueBDT}
Active Customers: ${clients.length}

${trendPeriod.toUpperCase()} Trend Summary:
${currentTrendData
  .map(
    (d) =>
      `${d.label}: Revenue ৳${d.revenue.toLocaleString()} | Profit ৳${d.profit.toLocaleString()} | Orders ${d.orders} (Rx: ${d.rxOrders}, OTC: ${d.otcOrders})`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(reportText);
    addToast(
      'Financial & Trends Summary Report copied to clipboard!',
      'ফাইন্যান্সিয়াল ও সেলস ট্রেন্ড রিপোর্ট ক্লিপবোর্ডে কপি করা হয়েছে!',
      'success'
    );
  };

  // Custom Tooltip for Recharts
  const CustomSalesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
          <div className="font-extrabold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{dataPoint.label || label}</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {trendPeriod.toUpperCase()}
            </span>
          </div>

          {trendMetric === 'revenue' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Gross Revenue:
                </span>
                <strong className="text-emerald-400 font-black">
                  ৳{dataPoint.revenue.toLocaleString()}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  Net Gross Profit:
                </span>
                <strong className="text-purple-300 font-black">
                  ৳{dataPoint.profit.toLocaleString()}
                </strong>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  Rx Prescriptions:
                </span>
                <strong className="text-blue-300 font-black">
                  {dataPoint.rxOrders} orders
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  OTC & Wellness:
                </span>
                <strong className="text-amber-300 font-black">
                  {dataPoint.otcOrders} orders
                </strong>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold">
                <span className="text-slate-300">Total Volume:</span>
                <span className="text-white">{dataPoint.orders} deliveries</span>
              </div>
            </>
          )}

          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800">
            <span>⚡ 2-Hr Express:</span>
            <span className="text-amber-300 font-bold">{dataPoint.expressCount} parcels</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Admin Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-purple-950 text-purple-300 border border-purple-800 px-3 py-0.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin HQ Command Center</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Recharts Analytics Live</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('epharmacy Administration & Control Hub', 'ই-ফার্মেসি ব্যাকঅফিস অ্যাডমিন প্যানেল')}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t(
              'Interactive Recharts daily, weekly, and monthly sales trends, live inventory control, client records, and dispatch logistics.',
              'রিচার্টস দৈনিক, সাপ্তাহিক ও মাসিক সেলস ট্রেন্ড, লাইভ ইনভেন্টরি, ক্লায়েন্ট তালিকা ও ডেলিভারি ট্র্যাকিং।'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportReport}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('Export Report', 'রিপোর্ট কপি/ডাউনলোড')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-purple-600/30 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>{t('Back to Storefront', 'শপ / হোমপেজে যান')}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={lockAdmin}
            className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            title="Lock Admin Session"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>{t('Lock Admin', 'লক করুন')}</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Quick Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Today’s Live Sales', 'আজকের মোট বিক্রি')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            ৳61,800
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+16.4% vs Yesterday</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Inventory In Stock', 'মজুদ ঔষধ সংখ্যা')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {totalInventoryUnits.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
            Valued at ৳{totalInventoryValueBDT.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Monthly Volume (Oct)', 'মাসিক মোট বিক্রয়')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1">
            ৳18.9L
          </div>
          <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.2% Growth MoM</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('Active Patients', 'নিবন্ধিত গ্রাহক')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
            {clients.length}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
            89.4% Repeat Order Rate
          </span>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-amber-50 p-4 rounded-3xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            {t('Stock Alerts', 'স্টক সতর্কতা')}
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1">
            {lowStockCount + outOfStockCount} Items
          </div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
            {lowStockCount} Low • {outOfStockCount} Out
          </span>
        </div>
      </div>

      {/* 3. Main Admin Navigation Tabs with NEW Dashboard Overview */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {/* NEW DASHBOARD OVERVIEW TAB */}
        <button
          type="button"
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'overview'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-300" />
          <span>{t('Dashboard Overview (Trends)', 'ড্যাশবোর্ড ওভারভিউ (ট্রেন্ড)')}</span>
          <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            Recharts
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('inventory')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'inventory'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('Inventory & Stock Control', 'ইনভেন্টরি ও স্টক কন্ট্রোল')}</span>
          <span className="bg-purple-200/90 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {medicines.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('reports')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'reports'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t('Sales & Business Reports', 'বিক্রয় ও বিজনেস রিপোর্ট')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('clients')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'clients'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('Clients & Customers', 'ক্লায়েন্ট ও গ্রাহক')}</span>
          <span className="bg-purple-200/90 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {clients.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'orders'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t('Orders & Dispatch Tracking', 'অর্ডার ও ডেলিভারি ডিসপ্যাচ')}</span>
          <span className="bg-purple-200/90 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('doctors')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'doctors'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{t('Doctor Consultations', 'ডাক্তার কনসালটেশন')}</span>
          <span className="bg-purple-200/90 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {appointments.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: DASHBOARD OVERVIEW WITH RECHARTS (DAILY, WEEKLY, MONTHLY TRENDS)    */}
      {/* ========================================================================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Control Bar: Trend Period Switcher & Metric Toggle */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {t('Sales & Volume Growth Trends', 'বিক্রয় ও অর্ডারের প্রবৃদ্ধি ট্রেন্ড')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(
                  'Switch between Daily, Weekly, and Monthly Recharts visualizations to track business momentum.',
                  'দৈনিক, সাপ্তাহিক ও মাসিক রিয়েল-টাইম ট্রেন্ড বিশ্লেষণ করুন।'
                )}
              </p>
            </div>

            {/* Segmented Period Switcher (Daily, Weekly, Monthly) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTrendPeriod('daily')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    trendPeriod === 'daily'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('Daily (7 Days)', 'দৈনিক (৭ দিন)')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrendPeriod('weekly')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    trendPeriod === 'weekly'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('Weekly (8 Weeks)', 'সাপ্তাহিক (৮ সপ্তাহ)')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrendPeriod('monthly')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    trendPeriod === 'monthly'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t('Monthly (12 Mo)', 'মাসিক (১২ মাস)')}</span>
                </button>
              </div>

              {/* Metric View Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setTrendMetric('revenue')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    trendMetric === 'revenue'
                      ? 'bg-white text-emerald-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ৳ Revenue & Profit
                </button>
                <button
                  type="button"
                  onClick={() => setTrendMetric('orders')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    trendMetric === 'orders'
                      ? 'bg-white text-blue-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📦 Order Volume (Rx/OTC)
                </button>
              </div>
            </div>
          </div>

          {/* Period Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-linear-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                {trendPeriod === 'daily'
                  ? '7-Day Total Revenue'
                  : trendPeriod === 'weekly'
                  ? '8-Week Total Revenue'
                  : '12-Month Total Revenue'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1">
                ৳{currentPeriodTotalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-2 font-bold">
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                <span>+18.7% above healthcare forecast</span>
              </div>
            </div>

            <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">
                {trendPeriod === 'daily'
                  ? '7-Day Gross Margin'
                  : trendPeriod === 'weekly'
                  ? '8-Week Gross Margin'
                  : '12-Month Gross Margin'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1">
                ৳{currentPeriodTotalProfit.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-300 mt-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-purple-300" />
                <span>22.0% Steady gross profitability</span>
              </div>
            </div>

            <div className="bg-linear-to-r from-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                {trendPeriod === 'daily'
                  ? '7-Day Parcel Dispatches'
                  : trendPeriod === 'weekly'
                  ? '8-Week Parcel Dispatches'
                  : '12-Month Parcel Dispatches'}
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1">
                {currentPeriodTotalOrders.toLocaleString()} <span className="text-sm font-normal">deliveries</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 mt-2 font-bold">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>76% fulfilled via 2-Hour Express</span>
              </div>
            </div>
          </div>

          {/* MAIN RECHARTS AREA CHART */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>
                    {trendMetric === 'revenue'
                      ? `${trendPeriod.toUpperCase()} Revenue & Gross Margin Growth Curve (BDT ৳)`
                      : `${trendPeriod.toUpperCase()} Prescription (Rx) vs OTC Order Volume`}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {trendPeriod === 'daily'
                    ? 'Day-by-day sales data over the past 7 days'
                    : trendPeriod === 'weekly'
                    ? 'Week-by-week aggregated volume over the past 8 weeks'
                    : '12-month trailing revenue progression across all 64 districts in Bangladesh'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                {trendMetric === 'revenue' ? (
                  <>
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span>Gross Sales (৳)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-700">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      <span>Net Profit (৳)</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>Rx Prescriptions</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-700">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span>OTC & Baby Care</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={currentTrendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorRx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOTC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    stroke="#94a3b8"
                    fontSize={11}
                    fontWeight={600}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    fontSize={11}
                    fontWeight={600}
                    tickFormatter={(val) =>
                      trendMetric === 'revenue'
                        ? val >= 1000000
                          ? `${(val / 1000000).toFixed(1)}M`
                          : val >= 1000
                          ? `${(val / 1000).toFixed(0)}k`
                          : `${val}`
                        : `${val}`
                    }
                  />
                  <Tooltip content={<CustomSalesTooltip />} />

                  {trendMetric === 'revenue' ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Gross Sales"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        name="Net Profit"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorProfit)"
                      />
                    </>
                  ) : (
                    <>
                      <Area
                        type="monotone"
                        dataKey="rxOrders"
                        name="Prescription (Rx) Orders"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRx)"
                      />
                      <Area
                        type="monotone"
                        dataKey="otcOrders"
                        name="OTC & Wellness Orders"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorOTC)"
                      />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DUAL RECHARTS ROW: BAR CHART & DONUT PIE CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Bar Chart: Prescription vs OTC Comparison */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>{t('Order Volume Comparison (Rx vs OTC)', 'অর্ডার ভলিউম তুলনা')}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Track prescription-verified medicine delivery vs general OTC items
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  Verified Pharmacist Gate
                </span>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(val) => <span className="text-xs font-bold text-slate-700">{val}</span>}
                    />
                    <Bar
                      dataKey="rxOrders"
                      name="Prescriptions (Rx)"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="otcOrders"
                      name="OTC & Care Products"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Donut Pie Chart: Category Revenue Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-purple-600" />
                    <span>{t('Revenue Distribution by Category', 'ক্যাটাগরি ভিত্তিক আয়ের হার')}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Contribution of pharmaceuticals, skincare & infant care
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                  100% genuine inventory
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2 h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_SHARE_DATA}
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {CATEGORY_SHARE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any, item: any) => [
                          `${value}% (৳${item.payload.revenue.toLocaleString()})`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full sm:w-1/2 space-y-2 text-xs">
                  {CATEGORY_SHARE_DATA.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        ></span>
                        <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                          {cat.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900">{cat.value}%</span>
                        <span className="text-[10px] text-slate-400 block">
                          ৳{(cat.revenue / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logistical Performance & Speed Row */}
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Dhaka Express Speed</span>
              </div>
              <div className="text-2xl font-black text-white">38 Mins</div>
              <p className="text-[11px] text-slate-400">
                Average door-to-door delivery time across Dhaka metro today
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                <span>On-Time Dispatch Rate</span>
              </div>
              <div className="text-2xl font-black text-white">99.4%</div>
              <p className="text-[11px] text-slate-400">
                Packed in cold-insulated bags within 8 minutes of verification
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>A-Grade Rx Checks</span>
              </div>
              <div className="text-2xl font-black text-white">100% Verified</div>
              <p className="text-[11px] text-slate-400">
                Every prescription inspected by registered BMDC/Pharmacy Council staff
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-blue-300 font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Care Subscriptions</span>
              </div>
              <div className="text-2xl font-black text-white">৳218.5k MRR</div>
              <p className="text-[11px] text-slate-400">
                Monthly diabetic, cardiac & baby auto-refill subscriptions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: INVENTORY MANAGEMENT                                               */}
      {/* ========================================================================= */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-5">
          {/* Header Title & Summary Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {t('Inventory Management', 'ইনভেন্টরি ম্যানেজমেন্ট')}
                </h2>
                <span className="bg-purple-100 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  {medicines.length} {t('Medicines Cataloged', 'টি ঔষধ তালিকাভুক্ত')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t(
                  'Monitor real-time warehouse inventory, review current stock levels, verify unit pricing, and update stock counts for each medicine item.',
                  'লাইভ গুদাম স্টক লেভেল পর্যবেক্ষণ, খুচরা মূল্য যাচাই এবং প্রতিটি ঔষধের জন্য স্টক আপডেট করুন।'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddMedModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Add New Medicine', 'নতুন ঔষধ যুক্ত করুন')}</span>
              </button>
            </div>
          </div>

          {/* Low Stock Warning Banner with 1-click bulk restock */}
          {lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-900">
                    {lowStockCount} {t('medicines are running low in stock!', 'টি ঔষধে মজুত স্বল্প!')}
                  </h4>
                  <p className="text-xs text-amber-700">
                    {t(
                      'Restock inventory to prevent express delivery order cancellations.',
                      'এক্সপ্রেস ডেলিভারি নিশ্চিত করতে স্টক হালনাগাদ করুন।'
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleBulkRestock}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('+50 Bulk Restock All', 'সকলটিতে +৫০ যোগ করুন')}</span>
              </button>
            </div>
          )}

          {/* Action Bar: Search & Stock Status Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder={t('Search medicine by name, generic, or pharma company...', 'ঔষধের নাম, জেনেরিক বা কোম্পানি দিয়ে খুঁজুন...')}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  stockFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Items ({medicines.length})
              </button>
              <button
                onClick={() => setStockFilter('in')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  stockFilter === 'in'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                In Stock ({medicines.filter((m) => m.stockCount > 25).length})
              </button>
              <button
                onClick={() => setStockFilter('low')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  stockFilter === 'low'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Low Stock ({lowStockCount})
              </button>
              <button
                onClick={() => setStockFilter('out')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  stockFilter === 'out'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Medicines Inventory Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">{t('Medicine Name', 'ঔষধের নাম')}</th>
                    <th className="p-4">{t('Current Stock Level', 'বর্তমান মজুত লেভেল')}</th>
                    <th className="p-4">{t('Unit Price', 'খুচরা মূল্য')}</th>
                    <th className="p-4">{t('Stock Adjustment', 'স্টক পরিমাণ সমন্বয়')}</th>
                    <th className="p-4 text-center">{t('Update Action', 'স্টক আপডেট')}</th>
                    <th className="p-4 text-right">{t('Manage', 'ব্যবস্থাপনা')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicines.map((med) => {
                    const currentDraftStock =
                      rowStockDrafts[med.id] !== undefined ? rowStockDrafts[med.id] : med.stockCount;

                    return (
                      <tr key={med.id} className="hover:bg-slate-50/70 transition">
                        {/* 1. Medicine Name */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={med.image}
                              alt={med.name}
                              className="w-11 h-11 rounded-2xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{med.name}</span>
                                {med.isRxRequired && (
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded" title="Prescription Required">
                                    Rx
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                {med.generic} • <strong className="text-slate-700">{med.strength}</strong>
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">
                                {med.manufacturer}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Current Stock Level */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                              <span>{med.stockCount}</span>
                              <span className="text-xs text-slate-500 font-normal">{med.unitType}s</span>
                            </div>

                            {med.stockCount > 25 ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                <span>In Stock</span>
                              </span>
                            ) : med.stockCount > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-black text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                                <span>Low Stock ({med.stockCount})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-black text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                <span>Out of Stock</span>
                              </span>
                            )}

                            <div className="text-[10px] text-slate-400">
                              🔥 {med.salesCount.toLocaleString()} {t('sold', 'বিক্রি')}
                            </div>
                          </div>
                        </td>

                        {/* 3. Unit Price */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <div className="text-sm font-black text-slate-900">
                              ৳{med.pricePerUnit.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              per {med.unitType}
                            </div>
                            {med.pricePerBox && (
                              <div className="text-[10px] text-emerald-700 font-bold">
                                Box: ৳{med.pricePerBox.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 4. Stock Adjustment Input */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const newVal = Math.max(0, currentDraftStock - 10);
                                setRowStockDrafts((prev) => ({ ...prev, [med.id]: newVal }));
                              }}
                              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-black transition cursor-pointer text-xs"
                              title="Decrease 10"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={currentDraftStock}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setRowStockDrafts((prev) => ({
                                  ...prev,
                                  [med.id]: isNaN(val) ? 0 : Math.max(0, val),
                                }));
                              }}
                              className="w-20 px-2 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl font-mono font-black text-slate-900 text-center text-xs outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const newVal = currentDraftStock + 10;
                                setRowStockDrafts((prev) => ({ ...prev, [med.id]: newVal }));
                              }}
                              className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-black transition cursor-pointer text-xs"
                              title="Increase 10"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* 5. 'Update Stock' Button for each item */}
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleUpdateStockSubmit(med, currentDraftStock)}
                            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer mx-auto whitespace-nowrap"
                            title={`Update Stock for ${med.name}`}
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{t('Update Stock', 'স্টক আপডেট')}</span>
                          </button>
                        </td>

                        {/* 6. Quick Details Modal & Delete Actions */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openUpdateStockModal(med)}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold text-[11px] transition cursor-pointer"
                              title="Open Full Stock & Price Editor"
                            >
                              {t('Presets / ৳', 'প্রিসেট / ৳')}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove "${med.name}" from inventory?`)) {
                                  deleteMedicine(med.id);
                                }
                              }}
                              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete medicine from catalog"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FINANCIAL & SALES BUSINESS REPORTS                                 */}
      {/* ========================================================================= */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-6">
          {/* Main KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('Total Gross Revenue', 'মোট বিক্রয়')}
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">৳{totalRevenueBDT.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 mt-1">From {orders.length} digital & COD orders</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('Estimated Gross Profit (22%)', 'আনুমানিক নিট লাভ (২২%)')}
              </span>
              <div className="text-2xl font-black text-purple-700 mt-1">৳{estimatedProfit.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 mt-1">After wholesale pharma procurement</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('Warehouse Inventory Value', 'গুদামে মজুত সম্পদের মূল্য')}
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">৳{totalInventoryValueBDT.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 mt-1">{totalInventoryUnits.toLocaleString()} total units in stock</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('Average Order Value (AOV)', 'গড় অর্ডার মূল্য')}
              </span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                ৳{orders.length ? Math.round(totalRevenueBDT / orders.length) : 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Per patient checkout in Dhaka & nationwide</p>
            </div>
          </div>

          {/* Payment Method Breakdown & Top Sellers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 5 Best Sellers */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center justify-between">
                <span>{t('Top-Selling Medicines (সর্বাধিক বিক্রিত)', 'সর্বাধিক বিক্রিত ঔষধ')}</span>
                <span className="text-[11px] text-slate-400 font-normal">By sales count</span>
              </h3>
              <div className="space-y-3">
                {medicines
                  .slice()
                  .sort((a, b) => b.salesCount - a.salesCount)
                  .slice(0, 5)
                  .map((m, idx) => (
                    <div key={m.id} className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 font-black text-slate-600 flex items-center justify-center text-[11px]">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-extrabold text-slate-900">{m.name}</div>
                          <div className="text-slate-400 text-[10px]">{m.manufacturer.split(' ')[0]}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-slate-900">{m.salesCount.toLocaleString()} {t('sold', 'টি')}</div>
                        <div className="text-emerald-700 text-[10px] font-bold">
                          ৳{(m.salesCount * m.pricePerUnit).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Payment Method Channels */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center justify-between">
                <span>{t('Payment Channels Share', 'পেমেন্ট মেথড পরিসংখ্যান')}</span>
                <span className="text-[11px] text-slate-400 font-normal">Real-time gateway</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                      <span>bKash Payment Gateway</span>
                    </span>
                    <span className="text-slate-900">54% • ৳{Math.round(totalRevenueBDT * 0.54).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                      <span>Nagad Direct Checkout</span>
                    </span>
                    <span className="text-slate-900">26% • ৳{Math.round(totalRevenueBDT * 0.26).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '26%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <span className="text-slate-900">15% • ৳{Math.round(totalRevenueBDT * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <span>epharmacy Health Wallet</span>
                    </span>
                    <span className="text-slate-900">5% • ৳{Math.round(totalRevenueBDT * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLIENTS & CUSTOMER DIRECTORY                                       */}
      {/* ========================================================================= */}
      {activeAdminTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder={t('Search clients by name, phone, district...', 'নাম, মোবাইল বা জেলা দিয়ে গ্রাহক খুঁজুন...')}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              {t('Total Registered Patients:', 'মোট নিবন্ধিত রোগী:')} <strong className="text-slate-800">{clients.length}</strong>
            </div>
          </div>

          {/* Clients Directory Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">{t('Client Name & Contact', 'গ্রাহকের নাম ও ফোন')}</th>
                    <th className="p-4">{t('Delivery District', 'ঠিকানা / এলাকা')}</th>
                    <th className="p-4">{t('Orders Placed', 'মোট অর্ডার')}</th>
                    <th className="p-4">{t('Lifetime Spend', 'মোট খরচ (৳)')}</th>
                    <th className="p-4">{t('Wallet Balance', 'ওয়ালেট ব্যালেন্স')}</th>
                    <th className="p-4">{t('Care Subscription', 'সাবস্ক্রিপশন')}</th>
                    <th className="p-4 text-right">{t('Action', 'অ্যাকশন')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <div className="font-black text-slate-900 text-sm">{client.name}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{client.phone}</span>
                          <span>•</span>
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{client.email}</span>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{client.district}</span>
                        </div>
                      </td>

                      <td className="p-4 font-black text-slate-900">
                        {client.totalOrders} {t('Orders', 'টি')}
                      </td>

                      <td className="p-4 font-black text-emerald-700">
                        ৳{client.totalSpent.toLocaleString()}
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">৳{client.walletBalance}</div>
                        <div className="text-[10px] text-amber-600 font-bold">🌟 {client.loyaltyPoints} pts</div>
                      </td>

                      <td className="p-4">
                        {client.activePlan !== 'None' ? (
                          <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {client.activePlan}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Regular</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedClientForWallet(client)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer border border-purple-200"
                        >
                          + ৳ Credit Wallet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ORDERS & DISPATCH MANAGEMENT                                       */}
      {/* ========================================================================= */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{t('Filter by Status:', 'স্ট্যাটাস অনুসারে ফিল্টার:')}</span>
              {['all', 'confirmed', 'presc_verified', 'packed', 'rider_assigned', 'out_for_delivery', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer capitalize ${
                    orderStatusFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Showing: <strong className="text-slate-800">{filteredOrders.length}</strong> orders
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">#{ord.orderNumber}</span>
                      <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-md">
                        {ord.paymentMethod} (৳{ord.total})
                      </span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        {ord.deliveryType === 'express' ? '⚡ Express 2-Hr' : '📦 Standard'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {ord.customerName} • {ord.phone} • {ord.address}, {ord.district}
                    </div>
                  </div>

                  {/* Stage Advance Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold">{t('Change Status:', 'ধাপ পরিবর্তন:')}</span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                      className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="confirmed">1. Order Confirmed</option>
                      <option value="presc_verified">2. Prescription Verified (A-Grade Rx)</option>
                      <option value="packed">3. Packed in Cold Bag</option>
                      <option value="rider_assigned">4. Rider Assigned</option>
                      <option value="out_for_delivery">5. Out for Delivery</option>
                      <option value="delivered">6. Delivered & Completed</option>
                    </select>
                  </div>
                </div>

                {/* Items & Rider assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1.5">{t('Medicine Items:', 'অর্ডারের পণ্যসমূহ:')}</span>
                    <div className="space-y-1.5">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div>
                            <span className="font-bold text-slate-800">{item.medicine.name}</span>
                            <span className="text-slate-400 text-[10px] ml-1.5">
                              ({item.quantity} × {item.unitChoice})
                            </span>
                          </div>
                          <span className="font-black text-slate-900">৳{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1.5">{t('Delivery Rider Assignment:', 'ডেলিভারি রাইডার তথ্য:')}</span>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rider:</span>
                        <strong className="text-slate-800">{ord.riderName || 'Md. Rafiqul Islam'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact:</span>
                        <strong className="text-slate-800">{ord.riderPhone || '01823-998877'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Motorbike:</span>
                        <strong className="text-slate-800">{ord.riderBikeNo || 'Dhaka-Metro-Ha-3421'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DOCTOR TELEHEALTH CONSULTATIONS                                    */}
      {/* ========================================================================= */}
      {activeAdminTab === 'doctors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">{t('Patient Details', 'রোগীর তথ্য')}</th>
                    <th className="p-4">{t('Doctor Name', 'ডাক্তারের নাম')}</th>
                    <th className="p-4">{t('Health Complaint', 'সমস্যা / লক্ষণ')}</th>
                    <th className="p-4">{t('Slot & Fee', 'সময় ও ফি')}</th>
                    <th className="p-4">{t('Status', 'স্ট্যাটাস')}</th>
                    <th className="p-4 text-right">{t('Action', 'অ্যাকশন')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <div className="font-black text-slate-900 text-sm">{apt.patientName}</div>
                        <div className="text-slate-500 text-[11px]">{apt.patientGender}, {apt.patientAge} yrs • {apt.phone}</div>
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {apt.doctorName}
                      </td>

                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {apt.problem}
                      </td>

                      <td className="p-4">
                        <div className="font-black text-slate-900">{apt.date} at {apt.slot}</div>
                        <div className="text-emerald-700 font-bold">৳{apt.feeBDT} ({apt.paymentMethod})</div>
                      </td>

                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[10px] font-black capitalize">
                          {apt.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setActiveTab('doctor_portal');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer"
                        >
                          Doctor Portal →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW MEDICINE TO INVENTORY                                    */}
      {/* ========================================================================= */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span>{t('Catalog New Medicine to Inventory', 'নতুন ঔষধ ইনভেন্টরিতে যুক্ত করুন')}</span>
            </h3>

            <form onSubmit={handleCreateMedicine} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Medicine Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Napa One 1000mg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={newMedGeneric}
                    onChange={(e) => setNewMedGeneric(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Strength</label>
                  <input
                    type="text"
                    value={newMedStrength}
                    onChange={(e) => setNewMedStrength(e.target.value)}
                    placeholder="e.g. 1000mg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                  <select
                    value={newMedCategory}
                    onChange={(e) => setNewMedCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="fever_pain">Fever & Pain</option>
                    <option value="gastric">Gastric & Acidity</option>
                    <option value="beauty_skincare">Beauty & Skincare</option>
                    <option value="pediatric">Baby Care & Mother</option>
                    <option value="devices">Medical Devices</option>
                    <option value="vitamins">Vitamins & Energy</option>
                    <option value="diabetes">Diabetes Care</option>
                    <option value="allergy_cough">Allergy & Cough</option>
                    <option value="cardiac">Heart & BP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Manufacturer</label>
                  <select
                    value={newMedCompany}
                    onChange={(e) => setNewMedCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Square Pharmaceuticals Ltd.">Square Pharmaceuticals Ltd.</option>
                    <option value="Beximco Pharmaceuticals Ltd.">Beximco Pharmaceuticals Ltd.</option>
                    <option value="Incepta Pharmaceuticals Ltd.">Incepta Pharmaceuticals Ltd.</option>
                    <option value="Healthcare Pharmaceuticals Ltd.">Healthcare Pharmaceuticals Ltd.</option>
                    <option value="Renata Ltd.">Renata Ltd.</option>
                    <option value="Acme Laboratories Ltd.">Acme Laboratories Ltd.</option>
                    <option value="Aristopharma Ltd.">Aristopharma Ltd.</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Unit Price (BDT ৳)</label>
                  <input
                    type="number"
                    value={newMedPrice}
                    onChange={(e) => setNewMedPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    value={newMedStock}
                    onChange={(e) => setNewMedStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={newMedImage}
                  onChange={(e) => setNewMedImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isRxCheck"
                  checked={newMedIsRx}
                  onChange={(e) => setNewMedIsRx(e.target.checked)}
                  className="rounded text-purple-600"
                />
                <label htmlFor="isRxCheck" className="text-xs font-bold text-slate-700">
                  Prescription Required (Rx)
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/20 transition cursor-pointer"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CLIENT WALLET CREDIT MODAL                                       */}
      {/* ========================================================================= */}
      {selectedClientForWallet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {t('Credit Client Health Wallet', 'গ্রাহকের ওয়ালেটে টাকা যোগ করুন')}
            </h3>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
              <div>Client: <strong>{selectedClientForWallet.name}</strong></div>
              <div>Phone: <strong>{selectedClientForWallet.phone}</strong></div>
              <div>Current Balance: <strong className="text-emerald-700">৳{selectedClientForWallet.walletBalance}</strong></div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t('Credit Amount (BDT ৳):', 'যোগ করার পরিমাণ (৳):')}
              </label>
              <input
                type="number"
                value={walletAddAmount}
                onChange={(e) => setWalletAddAmount(e.target.value)}
                placeholder="200"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedClientForWallet(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddClientWallet}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs transition cursor-pointer"
              >
                Add ৳{walletAddAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DEDICATED UPDATE STOCK MODAL                                     */}
      {/* ========================================================================= */}
      {updateStockModalMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {t('Update Medicine Stock', 'ঔষধের স্টক আপডেট')}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {updateStockModalMed.manufacturer}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUpdateStockModalMed(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Medicine Summary Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <img
                src={updateStockModalMed.image}
                alt={updateStockModalMed.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 text-xs truncate">
                  {updateStockModalMed.name}
                </h4>
                <div className="text-[11px] text-slate-500 truncate">
                  {updateStockModalMed.generic} • {updateStockModalMed.strength}
                </div>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                  Current Stock: <strong className="text-purple-700">{updateStockModalMed.stockCount} {updateStockModalMed.unitType}s</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleModalSaveStock} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {t('New Stock Quantity (Units/Strips):', 'নতুন স্টক সংখ্যা (পিস/পাতা):')}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={modalStockInput}
                  onChange={(e) => setModalStockInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-black text-slate-900 outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>

              {/* Quick Restock Preset Chips */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t('Quick Restock Presets:', 'দ্রুত স্টক যোগ করুন:')}
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalStockInput(modalStockInput + 10)}
                    className="py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-bold transition border border-slate-200 cursor-pointer"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStockInput(modalStockInput + 25)}
                    className="py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-bold transition border border-slate-200 cursor-pointer"
                  >
                    +25
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStockInput(modalStockInput + 50)}
                    className="py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-bold transition border border-slate-200 cursor-pointer"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalStockInput(modalStockInput + 100)}
                    className="py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-bold transition border border-slate-200 cursor-pointer"
                  >
                    +100
                  </button>
                </div>
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => setModalStockInput(0)}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold transition cursor-pointer"
                  >
                    {t('⚠ Mark Out of Stock (Set to 0)', '⚠ স্টক আউট হিসেবে চিহ্নিত করুন (০)')}
                  </button>
                </div>
              </div>

              {/* Optional Unit Price Adjustment */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {t('Unit Retail Price (BDT ৳):', 'খুচরা মূল্য (৳):')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">৳</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={modalPriceInput}
                    onChange={(e) => setModalPriceInput(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateStockModalMed(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('Save Stock Update', 'স্টক সংরক্ষণ করুন')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
