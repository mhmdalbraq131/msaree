/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flight, TourismPackage, UmrahPackage, HajjPackage, Booking } from '../types';

// Flight Mock Data
export const mockFlights: Flight[] = [
  {
    id: 'f1',
    airline: 'Yemenia Airways',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    flightNo: 'IY-601',
    from: 'SAH', // Sana'a
    to: 'CAI', // Cairo
    departureTime: '08:30',
    arrivalTime: '11:45',
    duration: '3h 15m',
    stops: 0,
    price: 450,
    classType: 'Economy',
  },
  {
    id: 'f2',
    airline: 'Air Arabia',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=80&q=80',
    flightNo: 'G9-782',
    from: 'ADE', // Aden
    to: 'SHJ', // Sharjah
    departureTime: '13:15',
    arrivalTime: '16:50',
    duration: '2h 35m',
    stops: 0,
    price: 320,
    classType: 'Economy',
  },
  {
    id: 'f3',
    airline: 'Qatar Airways',
    airlineLogoUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=80&q=80',
    flightNo: 'QR-419',
    from: 'CAI', // Cairo
    to: 'DOH', // Doha
    departureTime: '17:40',
    arrivalTime: '21:10',
    duration: '3h 30m',
    stops: 0,
    price: 680,
    classType: 'Business',
  },
];

// Tourism Packages Mock Data
export const mockTourismPackages: TourismPackage[] = [
  {
    id: 't1',
    titleAr: 'الباقة الاقتصادية',
    titleEn: 'Economic Package',
    price: 1000,
    durationDays: 7,
    countryAr: 'الأردن',
    countryEn: 'Jordan',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80', // Petra
    highlightsAr: ['زيارة البتراء الأثرية', 'جولة في وادي رم', 'الاستجمام في البحر الميت'],
    highlightsEn: ['Visit Ancient Petra', 'Jeep Tour in Wadi Rum', 'Float in the Dead Sea'],
    includesAr: ['فندق 3 نجوم', 'وجبة إفطار يومية', 'مرشد سياحي مرخص', 'المواصلات الداخلية'],
    includesEn: ['3-star Hotel', 'Daily Breakfast', 'Licensed Tour Guide', 'Local Transport'],
  },
  {
    id: 't2',
    titleAr: 'الباقة العائلية',
    titleEn: 'Family Package',
    price: 1500,
    durationDays: 10,
    countryAr: 'الإمارات',
    countryEn: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', // Dubai
    highlightsAr: ['رحلات ترفيهية للأطفال', 'زيارة برج خليفة وجزيرة النخلة', 'التسوق في دبي مول'],
    highlightsEn: ['Kid-friendly Excursions', 'Burj Khalifa & Palm Jumeirah Tour', 'Shopping at Dubai Mall'],
    includesAr: ['شقة فندقية فاخرة', 'وجبتين يومياً', 'تذاكر المدن الترفيهية', 'سيارة خاصة بسائق'],
    includesEn: ['Luxury Hotel Apartment', 'Half Board Meals', 'Theme Park Tickets', 'Private Driver'],
  },
  {
    id: 't3',
    titleAr: 'الباقة التجارية',
    titleEn: 'Business Package',
    price: 2000,
    durationDays: 5,
    countryAr: 'فرنسا',
    countryEn: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', // Paris
    highlightsAr: ['جولة في مدينة باريس', 'رحلة بحرية في نهر السين', 'زيارة برج إيفل ومتحف اللوفر'],
    highlightsEn: ['Paris City Tour', 'Seine River Cruise', 'Eiffel Tower & Louvre Visit'],
    includesAr: ['فندق 4 نجوم وسط باريس', 'إفطار فرنسي فاخر', 'تذاكر سريعة للمعالم الأثرية', 'إنترنت مفتوح عالي السرعة'],
    includesEn: ['4-star Central Hotel', 'Gourmet French Breakfast', 'Fast-track Landmark Tickets', 'Unlimited High-Speed Wi-Fi'],
  },
  {
    id: 't4',
    titleAr: 'باقة VIP الفاخرة',
    titleEn: 'VIP Luxury Package',
    price: 5000,
    durationDays: 14,
    countryAr: 'سويسرا',
    countryEn: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', // Swiss Alps
    highlightsAr: ['إقامة في كوخ جبلي فاخر', 'رحلة هليكوبتر فوق جبال الألب', 'جولة خاصة لتذوق الشوكولاتة والجبن السويسري'],
    highlightsEn: ['Luxury Alpine Chalet Stay', 'Private Helicopter Tour Over Alps', 'Bespoke Swiss Chocolate & Cheese Tour'],
    includesAr: ['منتجع 5 نجوم مع سبا', 'إقامة كاملة فاخرة', 'مترجم ومرافق شخصي', 'طيران خاص بين المدن السويسرية'],
    includesEn: ['5-star Resort & Spa', 'All-inclusive Fine Dining', 'Private Translator & Host', 'Private Domestic Flights'],
  },
];

// Umrah Packages Mock Data
export const mockUmrahPackages: UmrahPackage[] = [
  {
    id: 'u1',
    titleAr: 'عمرة رمضان الاقتصادية',
    titleEn: 'Economic Ramadan Umrah',
    price: 1350,
    durationDays: 15,
    hotelMakkahAr: 'فندق دار الإيمان (4 نجوم)',
    hotelMakkahEn: 'Dar Al-Eiman Hotel (4-Star)',
    hotelMadinahAr: 'فندق أنوار المدينة (3 نجوم)',
    hotelMadinahEn: 'Anwar Al-Madinah Hotel (3-Star)',
    flightsIncluded: true,
    transportIncluded: true,
    airlineLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=80&q=80',
    airlineNameAr: 'طيران ناس',
    airlineNameEn: 'flynas',
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bffc9a?auto=format&fit=crop&w=600&q=80', // Mecca
  },
  {
    id: 'u2',
    titleAr: 'العمرة الملكية الفاخرة',
    titleEn: 'Royal Luxury Umrah',
    price: 2800,
    durationDays: 10,
    hotelMakkahAr: 'برج رافلز مكة (5 نجوم مطل على الحرم)',
    hotelMakkahEn: 'Raffles Makkah Palace (5-Star Kaaba View)',
    hotelMadinahAr: 'فندق أوبروي المدينة (5 نجوم)',
    hotelMadinahEn: 'The Oberoi Madinah (5-Star)',
    flightsIncluded: true,
    transportIncluded: true,
    airlineLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=80&q=80',
    airlineNameAr: 'الخطوط السعودية',
    airlineNameEn: 'Saudi Arabian Airlines',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=600&q=80', // Kaaba View
  },
  {
    id: 'u3',
    titleAr: 'باقة عمرة النخبة',
    titleEn: 'Elite Umrah Package',
    price: 1950,
    durationDays: 12,
    hotelMakkahAr: 'فندق فيرمونت مكة برج الساعة',
    hotelMakkahEn: 'Fairmont Makkah Clock Royal Tower',
    hotelMadinahAr: 'فندق دار التقوى',
    hotelMadinahEn: 'Dar Al-Taqwa Hotel',
    flightsIncluded: true,
    transportIncluded: true,
    airlineLogo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=80&q=80',
    airlineNameAr: 'الخطوط الجوية القطرية',
    airlineNameEn: 'Qatar Airways',
    image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80', // Clock tower
  },
];

// Hajj Packages Mock Data
export const mockHajjPackages: HajjPackage[] = [
  {
    id: 'h1',
    titleAr: 'حج التميز - الغرف الفندقية',
    titleEn: 'Excellence Hajj - Hotel Suites',
    price: 8500,
    hotelAr: 'فندق نجمة المدينة (أبراج ساعة الحرم)',
    hotelEn: 'Star of Madinah Hotel (Kaaba Clock Towers)',
    durationDays: 21,
    capacityMax: 6,
    rating: 4.9,
    featuresAr: [
      'غرف فندقية مجهزة بالكامل تتسع لـ 6 أشخاص كحد أقصى',
      'الإقامة الشاملة (سكن + وجبات بوفيه مفتوح)',
      'مخيمات مكيفة ومجهزة بالكامل في منى وعرفات (VIP)',
      'المواصلات بأحدث الحافلات المكيفة المخصصة لشركة مساري',
      'إرشاد ديني وصحي على مدار الساعة',
    ],
    featuresEn: [
      'Fully-equipped hotel rooms sleeping max 6 guests',
      'Full Board (Accommodation + Open Buffet meals)',
      'Air-conditioned VIP tents in Mina and Arafat',
      'Transportation in state-of-the-art private buses',
      '24/7 Spiritual, Medical, and Logistic guidance',
    ],
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=600&q=80', // Medina/Hajj
  },
  {
    id: 'h2',
    titleAr: 'حج النخبة الملكي VIP',
    titleEn: 'Royal VIP Hajj',
    price: 12500,
    hotelAr: 'أجنحة دار التوحيد مكة والمدينة',
    hotelEn: 'Dar Al-Tawhid InterContinental Suites',
    durationDays: 14,
    capacityMax: 2,
    rating: 5.0,
    featuresAr: [
      'أجنحة ملكية خاصة مطلة مباشرة على الكعبة المشرفة لشخصين',
      'رحلات طيران على درجة رجال الأعمال أو الدرجة الأولى',
      'مخيمات ملكية خاصة ومغلقة بالكامل في المشاعر المقدسة',
      'سيارات ليموزين خاصة للتنقلات طوال فترة المناسك',
      'مرشد ديني خاص ومرافق أمني وصحي متفرغ بالكامل',
    ],
    featuresEn: [
      'Private royal suites directly overlooking the Kaaba (2 guests)',
      'Business or First-Class international round trips',
      'Private locked royal pavilions in Mina and Arafat',
      'Private luxury limousine for all transport',
      'Dedicated private scholar, security, and personal doctor',
    ],
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bffc9a?auto=format&fit=crop&w=600&q=80', // Kaaba
  },
];

// Seed Data for Active Bookings
export const mockActiveBookings: Booking[] = [
  {
    id: 'b1',
    bookingRef: 'MSR-2026-F91A',
    type: 'flight',
    titleAr: 'طيران اليمنية: صنعاء - القاهرة',
    titleEn: 'Yemenia Airways: Sanaa to Cairo',
    price: 450,
    bookingDate: '2026-07-15',
    departureDate: '2026-08-10',
    status: 'confirmed',
    details: {
      passengersCount: 1,
      phone: '+967 777 123 456',
      email: 'user@masari.com',
    },
  },
  {
    id: 'b2',
    bookingRef: 'MSR-2026-H88B',
    type: 'hajj',
    titleAr: 'حج التميز - الغرف الفندقية',
    titleEn: 'Excellence Hajj - Hotel Suites',
    price: 8500,
    bookingDate: '2026-06-20',
    departureDate: '2026-11-15',
    status: 'pending',
    details: {
      passengersCount: 2,
      phone: '+967 777 987 654',
      email: 'user@masari.com',
      additionalInfo: 'الغرفة المطلة - الجناح السكني الثاني',
    },
  },
];

// Available Countries list for the dropdown
export const middleEastCountries = [
  { ar: 'الأردن', en: 'Jordan', flag: '🇯🇴', code: 'JO' },
  { ar: 'الإمارات', en: 'UAE', flag: '🇦🇪', code: 'AE' },
  { ar: 'السعودية', en: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' },
  { ar: 'العراق', en: 'Iraq', flag: '🇮🇶', code: 'IQ' },
  { ar: 'اليمن', en: 'Yemen', flag: '🇾🇪', code: 'YE' },
  { ar: 'عمان', en: 'Oman', flag: '🇴🇲', code: 'OM' },
  { ar: 'فلسطين', en: 'Palestine', flag: '🇵🇸', code: 'PS' },
  { ar: 'مصر', en: 'Egypt', flag: '🇪🇬', code: 'EG' },
  { ar: 'الكويت', en: 'Kuwait', flag: '🇰🇼', code: 'KW' },
  { ar: 'السودان', en: 'Sudan', flag: '🇸🇩', code: 'SD' },
  { ar: 'سوريا', en: 'Syria', flag: '🇸🇾', code: 'SY' },
  { ar: 'قطر', en: 'Qatar', flag: '🇶🇦', code: 'QA' },
  { ar: 'الجزائر', en: 'Algeria', flag: '🇩🇿', code: 'DZ' },
  { ar: 'ليبيا', en: 'Libya', flag: '🇱🇾', code: 'LY' },
  { ar: 'فرنسا', en: 'France', flag: '🇫🇷', code: 'FR' },
];
