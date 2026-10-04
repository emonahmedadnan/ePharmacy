import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  Sparkles,
  Flame,
  ShieldCheck,
  Star,
  Info,
  ChevronRight,
  Plus,
  Truck,
  HeartHandshake,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Medicine } from '../types';

export const HomePage: React.FC = () => {
  const {
    medicines,
    setSelectedCategory,
    setActiveTab,
    setIsPrescriptionModalOpen,
    addToCart,
    t,
  } = useApp();

  // Master Categories with rich images, icons and descriptions
  const categories = [
    {
      id: 'fever_pain',
      name: t('Fever & Pain', 'জ্বর ও ব্যথা'),
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      tagline: t('Paracetamol & Relief', 'প্যারাসিটামল ও পেইন'),
    },
    {
      id: 'gastric',
      name: t('Gastric & Acidity', 'গ্যাস্ট্রিক ও এসিডিটি'),
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
      tagline: t('Ulcer & Acid Care', 'এসিডিটি ও আলসার'),
    },
    {
      id: 'beauty_skincare',
      name: t('Beauty & Skincare', 'বিউটি ও রূপচর্চা'),
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
      tagline: t('Dermatology Care', 'স্কিন ও রূপচর্চা'),
    },
    {
      id: 'pediatric',
      name: t('Baby & Mother Care', 'মা ও শিশুর যত্ন'),
      icon: Star,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
      tagline: t('Diapers & Mild Care', 'ডায়াপার ও যত্ন'),
    },
    {
      id: 'devices',
      name: t('Medical Devices', 'মেডিকেল ডিভাইস'),
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&auto=format&fit=crop&q=80',
      tagline: t('Monitors & Meters', 'বিপি ও গ্লুকোমিটার'),
    },
    {
      id: 'vitamins',
      name: t('Vitamins & Energy', 'ভিটামিন ও পুষ্টি'),
      icon: HeartHandshake,
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
      tagline: t('Immunity Boost', 'রোগ প্রতিরোধ ও শক্তি'),
    },
    {
      id: 'womens_care',
      name: t('Women\'s Hygiene', 'নারীদের যত্ন ও হাইজিন'),
      icon: HeartHandshake,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
      tagline: t('Sanitary & Care', 'প্যাড ও হাইজিন'),
    },
    {
      id: 'diabetes',
      name: t('Diabetes Care', 'ডায়াবেটিস কেয়ার'),
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1550572017-4fcdbb590e5b?w=400&auto=format&fit=crop&q=80',
      tagline: t('Glucose Control', 'সুগার নিয়ন্ত্রণ'),
    },
    {
      id: 'allergy_cough',
      name: t('Allergy & Cough', 'কাশি ও অ্যালার্জি'),
      icon: Info,
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
      tagline: t('Cold & Cough Relief', 'সর্দি ও কাশি উপশম'),
    },
    {
      id: 'cardiac',
      name: t('Heart & BP Care', 'হৃদরোগ ও রক্তচাপ'),
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80',
      tagline: t('Cardiovascular', 'উচ্চ রক্তচাপ নিয়ন্ত্রণ'),
    },
  ];

  // Item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    medicines.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [medicines]);

  // Total sales count per category
  const categorySoldCounts = useMemo(() => {
    const sales: Record<string, number> = {};
    medicines.forEach((m) => {
      const sold = m.salesCount || 0;
      sales[m.category] = (sales[m.category] || 0) + sold;
    });
    return sales;
  }, [medicines]);

  // Navigate to Shop page with selected category
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render a clean preview product card
  const renderProductCard = (med: Medicine) => (
    <div
      key={med.id}
      className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
    >
      <div>
        <div className="relative rounded-2xl overflow-hidden mb-3 aspect-4/3 bg-slate-50 border border-slate-100 flex items-center justify-center">
          <img
            src={med.image}
            alt={med.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';
            }}
          />
          {med.discountPercentage && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              {med.discountPercentage}% OFF
            </div>
          )}
          {med.isRxRequired && (
            <div
              className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs"
              title="Prescription Required"
            >
              Rx
            </div>
          )}
        </div>

        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate mb-0.5">
          {med.manufacturer.split(' ')[0]}
        </div>

        <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition truncate">
          {med.name}
        </h3>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {med.generic}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-3">
        <div>
          <div className="text-base font-black text-slate-900">
            ৳{med.pricePerUnit}
          </div>
          <div className="text-[10px] text-slate-400">/ {med.unitType}</div>
        </div>

        <button
          onClick={() => addToCart(med, 1, 'strip')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
          title="Add to cart"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('Add', 'যোগ করুন')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* 1. Hero Banners Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Hero Card */}
        <div className="md:col-span-2 bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[230px]">
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold px-3 py-0.5 rounded-full mb-3 backdrop-blur-xs">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('⚡ 2-Hour Express Delivery in Dhaka', '⚡ ঢাকায় ২ ঘণ্টায় এক্সপ্রেস হোম ডেলিভারি')}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
              {t('Order Genuine Medicines & Beauty Care at Best Prices', '১০০% আসল ঔষধ ও বিউটি কেয়ার সেরা মূল্যে অর্ডার করুন')}
            </h1>
            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              {t(
                'Square, Beximco, Incepta, Cetaphil & CeraVe sourced directly with certified quality. Cash on Delivery & bKash available.',
                'স্কয়ার, বেক্সিমকো, সেটাফিল ও সেরাভির আসল পণ্য। ক্যাশ অন ডেলিভারি ও বিকাশে পরিশোধের সুবিধা।'
              )}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-emerald-900 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>{t('Upload Prescription', 'প্রেসক্রিপশন আপলোড করুন')}</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <span>{t('Visit Medicine Shop', 'সম্পূর্ণ শপ দেখুন')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-teal-400/10 pointer-events-none" />
        </div>

        {/* Side Callout Banner: Care Subscription */}
        <div
          onClick={() => setActiveTab('subscriptions')}
          className="bg-linear-to-b from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
              {t('Arogga Care Plan', 'মান্থলি কেয়ার সাবস্ক্রিপশন')}
            </span>
            <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-2">
              {t('Get Flat 15% OFF Every Month', 'নিয়মিত পণ্যে প্রতিমাসে ১৫% নিশ্চিত সাশ্রয়')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Auto-delivery for diabetic, beauty & cardiac medicines with free home delivery.',
                'ডায়াবেটিস, রূপচর্চা ও নিত্যপ্রয়োজনীয় পণ্যে ঝামেলামুক্ত মাসিক অটো-রিফিল।'
              )}
            </p>
          </div>

          <div className="pt-4 flex items-center gap-1 text-xs font-bold text-amber-900 group-hover:text-amber-700">
            <span>{t('Explore Monthly Plans', 'প্ল্যানসমূহ দেখুন')}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. Square Category Grid (ছবি, নিচে ক্যাটাগরির নাম, কতটি আছে ও কতটি সোল্ড আউট) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>{t('Browse by Categories', 'ক্যাটাগরি অনুযায়ী পণ্যসমূহ')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                'Click any category to open the Shop page with live stock & smart filter tools.',
                'যেকোনো ক্যাটাগরিতে ক্লিক করলে শপ পেজে সেই ক্যাটাগরির সকল পণ্য ফিল্টারসহ ওপেন হবে।'
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="self-start sm:self-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <span>{t('View All in Shop', 'শপে সকল পণ্য দেখুন')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Square Cards Grid (Wrapped row by row, responsive 2 to 6 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const sold = categorySoldCounts[cat.id] || 0;
            const formattedSold = sold >= 1000 ? `${(sold / 1000).toFixed(1)}k+` : `${sold || 180}+`;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className="group flex flex-col justify-between p-3 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 cursor-pointer text-left relative overflow-hidden bg-white"
              >
                {/* Square Image Box with Overlay Badges */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 mb-2.5 border border-slate-100 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Gradient shade at bottom */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/65 via-slate-900/10 to-transparent pointer-events-none" />

                  {/* Category Icon Badge in top-left */}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-xs text-emerald-700">
                    <cat.icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Top-Right Arrow Hint */}
                  <div className="absolute top-2 right-2 bg-slate-900/40 backdrop-blur-xs text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition">
                    <ArrowRight className="w-3 h-3" />
                  </div>

                  {/* Items Count & Sold Count Badges inside image */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-black">
                    <span className="bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {count} {t('Items', 'টি')}
                    </span>
                    <span className="bg-amber-500/95 backdrop-blur-xs text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-white" />
                      <span>{formattedSold}</span>
                    </span>
                  </div>
                </div>

                {/* Category Text & Stats Info */}
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 text-xs sm:text-sm leading-snug truncate group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-semibold truncate">
                    {cat.tagline}
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-600">
                      {count} {t('Products', 'পণ্য')}
                    </span>
                    <span className="font-extrabold text-amber-700 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-amber-500" />
                      <span>{formattedSold} {t('Sold', 'সোল্ড')}</span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Preview Sections (২ লাইনের সেরা পণ্য + 'See All in Shop' বাটন) */}
      <div className="space-y-10">
        {/* Section A: Essential Medicines */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                💊
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {t('Essential Medicines (Fever, Pain & Acidity)', 'নিত্যপ্রয়োজনীয় ঔষধ (জ্বর, ব্যথা ও গ্যাস্ট্রিক)')}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('Top doctor-prescribed medications directly from factories.', 'সরাসরি প্রস্তুতকারক ফ্যাক্টরি থেকে সংগৃহীত খাঁটি ঔষধ।')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCategoryClick('fever_pain')}
              className="group flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-emerald-200"
            >
              <span>{t('See All in Shop', 'শপে সব ঔষধ দেখুন')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {medicines
              .filter((m) => ['fever_pain', 'gastric', 'allergy_cough'].includes(m.category))
              .slice(0, 4)
              .map(renderProductCard)}
          </div>
        </section>

        {/* Section B: Beauty & Skincare */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
                💄
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {t('Beauty & Skincare (Dermatologist Tested)', 'বিউটি ও স্কিনকেয়ার (চর্মরোগ বিশেষজ্ঞ প্রস্তাবিত)')}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('Cetaphil, CeraVe, Bioderma & Himalaya personal care.', 'সেটাফিল, সেরাভি, বায়োডার্মা ও হিমালয়া আসল রূপচর্চা পণ্য।')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCategoryClick('beauty_skincare')}
              className="group flex items-center gap-1 text-xs font-bold text-pink-700 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-pink-200"
            >
              <span>{t('See All in Shop', 'শপে সব বিউটি দেখুন')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {medicines
              .filter((m) => m.category === 'beauty_skincare')
              .slice(0, 4)
              .map(renderProductCard)}
          </div>
        </section>

        {/* Section C: Baby Care & Mother */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                👶
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {t('Baby & Mother Care', 'মা ও শিশুর যত্ন')}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('Diapers, gentle tear-free baby wash & moisturizing creams.', 'হাগিস ডায়াপার, জনসনস বেবি বাথ ও সেবামেড শিশুর ক্রিম।')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCategoryClick('pediatric')}
              className="group flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-amber-200"
            >
              <span>{t('See All in Shop', 'শপে শিশুর সব পণ্য দেখুন')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {medicines
              .filter((m) => m.category === 'pediatric')
              .slice(0, 4)
              .map(renderProductCard)}
          </div>
        </section>

        {/* Section D: Medical Devices & Health Monitors */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                🩺
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {t('Medical Devices & Health Monitors', 'মেডিকেল ডিভাইস ও মনিটর')}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('Accu-Chek glucometers, Omron digital BP monitors & thermometers.', 'আকুচেক ডায়াবেটিস মেশিন, ওমরন বিপি মনিটর ও থার্মোমিটার।')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCategoryClick('devices')}
              className="group flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition cursor-pointer border border-blue-200"
            >
              <span>{t('See All in Shop', 'শপে সব ডিভাইস দেখুন')}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {medicines
              .filter((m) => m.category === 'devices')
              .slice(0, 4)
              .map(renderProductCard)}
          </div>
        </section>
      </div>

      {/* 4. Trust Badges Footer Bar */}
      <div className="bg-slate-100/90 rounded-3xl p-6 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">
            {t('100% Genuine', '১০০% আসল পণ্য')}
          </h4>
          <p className="text-[10px] text-slate-500">
            {t('Direct pharmaceutical stock', 'সরাসরি ফ্যাক্টরি সরবরাহ')}
          </p>
        </div>

        <div className="space-y-1">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">
            {t('2-Hour Express', '২ ঘণ্টায় ডেলিভারি')}
          </h4>
          <p className="text-[10px] text-slate-500">
            {t('Anywhere in Dhaka metro', 'ঢাকা সিটির যেকোনো প্রান্তে')}
          </p>
        </div>

        <div className="space-y-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">
            {t('Pharmacist Verified', 'ফার্মাসিস্ট ভেরিফাইড')}
          </h4>
          <p className="text-[10px] text-slate-500">
            {t('Certified A-Grade checking', 'বিশেষজ্ঞ দ্বারা পরীক্ষিত')}
          </p>
        </div>

        <div className="space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900">
            {t('Cash & bKash', 'ক্যাশ অন ডেলিভারি')}
          </h4>
          <p className="text-[10px] text-slate-500">
            {t('Safe payment on doorstep', 'পণ্য বুঝে পেয়ে মূল্য পরিশোধ')}
          </p>
        </div>
      </div>
    </div>
  );
};
