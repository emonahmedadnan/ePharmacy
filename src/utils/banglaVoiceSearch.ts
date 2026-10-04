/**
 * Bangla Voice Search Normalizer & Dictionary for Bangladeshi Pharmacy
 * Translates Bengali speech, Banglish, and colloquial voice transcripts into exact medicine queries.
 */

export interface VoiceMappingResult {
  originalText: string;
  cleanedText: string;
  matchedMedicineName: string;
  suggestedCategory?: string;
  isBangla: boolean;
}

// Common Bengali medicine names and keywords mapped to catalog entries
export const BANGLA_MEDICINE_DICTIONARY: Record<string, string> = {
  // Fever & Pain
  'নাপা': 'Napa',
  'নাপা এক্সট্রা': 'Napa Extra',
  'নাপা একস্ট্রা': 'Napa Extra',
  'নাপা এক্ট্রা': 'Napa Extra',
  'নাপা এক্সটা': 'Napa Extra',
  'ন্যাপা': 'Napa',
  'প্যারাসিটামল': 'Paracetamol',
  'প্যারাসিটামল ৫০০': 'Napa Extra',
  'এইস': 'Ace',
  'এইস প্লাস': 'Ace Plus',
  'এস প্লাস': 'Ace Plus',
  'জ্বরের ঔষধ': 'Napa Extra',
  'জ্বর': 'Napa',
  'মাথাব্যথা': 'Napa Extra',
  'শরীর ব্যথা': 'Napa Extra',

  // Gastric & Acidity
  'সেক্লো': 'Seclo',
  'সেকলো': 'Seclo',
  'সেক্লো ২০': 'Seclo 20mg',
  'সেক্লো বিশ': 'Seclo 20mg',
  'ওমিপ্রাজল': 'Omeprazole',
  'সার্জেল': 'Sergel',
  'সারজেল': 'Sergel',
  'সার্জেল ২০': 'Sergel 20mg',
  'এসোমিপ্রাজল': 'Esomeprazole',
  'প্যান্টোনিক্স': 'Pantonix',
  'পেনটোনিক্স': 'Pantonix',
  'প্যান্টোপ্রাজল': 'Pantoprazole',
  'এন্টাসিড': 'Entacyd',
  'এন্টাসিড প্লাস': 'Entacyd Plus',
  'এনটাসিড': 'Entacyd Plus',
  'গ্যাস্ট্রিক': 'Seclo',
  'গ্যাস্ট্রিকের ঔষধ': 'Seclo',
  'গ্যাস': 'Seclo',
  'বুক জ্বালা': 'Sergel',
  'বুক জ্বালাপোড়া': 'Sergel',
  'বদহজম': 'Entacyd Plus',

  // Allergy, Cold & Cough
  'মোনাস': 'Monas',
  'মোনাশ': 'Monas',
  'মোনাস ১০': 'Monas 10mg',
  'মন্টেলুকাস্ট': 'Montelukast',
  'ফেক্সো': 'Fexo',
  'ফেকসো': 'Fexo',
  'ফেক্সো ১২০': 'Fexo 120mg',
  'ফেক্সোফেনাডিন': 'Fexofenadine',
  'অ্যালাট্রোল': 'Alatrol',
  'এলাট্রোল': 'Alatrol',
  'এলারট্রোল': 'Alatrol',
  'সেটিরিজিন': 'Cetirizine',
  'টফেন': 'Tofen',
  'টফেন সিরাপ': 'Tofen',
  'কাশি': 'Monas',
  'কাশির ঔষধ': 'Monas',
  'কাশির সিরাপ': 'Tofen',
  'সর্দি': 'Fexo',
  'হাঁচি': 'Alatrol',
  'অ্যালার্জি': 'Fexo',
  'এলার্জি': 'Fexo',
  'চুলকানি': 'Alatrol',
  'হাঁপানি': 'Monas',

  // Diabetes Care
  'গ্লুকোফাস্ট': 'Glucofast',
  'গ্লুকোফাস্ট ৫০০': 'Glucofast 500mg',
  'মেটফরমিন': 'Metformin',
  'ডায়াবেটিস': 'Glucofast',
  'ডায়াবেটিস': 'Glucofast',
  'ডায়াবেটিসের ঔষধ': 'Glucofast',
  'সুগার': 'Glucofast',
  'আকুচেক': 'Accu-Chek',
  'একুচেক': 'Accu-Chek',
  'গ্লুকোমিটার': 'Accu-Chek',
  'সুগার মাপার মেশিন': 'Accu-Chek',
  'ডায়াবেটিস মাপার মেশিন': 'Accu-Chek',

  // Vitamins & Supplements
  'সিভিট': 'Ceevit',
  'সি-ভিট': 'Ceevit',
  'সি ভিট': 'Ceevit',
  'ভিটামিন সি': 'Ceevit',
  'বেক্সট্রাম': 'Bextram Gold',
  'বেক্সট্রাম গোল্ড': 'Bextram Gold',
  'মাল্টিভিটামিন': 'Bextram Gold',
  'ভিটামিন': 'Bextram Gold',
  'ডি রাইজ': 'D-Rise',
  'ডিরাইজ': 'D-Rise',
  'ভিটামিন ডি': 'D-Rise',
  'দুর্বলতা': 'Bextram Gold',

  // Cardiac & Blood Pressure
  'ওসারটিল': 'Osartil',
  'ওসারটিন': 'Osartil',
  'ওসারটিল ৫০': 'Osartil 50mg',
  'লোসার্টান': 'Losartan',
  'রক্তচাপ': 'Osartil',
  'উচ্চ রক্তচাপ': 'Osartil',
  'হাই প্রেশার': 'Osartil',
  'প্রেসার': 'Osartil',
  'প্রেশার': 'Osartil',
  'প্রেসারের ঔষধ': 'Osartil',
  'ওমরন': 'Omron',
  'প্রেসার মাপার মেশিন': 'Omron',
  'বিপি মেশিন': 'Omron',

  // Devices & Thermometer
  'থার্মোমিটার': 'Thermometer',
  'থার্মমিটার': 'Thermometer',
  'ইকো থার্ম': 'Eco-Therm',
  'ডিজিটাল থার্মোমিটার': 'Eco-Therm',
};

// Common filler words in spoken Bangla requests
const BANGLA_FILLER_WORDS = [
  'আমাকে',
  'একটু',
  'দাও',
  'দেন',
  'দিন',
  'খুঁজে দাও',
  'খুঁজুন',
  'লাগবে',
  'ঔষধ',
  'ঔষধটি',
  'ওষুধ',
  'ট্যাবলেট',
  'ট্যাব',
  'ক্যাপসুল',
  'সিরাপ',
  'ড্রপ',
  'পাতা',
  'বক্স',
  'একটি',
  'দুইটা',
  'চাই',
  'দরকার',
  'আছে',
  'কী',
  'আছে কি',
];

/**
 * Normalizes spoken speech input from Bangla or Banglish to catalog search terms
 */
export function normalizeBanglaVoiceSearch(rawText: string): VoiceMappingResult {
  if (!rawText) {
    return {
      originalText: '',
      cleanedText: '',
      matchedMedicineName: '',
      isBangla: false,
    };
  }

  const trimmed = rawText.trim();
  // Check if string contains Bengali script characters (Unicode range \u0980-\u09FF)
  const isBangla = /[\u0980-\u09FF]/.test(trimmed);

  let cleaned = trimmed.toLowerCase();

  // Strip filler words
  for (const filler of BANGLA_FILLER_WORDS) {
    cleaned = cleaned.replace(new RegExp(filler, 'gi'), ' ');
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 1. Direct dictionary match
  if (BANGLA_MEDICINE_DICTIONARY[trimmed]) {
    return {
      originalText: trimmed,
      cleanedText: cleaned,
      matchedMedicineName: BANGLA_MEDICINE_DICTIONARY[trimmed],
      isBangla,
    };
  }

  // 2. Check if dictionary keys are contained in spoken phrase
  for (const [banglaKey, englishVal] of Object.entries(BANGLA_MEDICINE_DICTIONARY)) {
    if (trimmed.includes(banglaKey) || cleaned.includes(banglaKey)) {
      return {
        originalText: trimmed,
        cleanedText: cleaned,
        matchedMedicineName: englishVal,
        isBangla,
      };
    }
  }

  // 3. Banglish / English phonetic matches
  const banglishMap: Record<string, string> = {
    napa: 'Napa',
    nappa: 'Napa',
    'napa extra': 'Napa Extra',
    seclo: 'Seclo',
    seklo: 'Seclo',
    sergel: 'Sergel',
    monas: 'Monas',
    monash: 'Monas',
    fexo: 'Fexo',
    fekso: 'Fexo',
    ceevit: 'Ceevit',
    cevit: 'Ceevit',
    alatrol: 'Alatrol',
    pantonix: 'Pantonix',
    bextram: 'Bextram Gold',
    glucofast: 'Glucofast',
    tofen: 'Tofen',
    osartil: 'Osartil',
    entacyd: 'Entacyd Plus',
    antacid: 'Entacyd Plus',
    'accu chek': 'Accu-Chek',
    accuchek: 'Accu-Chek',
    omron: 'Omron',
    fever: 'Napa',
    gastric: 'Seclo',
    gas: 'Seclo',
    cough: 'Monas',
    diabetes: 'Glucofast',
    sugar: 'Glucofast',
    pressure: 'Osartil',
    vitamin: 'Ceevit',
  };

  for (const [key, val] of Object.entries(banglishMap)) {
    if (cleaned.includes(key)) {
      return {
        originalText: trimmed,
        cleanedText: cleaned,
        matchedMedicineName: val,
        isBangla,
      };
    }
  }

  return {
    originalText: trimmed,
    cleanedText: cleaned || trimmed,
    matchedMedicineName: cleaned || trimmed,
    isBangla,
  };
}
