import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ShoppingCart,
  Upload,
  Sparkles,
  Flame,
  ShieldCheck,
  Star,
  Info,
  ChevronRight,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  X,
  HeartHandshake,
  Activity,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Coins,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { Medicine } from '../types';
import { normalizeBanglaVoiceSearch } from '../utils/banglaVoiceSearch';

export const MedicineCatalog: React.FC = () => {
  const {
    medicines,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addToCart,
    setIsPrescriptionModalOpen,
    setActiveTab,
    t,
  } = useApp();

  const [unitSelection, setUnitSelection] = useState<Record<string, 'strip' | 'box'>>({});

  // Smart Filter States (exclusively on this Shop page)
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [pricePreset, setPricePreset] = useState<'all' | 'under_50' | '50_150' | '150_500' | 'above_500'>('all');
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(1500);
  const [isCustomPriceActive, setIsCustomPriceActive] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Master Categories List
  const categories = [
    { id: 'all', name: t('All Categories', 'সকল পণ্য'), icon: Activity },
    { id: 'fever_pain', name: t('Fever & Pain', 'জ্বর ও ব্যথা'), icon: Flame },
    { id: 'gastric', name: t('Gastric & Acidity', 'গ্যাস্ট্রিক ও এসিডিটি'), icon: ShieldCheck },
    { id: 'beauty_skincare', name: t('Beauty & Skincare', 'বিউটি ও রূপচর্চা'), icon: Sparkles },
    { id: 'pediatric', name: t('Baby Care & Mother', 'মা ও শিশুর যত্ন'), icon: Star },
    { id: 'devices', name: t('Medical Devices', 'মেডিকেল ডিভাইস'), icon: Activity },
    { id: 'vitamins', name: t('Vitamins & Energy', 'ভিটামিন ও পুষ্টি'), icon: HeartHandshake },
    { id: 'womens_care', name: t('Women\'s Hygiene', 'নারীদের যত্ন ও হাইজিন'), icon: HeartHandshake },
    { id: 'diabetes', name: t('Diabetes Care', 'ডায়াবেটিস কেয়ার'), icon: Activity },
    { id: 'allergy_cough', name: t('Allergy & Cough', 'কাশি ও অ্যালার্জি'), icon: Info },
    { id: 'cardiac', name: t('Heart & BP', 'হৃদরোগ ও রক্তচাপ'), icon: Activity },
  ];

  // Dynamically extract unique brands with counts
  const availableBrands = useMemo(() => {
    const brandMap: Record<string, number> = {};
    medicines.forEach((m) => {
      brandMap[m.manufacturer] = (brandMap[m.manufacturer] || 0) + 1;
    });
    return Object.entries(brandMap).sort((a, b) => b[1] - a[1]);
  }, [medicines]);

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: medicines.length };
    medicines.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [medicines]);

  // Filter medicines based on Category, Brand, Price Range, In-Stock, and Search Query
  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      // 1. Drug Category Filter
      const matchesCat = selectedCategory === 'all' || med.category === selectedCategory;
      if (!matchesCat) return false;

      // 2. Brand / Manufacturer Filter
      const matchesBrand = selectedBrand === 'all' || med.manufacturer === selectedBrand;
      if (!matchesBrand) return false;

      // 3. Price Range Filter
      const price = med.pricePerUnit;
      if (isCustomPriceActive) {
        if (price > customMaxPrice) return false;
      } else if (pricePreset !== 'all') {
        if (pricePreset === 'under_50' && price >= 50) return false;
        if (pricePreset === '50_150' && (price < 50 || price > 150)) return false;
        if (pricePreset === '150_500' && (price < 150 || price > 500)) return false;
        if (pricePreset === 'above_500' && price <= 500) return false;
      }

      // 4. In Stock Filter
      if (inStockOnly && (!med.inStock || med.stockCount <= 0)) return false;

      // 5. Search Query Filter (Supports English, Bangla, and Phonetic Voice)
      const rawQ = searchQuery.toLowerCase().trim();
      if (!rawQ) return true;

      const normalizedVoice = normalizeBanglaVoiceSearch(rawQ);
      const matchedVoice = normalizedVoice.matchedMedicineName.toLowerCase();

      const matchesSearch =
        med.name.toLowerCase().includes(rawQ) ||
        (med.nameBn && med.nameBn.includes(rawQ)) ||
        med.generic.toLowerCase().includes(rawQ) ||
        (med.genericBn && med.genericBn.includes(rawQ)) ||
        med.manufacturer.toLowerCase().includes(rawQ) ||
        med.category.toLowerCase().includes(rawQ) ||
        (med.searchKeywords && med.searchKeywords.some((k) => k.includes(rawQ) || rawQ.includes(k))) ||
        (matchedVoice &&
          (med.name.toLowerCase().includes(matchedVoice) ||
            med.generic.toLowerCase().includes(matchedVoice)));

      return matchesSearch;
    });
  }, [
    medicines,
    selectedCategory,
    selectedBrand,
    pricePreset,
    isCustomPriceActive,
    customMaxPrice,
    inStockOnly,
    searchQuery,
  ]);

  // Sort filtered medicines
  const sortedMedicines = useMemo(() => {
    return [...filteredMedicines].sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return b.salesCount - a.salesCount;
    });
  }, [filteredMedicines, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    pricePreset !== 'all' ||
    isCustomPriceActive ||
    inStockOnly ||
    searchQuery.trim() !== '';

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPricePreset('all');
    setIsCustomPriceActive(false);
    setCustomMaxPrice(1500);
    setInStockOnly(false);
    setSearchQuery('');
  };

  const getUnitChoice = (medId: string): 'strip' | 'box' => {
    return unitSelection[medId] || 'strip';
  };

  const handleUnitToggle = (medId: string, choice: 'strip' | 'box') => {
    setUnitSelection((prev) => ({ ...prev, [medId]: choice }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Shop Page Header with Breadcrumb & Back to Home */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>{t('Back to Home', 'হোমপেজে ফিরে যান')}</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{t('Medicine & Health Store', 'ঔষধ ও স্বাস্থ্য পণ্যের শপ')}</span>
              <span className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                {sortedMedicines.length} {t('Products', 'টি পণ্য')}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                'Filter by category, manufacturer brand, price range & stock availability',
                'ক্যাটাগরি, প্রস্তুতকারক ব্র্যান্ড ও মূল্য সীমা অনুযায়ী অনুসন্ধান করুন'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('Clear Filters', 'ফিল্টার রিসেট')}</span>
            </button>
          )}

          <button
            onClick={() => setIsPrescriptionModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Upload Prescription', 'প্রেসক্রিপশন আপলোড')}</span>
            <span className="sm:hidden">{t('Upload Rx', 'প্রেসক্রিপশন')}</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Category Horizontal Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <cat.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-emerald-800/80 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. The Smart Filter Controls Bar (Exclusively on this Shop page) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          {/* A. Drug Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-emerald-600" />
              <span>{t('Drug Category', 'ঔষধ ক্যাটাগরি')}</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500 text-xs transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({categoryCounts[c.id] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* B. Brand / Manufacturer Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-600" />
              <span>{t('Brand / Company', 'ব্র্যান্ড / কোম্পানি')}</span>
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500 text-xs transition"
            >
              <option value="all">{t('All Brands (সকল কোম্পানি)', 'সকল কোম্পানি')} ({medicines.length})</option>
              {availableBrands.map(([brand, count]) => (
                <option key={brand} value={brand}>
                  {brand.replace(' Ltd.', '').replace(' Pharmaceuticals', ' Pharma')} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* C. Price Range Preset Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-600" />
              <span>{t('Price Range', 'মূল্য সীমা')}</span>
            </label>
            <select
              value={isCustomPriceActive ? 'custom' : pricePreset}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomPriceActive(true);
                  setShowAdvancedFilters(true);
                } else {
                  setIsCustomPriceActive(false);
                  setPricePreset(e.target.value as any);
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500 text-xs transition"
            >
              <option value="all">{t('All Prices (সকল মূল্য)', 'সকল মূল্য')}</option>
              <option value="under_50">{t('Under ৳50 (সাশ্রয়ী)', '৳৫০ এর নিচে')}</option>
              <option value="50_150">{t('৳50 - ৳150', '৳৫০ - ৳১৫০')}</option>
              <option value="150_500">{t('৳150 - ৳500', '৳১৫০ - ৳৫০০')}</option>
              <option value="above_500">{t('Above ৳500 (ডিভাইস/বক্স)', '৳৫০০ এর উপরে')}</option>
              <option value="custom">{t('Custom Price Slider ⚙️', 'কাস্টম মূল্য রেঞ্জ ⚙️')}</option>
            </select>
          </div>

          {/* D. Sort By Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
              <span>{t('Sort By', 'সাজান')}</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-emerald-500 text-xs transition"
            >
              <option value="popularity">{t('Most Sold (জনপ্রিয়)', 'সর্বাধিক বিক্রিত')}</option>
              <option value="price_asc">{t('Price: Low to High', 'মূল্য: কম থেকে বেশি')}</option>
              <option value="price_desc">{t('Price: High to Low', 'মূল্য: বেশি থেকে কম')}</option>
              <option value="rating">{t('Highest Rated', 'সর্বোচ্চ রেটিং')}</option>
            </select>
          </div>

          {/* E. In-Stock Toggle & Expand Button */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-1 flex items-end gap-2">
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`flex-1 py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                inStockOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${inStockOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('In Stock', 'স্টকে আছে')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                showAdvancedFilters || isCustomPriceActive
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Advanced Price Slider & Quick Brands"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Advanced Price Slider & Quick Brand Chips */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Interactive Price Range Slider */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('Maximum Price Limit:', 'সর্বোচ্চ মূল্য সীমা:')}</span>
                  <strong className="text-emerald-700 text-sm font-black">৳{customMaxPrice}</strong>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">৳10 — ৳3,000+</span>
              </div>
              <input
                type="range"
                min="20"
                max="2500"
                step="20"
                value={customMaxPrice}
                onChange={(e) => {
                  setCustomMaxPrice(Number(e.target.value));
                  setIsCustomPriceActive(true);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Quick Brand Badges Selection */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                {t('Popular Bangladeshi Brands (১-ক্লিকে ফিল্টার):', 'জনপ্রিয় ওষুধ প্রস্তুতকারক:')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    selectedBrand === 'all'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t('All Brands', 'সকল ব্র্যান্ড')}
                </button>
                {availableBrands.slice(0, 8).map(([brand, count]) => {
                  const shortName = brand.split(' ')[0];
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(isSelected ? 'all' : brand)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{shortName}</span>
                      <span
                        className={`text-[10px] px-1 rounded-full ${
                          isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Badges Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">{t('Active Filters:', 'সক্রিয় ফিল্টার:')}</span>

              {/* Category chip */}
              {selectedCategory !== 'all' && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>{categories.find((c) => c.id === selectedCategory)?.name}</span>
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              )}

              {/* Brand chip */}
              {selectedBrand !== 'all' && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>{selectedBrand.split(' ')[0]}</span>
                  <button onClick={() => setSelectedBrand('all')} className="hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              )}

              {/* Price preset chip */}
              {!isCustomPriceActive && pricePreset !== 'all' && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>
                    {pricePreset === 'under_50'
                      ? 'Under ৳50'
                      : pricePreset === '50_150'
                      ? '৳50 - ৳150'
                      : pricePreset === '150_500'
                      ? '৳150 - ৳500'
                      : 'Above ৳500'}
                  </span>
                  <button onClick={() => setPricePreset('all')} className="hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              )}

              {/* Custom price chip */}
              {isCustomPriceActive && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>Max: ৳{customMaxPrice}</span>
                  <button
                    onClick={() => {
                      setIsCustomPriceActive(false);
                      setCustomMaxPrice(1500);
                    }}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* In-Stock chip */}
              {inStockOnly && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>In-Stock Only</span>
                  <button onClick={() => setInStockOnly(false)} className="hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              )}

              {/* Search query chip */}
              {searchQuery.trim() && (
                <span className="bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-600 cursor-pointer">
                    ×
                  </button>
                </span>
              )}

              {/* Clear all link */}
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-rose-600 hover:text-rose-700 font-bold text-[11px] flex items-center gap-1 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('Clear All', 'সকল ফিল্টার মুছুন')}</span>
              </button>
            </div>

            <div className="text-[11px] font-semibold text-slate-500">
              {t('Found', 'পাওয়া গেছে')}: <strong className="text-slate-800">{sortedMedicines.length}</strong> {t('products', 'টি পণ্য')}
            </div>
          </div>
        )}
      </div>

      {/* 4. Products Grid */}
      <div>
        {sortedMedicines.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">
              {t('No medicine found matching your filters', 'ফিল্টারের সাথে কোনো ঔষধ পাওয়া যায়নি')}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t(
                'Try adjusting your brand, category, or price range filters to view more items.',
                'অন্যান্য ব্র্যান্ড, ক্যাটাগরি বা মূল্য সীমা নির্বাচন করে পুনরায় দেখুন।'
              )}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('Reset Filters', 'ফিল্টার রিসেট করুন')}</span>
              </button>
              <button
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
              >
                {t('Upload Prescription', 'প্রেসক্রিপশন আপলোড')}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedMedicines.map((med) => {
              const choice = getUnitChoice(med.id);
              const price = choice === 'box' && med.pricePerBox ? med.pricePerBox : med.pricePerUnit;

              return (
                <div
                  key={med.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges & Image */}
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

                      {(med.stockCount <= 0 || !med.inStock) && (
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-rose-600/95 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                            {t('Stock Out', 'স্টক আউট')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Manufacturer Company Name */}
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate mb-0.5">
                      {med.manufacturer.split(' ')[0]}
                    </div>

                    {/* Product Name & Sold Count */}
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition flex items-center justify-between gap-1.5">
                      <span className="truncate">{med.name}</span>
                      <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{med.salesCount.toLocaleString()} {t('Sold', 'সোল্ড')}</span>
                      </span>
                    </h3>

                    {/* Strip vs Box selector if available */}
                    {med.pricePerBox && (
                      <div className="flex gap-1 my-2">
                        <button
                          type="button"
                          onClick={() => handleUnitToggle(med.id, 'strip')}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition border cursor-pointer ${
                            choice === 'strip'
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          Strip
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUnitToggle(med.id, 'box')}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition border cursor-pointer ${
                            choice === 'box'
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          Box (Save 5%)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price & Add to Cart button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        ৳{price}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        / {choice === 'box' ? 'Box' : med.unitType}
                      </div>
                    </div>

                    {med.stockCount <= 0 || !med.inStock ? (
                      <button
                        disabled
                        className="bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-not-allowed flex items-center gap-1 opacity-90"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t('Stock Out', 'স্টক আউট')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(med, 1, choice)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition cursor-pointer"
                        title="Add to cart"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('Add', 'যোগ করুন')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
