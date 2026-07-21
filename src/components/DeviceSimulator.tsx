/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AiPlatformView from '../features/ai/presentation/AiPlatformView';
import QuickServicesGrid from './QuickServicesGrid';
import TravelerManager, { initialMockTravelers } from '../features/travelers/TravelerManager';
import WalletRechargeModal from '../features/wallet/WalletRechargeModal';
import NotificationCenter, { initialMockNotificationsList } from '../features/notifications/NotificationCenter';
import AuthModal from '../features/auth/AuthModal';
import SmartSearchOverlay from '../features/search/SmartSearchOverlay';
import BookingCheckoutSheet from '../features/booking/BookingCheckoutSheet';
import { 
  mockFlights, 
  mockTourismPackages, 
  mockUmrahPackages, 
  mockHajjPackages, 
  mockActiveBookings, 
  middleEastCountries 
} from '../data/packages';
import { 
  ActiveSection, 
  AuthScreen, 
  TabItem, 
  Flight, 
  TourismPackage, 
  UmrahPackage, 
  HajjPackage, 
  Booking, 
  Traveler,
  NotificationItem,
  UserProfile,
  Language, 
  Currency 
} from '../types';
import { 
  Plane, 
  Compass, 
  Moon, 
  Heart, 
  Home, 
  Search, 
  Ticket, 
  Settings, 
  User, 
  Lock,
  Check, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  DollarSign, 
  Plus, 
  Minus, 
  Eye, 
  EyeOff, 
  Calendar, 
  Chrome, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  Globe,
  Bell,
  Star,
  Info,
  HelpCircle,
  Mail,
  Bus,
  Car,
  ArrowLeftRight,
  FileCheck,
  ShieldAlert,
  FileSignature,
  RefreshCw,
  Wallet,
  Percent,
  MessageSquare,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  ThumbsUp,
  Users
} from 'lucide-react';

interface DeviceSimulatorProps {
  lang: Language;
  setLang: (l: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

// Mock Hotels Data
const mockHotels = [
  {
    id: 'h1',
    nameAr: 'فندق أبراج الكسوة مكة',
    nameEn: 'Al Kiswah Towers Hotel Makkah',
    locationAr: 'مكة المكرمة - التيسير',
    locationEn: 'Makkah - Al Taysir District',
    rating: 4.7,
    price: 80, // USD per night
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    amenitiesAr: ['حافلات مجانية للحرم', 'واي فاي مجاني', 'تكييف مركزي', 'مطعم هندي وعربي'],
    amenitiesEn: ['Free Haram Shuttle', 'Free High-Speed WiFi', 'Central A/C', 'Indian & Arabic Restaurants']
  },
  {
    id: 'h2',
    nameAr: 'فندق شيراتون المدينة المنورة',
    nameEn: 'Sheraton Madinah Hotel',
    locationAr: 'المدينة المنورة - المنطقة المركزية',
    locationEn: 'Madinah - Central Area',
    rating: 4.9,
    price: 150, // USD per night
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    amenitiesAr: ['مطل على الحرم', 'إفطار فاخر مجاني', 'مواقف خاصة', 'خدمة الغرف 24 ساعة'],
    amenitiesEn: ['Haram View', 'Free Luxury Breakfast', 'Private Parking', '24h Room Service']
  },
  {
    id: 'h3',
    nameAr: 'فندق شيراتون صنعاء الفاخر',
    nameEn: 'Sheraton Sana\'a Luxury Hotel',
    locationAr: 'صنعاء - شارع ظهر حمير',
    locationEn: 'Sanaa - Dahr Himyar Street',
    rating: 4.8,
    price: 120, // USD per night
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
    amenitiesAr: ['حدائق غناء ومسبح', 'صالة لياقة بدنية', 'مركز أعمال متكامل', 'تأمين حراسة ممتازة'],
    amenitiesEn: ['Lush Gardens & Pool', 'State-of-the-art Gym', 'Full Business Hub', 'Top Security Framework']
  }
];

// Mock Bus Transport Data
const mockBuses = [
  {
    id: 'b1',
    companyAr: 'شركة الرويشان للنقل الحديث',
    companyEn: 'Al-Rowaishan Modern Transport',
    fromAr: 'صنعاء (يومياً)',
    fromEn: 'Sanaa (Daily)',
    toAr: 'عدن',
    toEn: 'Aden',
    departureTime: '07:00 AM',
    arrivalTime: '02:30 PM',
    price: 15,
    classAr: 'درجة أولى ممتازة VIP',
    classEn: 'VIP Elite Class',
    amenitiesAr: ['تكييف مركزي', 'شاشات عرض ذكية لكل مقعد', 'خدمة إنترنت ومنافذ طاقة', 'وجبة خفيفة ومشروبات'],
    amenitiesEn: ['Full Climate Control', 'Smart Screen per Seat', 'Free WiFi & USB Ports', 'Complimentary Snacks'],
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b2',
    companyAr: 'البراق للنقل الدولي المباشر',
    companyEn: 'Al-Buraq International Direct',
    fromAr: 'صنعاء (ثلاث مرات أسبوعياً)',
    fromEn: 'Sanaa (Thrice Weekly)',
    toAr: 'مكة المكرمة (منفذ الوديعة)',
    toEn: 'Makkah (Al-Wadeeah Border)',
    departureTime: '06:00 AM',
    arrivalTime: '08:00 AM (+1 Day)',
    price: 45,
    classAr: 'درجة رجال الأعمال الملكية',
    classEn: 'Royal Business Class',
    amenitiesAr: ['مقاعد مريحة قابلة للانفراج بالكامل', 'إنترنت مجاني عالي السرعة', 'دورة مياه نظيفة', 'مرافق ومضيف سفر متفرغ'],
    amenitiesEn: ['Fully Reclining Sleep Seats', 'High-speed Travel WiFi', 'On-board Restroom', 'Dedicated Cabin Host'],
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80'
  }
];

// Mock Car Rental Data
const mockCars = [
  {
    id: 'c1',
    modelAr: 'تويوتا لاندكروزر 2026',
    modelEn: 'Toyota Land Cruiser 2026',
    typeAr: 'دفع رباعي فاخر بامتياز',
    typeEn: 'Premium Luxury SUV',
    price: 120,
    companyAr: 'مساري لخدمات السيارات الممتازة',
    companyEn: 'Masari Premium Car Rental',
    rating: 4.9,
    featuresAr: ['تأمين شامل بدون تحمل', 'سائق محترف مجاني متحدث لغتين', 'كيلومترات مفتوحة بالكامل'],
    featuresEn: ['Full Zero-Deductible Insurance', 'Bilingual Professional Driver', 'Unlimited Kilometers'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c2',
    modelAr: 'هيونداي إلنترا 2025',
    modelEn: 'Hyundai Elantra 2025',
    typeAr: 'سيارة صالون اقتصادية مريحة',
    typeEn: 'Comfortable Economic Sedan',
    price: 35,
    companyAr: 'اليمن إكسبريس لتأجير السيارات',
    companyEn: 'Yemen Express Fleet Services',
    rating: 4.6,
    featuresAr: ['تكييف هواء رقمي ممتاز', 'تأمين ضد الحوادث والمسؤولية', 'ميزة الاستلام الفوري من المكتب'],
    featuresEn: ['Digital Climate Control', 'Accident & Liability Insurance', 'Instant Airport/Office Pickup'],
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80'
  }
];

// Mock Private Transfer Data
const mockTransfers = [
  {
    id: 'pt1',
    nameAr: 'نقل خاص فاخر من مطار جدة إلى مكة',
    nameEn: 'Private Transfer: Jeddah Airport to Makkah',
    vehicleAr: 'جمس صالون يوكن XL فاخر (موديل حديث)',
    vehicleEn: 'Premium GMC Yukon XL Executive SUV',
    price: 60,
    capacityAr: '1-6 ركاب مع الأمتعة كاملة',
    capacityEn: '1-6 passengers with full luggage set',
    duration: '1h 15m',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pt2',
    nameAr: 'نقل خاص ملوكي بين مكة والمدينة المنورة',
    nameEn: 'Royal Private Transfer: Makkah to Madinah',
    vehicleAr: 'مرسيدس بنز الفئة V الملوكية المجهزة',
    vehicleEn: 'Luxury Mercedes-Benz V-Class Lounge',
    price: 180,
    capacityAr: '1-7 ركاب مع باقة الترحيب الفاخرة وسناكس',
    capacityEn: '1-7 passengers with Royal Welcome package',
    duration: '4h 00m',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
  }
];

// Mock Visa Requirements Data
const mockVisas = [
  {
    id: 'v1',
    titleAr: 'تأشيرة عمرة إلكترونية سريعة ومضمونة',
    titleEn: 'Express Guaranteed Electronic Umrah Visa',
    price: 130,
    processingTimeAr: '24-48 ساعة عمل فقط',
    processingTimeEn: '24-48 Business Hours Guaranteed',
    validityAr: 'صلاحية 90 يوماً متواصلة من تاريخ الإصدار',
    validityEn: '90 Days continuous stay validity from issue date',
    requirementsAr: [
      'نسخة ملونة بدقة عالية من جواز السفر (صالح لأكثر من 6 أشهر)',
      'صورة شخصية ملونة حديثة خلفية بيضاء صافية',
      'شهادة تطعيم صحية سارية المفعول ومعتمدة'
    ],
    requirementsEn: [
      'High-resolution color copy of passport (6 months valid)',
      'Recent professional photo with clean white background',
      'Approved active international immunization certificate'
    ],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'v2',
    titleAr: 'تأشيرة سياحية إلكترونية متعددة الدخول (السعودية)',
    titleEn: 'Saudi Arabia E-Tourist Multi-Entry Visa',
    price: 160,
    processingTimeAr: '3-5 أيام عمل معالجة إلكترونية',
    processingTimeEn: '3-5 Business Days electronic processing',
    validityAr: 'عام كامل من تاريخ الإصدار (بحد أقصى 90 يوماً لكل دخول)',
    validityEn: '1 Full Year validity (stay max 90 days per entry)',
    requirementsAr: [
      'جواز سفر صالح غير منتهي مع صفحتين فارغتين على الأقل',
      'وثيقة تأمين طبي معتمد يغطي كامل مدة الإقامة داخل المملكة',
      'كشف حساب بنكي يوضح ملاءة مالية لآخر 3 أشهر'
    ],
    requirementsEn: [
      'Valid unexpired passport with minimum 2 blank pages',
      'Approved medical insurance policy covering full KSA stay',
      'Bank statement verifying financial standing for 3 months'
    ],
    image: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80'
  }
];

export default function DeviceSimulator({ lang, setLang, currency, setCurrency }: DeviceSimulatorProps) {
  // Device frame orientation & active simulated section states
  const [devicePlatform, setDevicePlatform] = useState<'mobile' | 'tablet'>('mobile');
  const [activeSection, setActiveSection] = useState<ActiveSection>(ActiveSection.Onboarding);
  const [activeTab, setActiveTab] = useState<TabItem>('home');
  
  // Custom states for simulation controls & premium screens
  const [simulationState, setSimulationState] = useState<'default' | 'loading' | 'empty' | 'error'>('default');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [activeDetailSheet, setActiveDetailSheet] = useState<'about' | 'contact' | 'help' | 'privacy' | 'terms' | null>(null);
  
  // Dynamic Booking Details & Reservation Summary sheet
  const [showBookingDetailsSheet, setShowBookingDetailsSheet] = useState<{
    show: boolean;
    type: 'flight' | 'tourism' | 'umrah' | 'hajj' | 'hotel' | 'bus' | 'car' | 'transfer' | 'visa';
    id: string;
    titleAr: string;
    titleEn: string;
    price: number;
    image?: string;
  } | null>(null);

  // Traveler form details inside reservation summary
  const [travelerForm, setTravelerForm] = useState({
    fullName: '',
    passportNo: '',
    phone: '',
    email: '',
    selectedAddons: [] as string[]
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState<string>('');

  // User Profile & Guest Mode
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr-101',
    name: 'محمد البرق',
    email: 'user@masari.com',
    phone: '+967 777 123 456',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    loyaltyTier: 'VIP',
    loyaltyPoints: 350,
    walletBalance: 1250.00,
    isGuest: false,
    profileCompletion: 85,
    savedTravelersCount: 2
  });

  // Saved Travelers & Passport Documents
  const [travelers, setTravelers] = useState<Traveler[]>(initialMockTravelers);

  // Modal Overlay States
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'guest_upgrade' | 'otp'>('login');
  const [showSmartSearch, setShowSmartSearch] = useState<boolean>(false);

  // Mock Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialMockNotificationsList);

  // Carousel Slide State
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  
  // Auth Screen State
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState({ email: 'user@masari.com', password: 'password123', rememberMe: true });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', terms: true });
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState<string>('user@masari.com');
  
  // Flight search states
  const [flightTripType, setFlightTripType] = useState<'one' | 'round' | 'multi'>('one');
  const [flightFrom, setFlightFrom] = useState<string>('Sanaa (SAH)');
  const [flightTo, setFlightTo] = useState<string>('Cairo (CAI)');
  const [flightDate, setFlightDate] = useState<string>('2026-08-10');
  const [flightReturnDate, setFlightReturnDate] = useState<string>('2026-08-25');
  const [flightPassengers, setFlightPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [flightSearchResults, setFlightSearchResults] = useState<Flight[]>([]);
  const [isSearchingFlights, setIsSearchingFlights] = useState<boolean>(false);
  const [showFlightDropdownFrom, setShowFlightDropdownFrom] = useState(false);
  const [showFlightDropdownTo, setShowFlightDropdownTo] = useState(false);

  // Tourism states
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  // Category tab selection in app (Flights, Tourism, Umrah, Hajj, Hotels, Bus, Cars, Transfers, Visa)
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'home' | 'flights' | 'tourism' | 'umrah' | 'hajj' | 'hotels' | 'bus' | 'cars' | 'transfers' | 'visa'>('home');
  
  // Booking Form Hajj/Umrah fields matching design exactly
  const [hajjBookingForm, setHajjBookingForm] = useState({
    fullName: '',
    companionName: '',
    phone: '',
    email: '',
    childrenCount: 0,
    departureDate: '2026-11-15',
    returnDate: '2026-12-05',
    housingType: 'hotel', // hotel, tent, suite
  });
  
  // Active Simulated Bookings State
  const [bookings, setBookings] = useState<Booking[]>(mockActiveBookings);

  // Interactive Financial Wallet & Identity Platform states
  const [wallet, setWallet] = useState({
    availableBalance: 1250.00,
    pendingBalance: 150.00,
    reservedBalance: 450.00,
    rewardBalance: 75.00,
    giftBalance: 50.00,
    travelCredit: 200.00,
    currency: 'USD',
  });

  const [walletTransactions, setWalletTransactions] = useState([
    {
      id: 'tx-101',
      referenceNo: 'MSR-TX-2026-F983A',
      type: 'deposit',
      status: 'completed',
      amount: 1500.0,
      descriptionAr: 'شحن رصيد المحفظة عبر بطاقة الائتمان',
      descriptionEn: 'Credit Card Wallet Deposit Successful',
      timestamp: '2026-07-15 10:24:12',
    },
    {
      id: 'tx-102',
      referenceNo: 'MSR-TX-2026-B8391',
      type: 'bookingPayment',
      status: 'completed',
      amount: 450.0,
      descriptionAr: 'دفع حجز طيران • صنعاء - القاهرة',
      descriptionEn: 'Flight Booking Payment • Sanaa - Cairo',
      timestamp: '2026-07-15 11:30:00',
    },
    {
      id: 'tx-103',
      referenceNo: 'MSR-TX-2026-R8310',
      type: 'bonus',
      status: 'completed',
      amount: 75.0,
      descriptionAr: 'مكافأة ترحيبية من منصة مساري لعام 1447هـ',
      descriptionEn: 'Masari Welcome Promotion Reward Credit',
      timestamp: '2026-07-20 09:00:00',
    }
  ]);

  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: 'led-1',
      debit: 0.0,
      credit: 1500.0,
      balanceAfter: 1500.0,
      description: 'شحن رصيد المحفظة بالبطاقة الائتمانية',
      timestamp: '2026-07-15 10:24:12',
    },
    {
      id: 'led-2',
      debit: 450.0,
      credit: 0.0,
      balanceAfter: 1050.0,
      description: 'حجز تذكرة طيران صنعاء - القاهرة',
      timestamp: '2026-07-15 11:30:00',
    },
    {
      id: 'led-3',
      debit: 0.0,
      credit: 75.0,
      balanceAfter: 1125.0,
      description: 'إيداع بونص مكافأة ترحيبية',
      timestamp: '2026-07-20 09:00:00',
    }
  ]);

  const [securityLogs, setSecurityLogs] = useState([
    {
      id: 'aud-1',
      action: 'EMAIL_LOGIN_SUCCESS',
      details: 'تم تسجيل الدخول بنجاح بالبريد الإلكتروني للرمز usr-101.',
      timestamp: '2026-07-20 12:00:00',
      severity: 'INFO'
    },
    {
      id: 'aud-2',
      action: 'WALLET_FUNDS_TOUCHED',
      details: 'تغيير في أرصدة المحفظة الرقمية بعد إجراء إيداع قيمته $1500.',
      timestamp: '2026-07-20 12:05:00',
      severity: 'INFO'
    }
  ]);

  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [rechargeAmountInput, setRechargeAmountInput] = useState('');
  const [transferAmountInput, setTransferAmountInput] = useState('');
  const [transferRecipientInput, setTransferRecipientInput] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isIpBlockedState, setIsIpBlockedState] = useState(false);
  const [activeWalletTab, setActiveWalletTab] = useState<'overview' | 'recharge' | 'transfer' | 'ledger' | 'security'>('overview');
  
  // Booking confirmation modal / toast
  const [activeModalBooking, setActiveModalBooking] = useState<{
    show: boolean;
    title: string;
    ref: string;
    price: number;
    type: string;
  } | null>(null);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle Dynamic currency conversion
  const formatCurrency = (amountInUSD: number) => {
    let rate = 1;
    let symbol = '$';
    if (currency === 'YER') {
      rate = 250; // Simple conversion factor
      symbol = 'YER ';
    } else if (currency === 'SAR') {
      rate = 3.75;
      symbol = 'SAR ';
    }
    const val = Math.round(amountInUSD * rate);
    return lang === 'ar' ? `${val} ${symbol}` : `${symbol}${val}`;
  };

  // Onboarding Slides Content
  const onboardingSlides = [
    {
      titleAr: 'مرحباً بكم في وكالة مساري للسفريات وسياحة وخدمات الحج والعمرة',
      titleEn: 'Welcome to Masari Agency for Travel, Tourism, and Hajj & Umrah Services',
      descAr: 'بوابتك الرقمية لتجربة سفر فاخرة وسهلة وآمنة بالكامل.',
      descEn: 'Your digital gateway to a fully luxurious, seamless, and secure travel experience.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    },
    {
      titleAr: 'موقعك يساعدنا في إيجاد أفضل العروض والتوصيات لك',
      titleEn: 'Your location helps us find the best customized offers and travel deals',
      descAr: 'يرجى تفعيل خدمات الموقع الجغرافي لتقديم خدمات مخصصة لاحتياجاتك.',
      descEn: 'Please enable geolocation tracking to access tailor-made packages tailored to your coordinates.',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
      isLocationStep: true,
    },
    {
      titleAr: 'استمتع بالحجز السلس مع ميزة تخصيص السيارات لدينا',
      titleEn: 'Enjoy seamless booking with our premium car customization options',
      descAr: 'اختر مركبتك المفضلة والمسار الأفضل لرحلتك بلمسة واحدة.',
      descEn: 'Select your preferred luxury vehicle and optimal route layout with a single touch.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', // Vintage car
    },
    {
      titleAr: 'ادخل إلى العروض ووفر للأعضاء وميزات شخصية مذهلة',
      titleEn: 'Access exclusive deals, member loyalty savings, and personal tools',
      descAr: 'انضم لبرنامج مساري للمكافآت واسترجع أموالك مع كل رحلة.',
      descEn: 'Register with Masari Rewards and redeem points or cashback on every booking.',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', // Eiffel Tower
    },
    {
      titleAr: 'عروض خاصة للمناسبات وخصومات قد تصل إلى 50%',
      titleEn: 'Special event packages and anniversary discounts up to 50%',
      descAr: 'خطط لرحلة أحلامك بأسعار استثنائية وباقات عائلية واقتصادية متكاملة.',
      descEn: 'Plan your dream getaway at exceptional rates with our all-inclusive holiday tiers.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', // Honeymoon
    },
  ];

  // Simulated flight search trigger
  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchingFlights(true);
    setTimeout(() => {
      // Filter mock flights based on from/to
      const filtered = mockFlights.filter(f => {
        const queryFrom = flightFrom.toLowerCase();
        const queryTo = flightTo.toLowerCase();
        return f.from.toLowerCase().includes(queryFrom.substring(0,3).toLowerCase()) ||
               f.to.toLowerCase().includes(queryTo.substring(0,3).toLowerCase()) || true;
      });
      setFlightSearchResults(filtered);
      setIsSearchingFlights(false);
    }, 1200);
  };

  // Dynamic Booking Form for Hajj Submission matching exact specs
  const handleHajjBooking = (e: React.FormEvent, pkg: HajjPackage) => {
    e.preventDefault();
    if (!hajjBookingForm.fullName || !hajjBookingForm.phone || !hajjBookingForm.email) {
      alert(lang === 'ar' ? 'يرجى ملء الحقول الإلزامية الاسم، الهاتف، والايميل!' : 'Please fill all mandatory fields: Name, Phone, and Email!');
      return;
    }

    // Check wallet balance
    if (wallet.availableBalance < pkg.price) {
      alert(lang === 'ar' 
        ? `عذراً، الرصيد المتاح في المحفظة (${formatCurrency(wallet.availableBalance)}) غير كافٍ لتأكيد حجز عقد الحج هذا (${formatCurrency(pkg.price)})!` 
        : `Sorry, available wallet balance (${formatCurrency(wallet.availableBalance)}) is insufficient to secure this Hajj booking contract (${formatCurrency(pkg.price)})!`);
      return;
    }

    const ref = `MSR-2026-H${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Deduct available, move to reserved balance
    const updatedAvailable = wallet.availableBalance - pkg.price;
    const updatedReserved = wallet.reservedBalance + pkg.price;
    setWallet({
      ...wallet,
      availableBalance: updatedAvailable,
      reservedBalance: updatedReserved
    });

    // Ingest transaction logs
    const newTxId = `tx-hajj-${Date.now()}`;
    const newTx = {
      id: newTxId,
      referenceNo: `MSR-TX-${Date.now().toString().slice(-6)}`,
      type: 'bookingPayment',
      status: 'pending',
      amount: pkg.price,
      descriptionAr: `حجز قيمة عقد رحلة حجز: ${pkg.titleAr}`,
      descriptionEn: `Escrow Reserve for Flight/Campaign: ${pkg.titleEn}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Ledger record
    const newLedger = {
      id: `led-${Date.now()}`,
      debit: pkg.price,
      credit: 0.0,
      balanceAfter: updatedAvailable,
      description: `حجز رصيد عقد معلق للحجز: ${ref}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setLedgerEntries(prev => [newLedger, ...prev]);

    // Audit record
    const newAudit = {
      id: `aud-${Date.now()}`,
      action: 'WALLET_FUNDS_TOUCHED',
      details: `خصم مبلغ $${pkg.price} من الرصيد المتاح لحجز الحج ${ref}.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity: 'INFO'
    };
    setSecurityLogs(prev => [newAudit, ...prev]);

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      bookingRef: ref,
      type: 'hajj',
      titleAr: pkg.titleAr,
      titleEn: pkg.titleEn,
      price: pkg.price,
      bookingDate: new Date().toISOString().split('T')[0],
      departureDate: hajjBookingForm.departureDate,
      status: 'pending',
      details: {
        passengersCount: 1 + hajjBookingForm.childrenCount,
        phone: hajjBookingForm.phone,
        email: hajjBookingForm.email,
        additionalInfo: `${lang === 'ar' ? 'نوع السكن' : 'Housing'}: ${hajjBookingForm.housingType} &bull; ${lang === 'ar' ? 'المرافق' : 'Companion'}: ${hajjBookingForm.companionName || 'N/A'}`,
      }
    };

    setBookings([newBooking, ...bookings]);
    setActiveModalBooking({
      show: true,
      title: lang === 'ar' ? pkg.titleAr : pkg.titleEn,
      ref: ref,
      price: pkg.price,
      type: 'Hajj',
    });
    
    // reset form
    setHajjBookingForm({
      fullName: '',
      companionName: '',
      phone: '',
      email: '',
      childrenCount: 0,
      departureDate: '2026-11-15',
      returnDate: '2026-12-05',
      housingType: 'hotel',
    });
  };

  // Package booking helper (Flight / Umrah / Tourism) with Wallet balance integration
  const bookGeneralPackage = (type: 'flight' | 'tourism' | 'umrah' | 'hajj', id: string, titleAr: string, titleEn: string, price: number) => {
    const ref = `MSR-2026-${type.substring(0,3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check wallet balance
    if (wallet.availableBalance < price) {
      alert(lang === 'ar' 
        ? `عذراً، الرصيد المتاح في المحفظة (${formatCurrency(wallet.availableBalance)}) غير كافٍ لدفع قيمة هذا الحجز (${formatCurrency(price)})!` 
        : `Sorry, available wallet balance (${formatCurrency(wallet.availableBalance)}) is insufficient for this booking (${formatCurrency(price)})!`);
      return;
    }

    // Deduct available, move to reserved balance
    const updatedAvailable = wallet.availableBalance - price;
    const updatedReserved = wallet.reservedBalance + price;
    setWallet({
      ...wallet,
      availableBalance: updatedAvailable,
      reservedBalance: updatedReserved
    });

    // Ingest transaction logs
    const newTxId = `tx-${Date.now()}`;
    const newTx = {
      id: newTxId,
      referenceNo: `MSR-TX-${Date.now().toString().slice(-6)}`,
      type: 'bookingPayment',
      status: 'completed',
      amount: price,
      descriptionAr: `دفع قيمة حجز ${titleAr} (معلق بانتظار التأكيد)`,
      descriptionEn: `Payment for booking ${titleEn} (Escrow reserved)`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Ledger record
    const newLedger = {
      id: `led-${Date.now()}`,
      debit: price,
      credit: 0.0,
      balanceAfter: updatedAvailable,
      description: `حجز ضمان تعاقدي لـ ${titleAr}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setLedgerEntries(prev => [newLedger, ...prev]);

    // Audit record
    const newAudit = {
      id: `aud-${Date.now()}`,
      action: 'WALLET_FUNDS_TOUCHED',
      details: `خصم مبلغ $${price} من الرصيد المتاح للحجز ${ref}.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      severity: 'INFO'
    };
    setSecurityLogs(prev => [newAudit, ...prev]);

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      bookingRef: ref,
      type: type,
      titleAr: titleAr,
      titleEn: titleEn,
      price: price,
      bookingDate: new Date().toISOString().split('T')[0],
      departureDate: '2026-09-01',
      status: 'confirmed',
      details: {
        passengersCount: 1,
        phone: '+967 777 123 456',
        email: 'mhmdalbraq131@gmail.com',
      }
    };

    setBookings([newBooking, ...bookings]);
    setActiveModalBooking({
      show: true,
      title: lang === 'ar' ? titleAr : titleEn,
      ref: ref,
      price: price,
      type: type.toUpperCase(),
    });
  };

  // Handle OTP Digit Input Change
  const handleOtpChange = (val: string, index: number) => {
    if (/^[0-9]?$/.test(val)) {
      const updated = [...otpCode];
      updated[index] = val;
      setOtpCode(updated);
      
      // Auto-focus next input
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div id="device-simulator-root" className="flex flex-col items-center select-none h-full bg-slate-950 p-4 relative">
      {/* Platform & Sandbox Controls bar */}
      <div className="flex flex-col gap-2 w-full max-w-lg mb-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-mono text-[11px] font-semibold flex items-center gap-1">
            <Smartphone size={12} className="text-masari-cyan" />
            MASARI SANDBOX CONTROL PANEL
          </span>
          <div className="flex gap-1">
            <button
              id="sim-mobile-btn"
              onClick={() => setDevicePlatform('mobile')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                devicePlatform === 'mobile' ? 'bg-masari-blue text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              MOBILE
            </button>
            <button
              id="sim-tablet-btn"
              onClick={() => setDevicePlatform('tablet')}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                devicePlatform === 'tablet' ? 'bg-masari-blue text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              TABLET
            </button>
          </div>
        </div>
        
        {/* Sandbox State Switchers */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] font-mono">
          <span className="text-slate-500">SIMULATION STATES:</span>
          <div className="flex gap-1 flex-wrap">
            {[
              { id: 'default', label: 'DEFAULT' },
              { id: 'loading', label: '⚡ SHIMMER' },
              { id: 'empty', label: '🗏 EMPTY' },
              { id: 'error', label: '⚠ ERROR' }
            ].map((st) => (
              <button
                key={st.id}
                id={`state-toggle-${st.id}`}
                onClick={() => setSimulationState(st.id as any)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                  simulationState === st.id 
                    ? 'bg-masari-orange text-white font-black' 
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Device Frame */}
      <div 
        id="simulated-viewport-wrapper"
        className={`bg-slate-900 border-[10px] border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300 flex flex-col ${
          devicePlatform === 'mobile' 
            ? 'w-full max-w-[375px] h-[760px] rounded-[40px]' 
            : 'w-full max-w-[580px] h-[760px] rounded-[32px]'
        }`}
        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
      >
        {/* Device Notch & Status bar */}
        <div className="w-full h-7 bg-slate-950 flex justify-between items-center px-6 shrink-0 relative z-40 text-[10px] font-mono font-bold text-slate-400">
          <span>8:06</span>
          {/* Real Speaker Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-16 h-3.5 bg-slate-850 rounded-full border border-slate-800 flex items-center justify-center">
            <span className="w-8 h-1 bg-slate-900 rounded-full" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px]">4G</span>
            <span className="w-4 h-2.5 bg-slate-400 rounded-sm inline-block relative border border-slate-950">
              <span className="w-0.5 h-1 bg-slate-400 absolute -right-1 top-0.5 rounded-r-sm" />
            </span>
          </div>
        </div>

        {/* Dynamic Screen View Container */}
        <div id="simulated-screen-view" className="flex-1 overflow-hidden flex flex-col bg-slate-50 text-slate-900 relative">
          
          {/* ==================== 0. ELEGANT BRAND SPLASH SCREEN ==================== */}
          {showSplash && (
            <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col items-center justify-between p-8 text-center">
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* Brand Emblem */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[1.5px] shadow-lg shadow-amber-500/10 mb-6 flex items-center justify-center relative">
                  <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 tracking-wider font-mono">MSR</span>
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-wide">وكالة مساري للسفريات</h2>
                <p className="text-[10px] text-amber-500 font-mono tracking-widest mt-1">MASARI TRAVEL PLATFORM</p>
                <span className="text-xs text-slate-400 mt-3 max-w-xs px-4">البوابة الرقمية الشاملة لخدمات الطيران، السياحة، الحج والعمرة</span>
              </div>
              <div className="w-full space-y-4">
                <div className="flex justify-center">
                  <span className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <button
                  id="splash-dismiss-btn"
                  onClick={() => setShowSplash(false)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-sans font-bold py-3 rounded-xl text-xs shadow-lg shadow-amber-500/10 cursor-pointer transition-all"
                >
                  {lang === 'ar' ? 'الدخول للمنصة ➔' : 'Enter Platform ➔'}
                </button>
                <div className="text-[9px] font-mono text-slate-500">PRODUCTION BUILD v1.0.4</div>
              </div>
            </div>
          )}
          
          {/* ==================== 1. ONBOARDING CAROUSEL ==================== */}
          {activeSection === ActiveSection.Onboarding && (
            <div className="flex-1 flex flex-col h-full relative">
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col transition-all duration-300">
                  <div
                    key={onboardingStep}
                    className="absolute inset-0 flex flex-col animate-fade-in"
                  >
                    {/* Background image covering the onboarding view */}
                    <div className="h-2/3 w-full relative">
                      <img 
                        src={onboardingSlides[onboardingStep].image} 
                        alt="Onboarding travel" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent" />
                      
                      {/* Logo Injected overlay */}
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="bg-white/95 shadow-md px-4 py-2.5 rounded-full flex items-center gap-1.5 border border-slate-100">
                          {/* Simulated SVG Logo matching Masari colors */}
                          <div className="w-7 h-7 relative flex items-center justify-center font-black text-sm select-none">
                            <span className="text-masari-blue absolute -left-0.5">M</span>
                            <span className="text-masari-cyan absolute -right-0.5">S</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-masari-blue leading-tight tracking-tight">وكالة مساري</span>
                            <span className="text-[6px] text-slate-400 leading-none">للسفريات والسياحة والحج</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Onboarding text copy layout matching the designs */}
                    <div className="flex-1 px-6 flex flex-col justify-start items-center text-center mt-2">
                      <h3 className="text-md font-extrabold text-slate-900 leading-snug tracking-tight mb-2 min-h-[48px] px-2 flex items-center">
                        {lang === 'ar' ? onboardingSlides[onboardingStep].titleAr : onboardingSlides[onboardingStep].titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                        {lang === 'ar' ? onboardingSlides[onboardingStep].descAr : onboardingSlides[onboardingStep].descEn}
                      </p>

                      {/* Location search box simulation */}
                      {onboardingSlides[onboardingStep].isLocationStep && (
                        <div className="w-full mt-4 flex gap-1.5 px-2">
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-left">
                            <MapPin size={12} className="text-masari-cyan" />
                            <span className="text-[10px] text-slate-400 truncate">
                              {lang === 'ar' ? 'العثور على موقعي...' : 'Find my coordinates...'}
                            </span>
                          </div>
                          <button
                            id="location-permission-btn"
                            onClick={() => alert(lang === 'ar' ? 'تم تفعيل الموقع التلقائي وصنعاء هي النقطة الرئيسية!' : 'Geolocation simulated successfully: Sana\'a has been mapped!')}
                            className="bg-masari-cyan hover:bg-masari-cyan/90 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold font-sans cursor-pointer transition-colors"
                          >
                            {lang === 'ar' ? 'تفعيل' : 'Allow'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Carousel Controls */}
              <div className="px-6 py-5 shrink-0 flex flex-col gap-4">
                {/* Stepper Dots */}
                <div className="flex justify-center gap-1.5">
                  {onboardingSlides.map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        onboardingStep === i ? 'w-5 bg-masari-cyan' : 'w-1.5 bg-slate-300'
                      }`} 
                    />
                  ))}
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col gap-2 w-full">
                  {onboardingStep === 0 ? (
                    <button
                      id="onboard-start-btn"
                      onClick={() => setOnboardingStep(1)}
                      className="w-full bg-masari-orange text-white py-3 rounded-xl text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md shadow-masari-orange/20 cursor-pointer text-center"
                    >
                      {lang === 'ar' ? 'ابدأ معنا' : 'Get Started'}
                    </button>
                  ) : onboardingStep < onboardingSlides.length - 1 ? (
                    <div className="flex gap-2">
                      <button
                        id="onboard-skip-btn"
                        onClick={() => setOnboardingStep(onboardingSlides.length - 1)}
                        className="flex-1 border border-slate-200 bg-white text-slate-500 py-3 rounded-xl text-xs font-bold font-sans hover:bg-slate-50 transition-all cursor-pointer text-center"
                      >
                        {lang === 'ar' ? 'تخطي' : 'Skip'}
                      </button>
                      <button
                        id="onboard-next-btn"
                        onClick={() => setOnboardingStep(onboardingStep + 1)}
                        className="flex-1 bg-masari-blue text-white py-3 rounded-xl text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md shadow-masari-blue/20 cursor-pointer text-center flex items-center justify-center gap-1"
                      >
                        <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                        {lang === 'ar' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <button
                        id="onboard-book-trip-btn"
                        onClick={() => {
                          setActiveSection(ActiveSection.Home);
                          setSelectedCategoryTab('flights');
                        }}
                        className="w-full bg-masari-blue text-white py-3 rounded-xl text-xs font-bold font-sans hover:bg-opacity-95 transition-all cursor-pointer text-center"
                      >
                        {lang === 'ar' ? 'احجز رحلتك' : 'Book Your Trip'}
                      </button>
                      <button
                        id="onboard-add-trip-btn"
                        onClick={() => {
                          setActiveSection(ActiveSection.Home);
                          setActiveTab('bookings');
                        }}
                        className="w-full border border-slate-200 bg-white text-slate-600 py-3 rounded-xl text-xs font-bold font-sans hover:bg-slate-50 transition-all cursor-pointer text-center"
                      >
                        {lang === 'ar' ? 'أضف رحلتي' : 'Add My Trip'}
                      </button>
                      <button
                        id="onboard-login-prompt-btn"
                        onClick={() => {
                          setActiveSection(ActiveSection.Auth);
                          setAuthScreen('login');
                        }}
                        className="w-full text-masari-orange py-2 text-xs font-bold font-sans hover:underline cursor-pointer text-center"
                      >
                        {lang === 'ar' ? 'تسجيل الدخول أو إنشاء حساب' : 'Sign In or Create Account'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. AUTHENTICATION SCREENS ==================== */}
          {activeSection === ActiveSection.Auth && (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar h-full bg-white">
              {/* Back button */}
              <button
                id="auth-back-btn"
                onClick={() => setActiveSection(ActiveSection.Onboarding)}
                className="self-start p-1 bg-slate-100 rounded-full text-slate-600 mb-6 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {lang === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              {/* Logo representation in Auth forms */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-masari-blue/5 rounded-full flex items-center justify-center mb-3">
                  <div className="w-8 h-8 relative flex items-center justify-center font-black text-md select-none">
                    <span className="text-masari-blue absolute -left-0.5">M</span>
                    <span className="text-masari-cyan absolute -right-0.5">S</span>
                  </div>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">
                  {lang === 'ar' ? 'وكالة مساري للسفريات' : 'Masari Travel Agency'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'ar' ? 'منصة الخدمات السياحية والروحانية المتكاملة' : 'The Integrated Tourism & Pilgrimage Portal'}
                </p>
              </div>

              {/* 2.1 LOGIN VIEW */}
              {authScreen === 'login' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-r-4 border-masari-blue pr-2 pl-2">
                    {lang === 'ar' ? 'تسجيل الدخول' : 'User Sign In'}
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'البريد الإلكتروني أو الهاتف' : 'Email or Phone'}</label>
                      <input 
                        type="text" 
                        value={loginForm.email} 
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                        placeholder={lang === 'ar' ? 'ادخل البريد أو الهاتف' : 'Enter email or phone'}
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={loginForm.password} 
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                        placeholder="••••••••"
                      />
                      <button 
                        id="login-toggle-pw-btn"
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                        className="accent-masari-blue" 
                      />
                      <span>{lang === 'ar' ? 'حفظ تسجيل الدخول' : 'Remember Me'}</span>
                    </label>
                    <button 
                      id="login-forgot-pw-prompt"
                      onClick={() => setAuthScreen('forgot')} 
                      className="text-masari-blue hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
                  </div>

                  <button
                    id="auth-submit-login-btn"
                    onClick={() => {
                      if (isIpBlockedState) {
                        alert(lang === 'ar' ? 'عذراً، هذا العنوان محظور بسبب محاولات دخول خاطئة متكررة! يرجى إعادة تعيين المحاكاة.' : 'Sorry, this client IP has been locked due to excessive failed attempts! Please reset simulation.');
                        return;
                      }
                      if (loginForm.password === 'password123' || loginForm.password === 'Masari2026!') {
                        setFailedAttempts(0);
                        // Log success
                        const successAudit = {
                          id: `aud-${Date.now()}`,
                          action: 'EMAIL_LOGIN_SUCCESS',
                          details: `تم تسجيل الدخول بنجاح بالبريد الإلكتروني للرمز usr-101.`,
                          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                          severity: 'INFO'
                        };
                        setSecurityLogs(prev => [successAudit, ...prev]);
                        setOtpEmail(loginForm.email);
                        setAuthScreen('otp');
                      } else {
                        const newCount = failedAttempts + 1;
                        setFailedAttempts(newCount);
                        const failAudit = {
                          id: `aud-${Date.now()}`,
                          action: 'EMAIL_LOGIN_FAILED',
                          details: `محاولة تسجيل دخول فاشلة للبريد ${loginForm.email}. كلمة مرور خاطئة. المحاولة ${newCount} من 5.`,
                          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                          severity: 'WARNING'
                        };
                        setSecurityLogs(prev => [failAudit, ...prev]);
                        
                        if (newCount >= 5) {
                          setIsIpBlockedState(true);
                          const alertAudit = {
                            id: `aud-crit-${Date.now()}`,
                            action: 'BRUTE_FORCE_DETECTED',
                            details: 'تم رصد 5 محاولات دخول خاطئة ومتتالية من العنوان IP الخاص بالمستخدم. تم قفل الحساب مؤقتاً.',
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                            severity: 'CRITICAL'
                          };
                          setSecurityLogs(prev => [alertAudit, ...prev]);
                          alert(lang === 'ar' ? 'تم قفل الحساب مؤقتاً لحمايتك! تم رصد سلوك مشبوه وتلقينا تنبيهاً أمنياً.' : 'Account locked temporarily for security! Brute-force behavior detected and logged.');
                        } else {
                          alert(lang === 'ar' ? `كلمة المرور غير صحيحة! المحاولة ${newCount} من 5. كلمة المرور الصحيحة هي Masari2026!` : `Incorrect password! Attempt ${newCount} of 5. Try: Masari2026!`);
                        }
                      }
                    }}
                    className="w-full bg-masari-blue text-white py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md cursor-pointer text-center"
                  >
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>

                  <div className="relative flex items-center justify-center my-4">
                    <span className="absolute w-full h-[1px] bg-slate-150" />
                    <span className="relative bg-white px-3 text-[9px] text-slate-400 uppercase">{lang === 'ar' ? 'أو عبر' : 'Or via'}</span>
                  </div>

                  <button
                    id="login-google-btn"
                    onClick={() => {
                      setOtpEmail('google-auth@gmail.com');
                      setAuthScreen('success');
                    }}
                    className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Chrome size={14} className="text-red-500" />
                    <span>{lang === 'ar' ? 'التسجيل عبر جوجل' : 'Continue with Google'}</span>
                  </button>

                  <p className="text-center text-[11px] text-slate-500 mt-4">
                    {lang === 'ar' ? 'ليس لديك حساب؟ ' : 'Don\'t have an account? '}
                    <button 
                      id="login-register-prompt"
                      onClick={() => setAuthScreen('register')} 
                      className="text-masari-orange font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              )}

              {/* 2.2 REGISTER VIEW */}
              {authScreen === 'register' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-r-4 border-masari-orange pr-2 pl-2">
                    {lang === 'ar' ? 'إنشاء حساب جديد' : 'Register Account'}
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'اسم المستخدم' : 'Full Name'}</label>
                      <input 
                        type="text" 
                        value={registerForm.name} 
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                        placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Enter full name'}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                      <input 
                        type="email" 
                        value={registerForm.email} 
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                        placeholder="name@example.com"
                      />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={registerForm.password} 
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-1.5 text-[10px] text-slate-500 mt-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={registerForm.terms}
                      onChange={(e) => setRegisterForm({ ...registerForm, terms: e.target.checked })}
                      className="accent-masari-blue mt-0.5" 
                    />
                    <span>{lang === 'ar' ? 'أوافق على الشروط والأحكام ومواثيق الخصوصية والرحلات.' : 'I accept the general terms of services and privacy rules.'}</span>
                  </label>

                  <button
                    id="auth-submit-register-btn"
                    onClick={() => {
                      if (!registerForm.name || !registerForm.email) {
                        alert(lang === 'ar' ? 'يرجى إكمال البيانات أولاً!' : 'Please complete the registration fields first!');
                        return;
                      }
                      setOtpEmail(registerForm.email);
                      setAuthScreen('otp');
                    }}
                    className="w-full bg-masari-orange text-white py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md cursor-pointer text-center"
                  >
                    {lang === 'ar' ? 'تسجيل الحساب' : 'Create Account'}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 mt-4">
                    {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                    <button 
                      id="register-login-prompt"
                      onClick={() => setAuthScreen('login')} 
                      className="text-masari-blue font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'سجل دخولك' : 'Sign In'}
                    </button>
                  </p>
                </div>
              )}

              {/* 2.3 FORGOT PASSWORD VIEW */}
              {authScreen === 'forgot' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 border-r-4 border-masari-blue pr-2 pl-2">
                    {lang === 'ar' ? 'استعادة كلمة المرور' : 'Recover Password'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {lang === 'ar' ? 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني وسوف نرسل لك كود التفعيل.' : 'Please enter your registered email or phone and we will dispatch a verification code.'}
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">{lang === 'ar' ? 'حساب الاستعادة' : 'Account Identifier'}</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-masari-blue" 
                      placeholder={lang === 'ar' ? 'رقم الهاتف أو البريد' : 'Email or Phone'}
                    />
                  </div>

                  <button
                    id="auth-submit-forgot-btn"
                    onClick={() => {
                      setOtpEmail('user-reset@masari.com');
                      setAuthScreen('otp');
                    }}
                    className="w-full bg-masari-blue text-white py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-opacity-95 transition-all cursor-pointer text-center"
                  >
                    {lang === 'ar' ? 'إرسال كود التفعيل' : 'Send Recovery Code'}
                  </button>
                </div>
              )}

              {/* 2.4 OTP VERIFICATION SCREEN */}
              {authScreen === 'otp' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-slate-800 border-r-4 border-masari-cyan pr-2 pl-2">
                    {lang === 'ar' ? 'يرجى إدخال رمز التحقق' : 'Verification OTP'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {lang === 'ar' ? `تم إرسال كود تفعيل مؤلف من 6 أرقام إلى البريد الإلكتروني: ` : 'A 6-digit verification code has been dispatched to: '}
                    <strong className="text-slate-800 font-bold block mt-1">{otpEmail}</strong>
                  </p>

                  {/* OTP Digit inputs */}
                  <div className="flex justify-between gap-1.5" style={{ direction: 'ltr' }}>
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className="w-10 h-11 border border-slate-200 rounded-lg bg-slate-50 text-center font-bold text-sm text-slate-800 focus:outline-none focus:border-masari-cyan focus:bg-white"
                      />
                    ))}
                  </div>

                  <button
                    id="auth-submit-otp-btn"
                    onClick={() => setAuthScreen('success')}
                    className="w-full bg-masari-cyan text-white py-2.5 rounded-lg text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md cursor-pointer text-center"
                  >
                    {lang === 'ar' ? 'تحقق وتفعيل' : 'Verify & Activate'}
                  </button>

                  <div className="text-center text-[10px] text-slate-500">
                    {lang === 'ar' ? 'لم يصلك الكود؟ ' : 'Didn\'t receive the code? '}
                    <button 
                      id="otp-resend-btn"
                      onClick={() => alert(lang === 'ar' ? 'تم إرسال رمز جديد!' : 'New code dispatched!')} 
                      className="text-masari-blue font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'ar' ? 'أعد إرسال الكود' : 'Resend Code'}
                    </button>
                  </div>
                </div>
              )}

              {/* 2.5 VERIFICATION SUCCESS SCREEN */}
              {authScreen === 'success' && (
                <div className="text-center space-y-5 my-auto">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-md font-bold text-slate-900 font-sans">
                      {lang === 'ar' ? 'تم تفعيل الحساب بنجاح!' : 'Verification Complete!'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      {lang === 'ar' ? 'مرحباً بك في مجتمع مساري. تم إقران حسابك بالكامل وإعداد محفظتك الرقمية الموحدة للمرحلة المقبلة.' : 'Welcome to the Masari community. Your account has been paired successfully.'}
                    </p>
                  </div>
                  <button
                    id="auth-success-continue-btn"
                    onClick={() => {
                      setActiveSection(ActiveSection.Home);
                      setActiveTab('home');
                    }}
                    className="w-full bg-masari-blue text-white py-3 rounded-xl text-xs font-bold font-sans hover:bg-opacity-95 transition-all shadow-md cursor-pointer text-center"
                  >
                    {lang === 'ar' ? 'الذهاب للرئيسية' : 'Go to Homepage'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. HOME & CATEGORIZED APP VIEWS ==================== */}
          {activeSection === ActiveSection.Home && (
            <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
              
              {/* Header: Application logo, User avatar, Wallet shortcut, Notifications, Language switch */}
              <div className="bg-white border-b border-slate-150 px-4 py-3 shrink-0 shadow-xs">
                <div className="flex justify-between items-center">
                  {/* Application Logo & User Avatar */}
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt="User Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border-2 border-amber-400 shadow-xs cursor-pointer hover:scale-105 transition-transform" 
                      onClick={() => setActiveTab('profile')}
                      title={lang === 'ar' ? 'الملف الشخصي' : 'User Profile'}
                    />
                    <div>
                      <h4 className="text-[11px] font-black text-slate-800 leading-tight">وكالة مساري</h4>
                      <p className="text-[8px] text-slate-400 font-mono leading-none">M A S A R I  P L A T F O R M</p>
                    </div>
                  </div>

                  {/* Header Shortcuts */}
                  <div className="flex items-center gap-1.5">
                    {/* Wallet Shortcut */}
                    <button 
                      id="header-wallet-btn"
                      onClick={() => setShowRechargeModal(true)}
                      className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-amber-400 text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xs cursor-pointer transition-colors"
                      title={lang === 'ar' ? 'المحفظة الرقمية' : 'Digital Wallet'}
                    >
                      <Wallet size={12} className="text-amber-400" />
                      <span>{formatCurrency(wallet.availableBalance)}</span>
                    </button>

                    {/* Notifications Button */}
                    <button 
                      id="notifications-toggle-btn"
                      onClick={() => setShowNotifications(true)}
                      className="p-1.5 text-slate-600 hover:text-masari-blue bg-slate-100 hover:bg-slate-200 rounded-lg relative transition-colors cursor-pointer"
                      title={lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                    >
                      <Bell size={13} />
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-masari-orange rounded-full animate-ping" />
                    </button>

                    {/* Language Switch */}
                    <button
                      id="header-lang-switch-btn"
                      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                      className="text-[9px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'EN' : 'عربي'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport Content for active Bottom Navigation tab */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                
                {/* A. HOME BOTTOM NAVIGATION VIEW */}
                {activeTab === 'home' && (
                  <div className="space-y-4">
                    
                    {/* Secondary Category Back Navigation Header (when user selected a specific service) */}
                    {selectedCategoryTab !== 'home' && (
                      <div className="bg-white border border-slate-150 rounded-xl p-3 flex items-center justify-between shadow-xs mb-1">
                        <button
                          id="category-back-btn"
                          onClick={() => setSelectedCategoryTab('home')}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-masari-blue transition-colors cursor-pointer"
                        >
                          <ArrowRight size={15} className={lang === 'ar' ? '' : 'rotate-180'} />
                          <span>{lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
                        </button>
                        <span className="text-[11px] font-black text-slate-800">
                          {selectedCategoryTab === 'flights' && (lang === 'ar' ? 'رحلات الطيران' : 'Flight Booking')}
                          {selectedCategoryTab === 'hotels' && (lang === 'ar' ? 'فنادق النخبة' : 'Elite Hotels')}
                          {selectedCategoryTab === 'tourism' && (lang === 'ar' ? 'الباقات السياحية' : 'Tourism Packages')}
                          {selectedCategoryTab === 'visa' && (lang === 'ar' ? 'خدمات التأشيرات' : 'Visa Services')}
                          {selectedCategoryTab === 'umrah' && (lang === 'ar' ? 'باقات العمرة' : 'Umrah Packages')}
                          {selectedCategoryTab === 'hajj' && (lang === 'ar' ? 'تفويج وباقات الحج' : 'Hajj Packages')}
                          {selectedCategoryTab === 'bus' && (lang === 'ar' ? 'حجز الباصات' : 'Bus Booking')}
                          {selectedCategoryTab === 'cars' && (lang === 'ar' ? 'تأجير السيارات' : 'Car Rental')}
                          {selectedCategoryTab === 'transfers' && (lang === 'ar' ? 'النقل الخاص VIP' : 'Private Transfer')}
                        </span>
                      </div>
                    )}
                    
                    {/* Dynamic Rendering of Selected Top Category */}
                    {selectedCategoryTab === 'home' && (
                      <div className="space-y-5 animate-fade-in">
                        
                        {/* 1. Elegant Greeting Section */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-150 shadow-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-600 tracking-wider flex items-center gap-1">
                              <Sparkles size={10} className="fill-amber-500 text-amber-500 animate-spin" />
                              {lang === 'ar' ? 'العضوية الذهبية للنخبة' : 'GOLD ELITE MEMBERSHIP'}
                            </span>
                            <h3 className="text-xs font-black text-slate-800">
                              {lang === 'ar' ? 'مرحباً بك، محمد البرق 👋' : 'Welcome back, Mohamed 👋'}
                            </h3>
                            <p className="text-[9px] text-slate-400">
                              {lang === 'ar' ? 'اكتشف رحلتك الاستثنائية القادمة مع مساري' : 'Discover your next bespoke journey with Masari'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-mono text-slate-400">ID: #MSR-998</span>
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-0.5 rounded-full mt-1 border border-amber-500/15">
                              {lang === 'ar' ? 'نخبة متميزة' : 'Elite Status'}
                            </span>
                          </div>
                        </div>

                        {/* 2. Luxury Hero Banner with Animated Travel Imagery */}
                        <div className="relative h-44 rounded-2xl overflow-hidden shadow-md group border border-slate-150">
                          <img 
                            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" 
                            alt="Luxury Travel" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                            <span className="text-[9px] font-black text-amber-400 tracking-widest uppercase mb-1">
                              {lang === 'ar' ? 'إجازة العمر بانتظارك' : 'The Vacation of a Lifetime'}
                            </span>
                            <h2 className="text-xs font-black text-white leading-snug max-w-xs">
                              {lang === 'ar' ? 'رحلات فاخرة مصممة خصيصاً لتفوق توقعاتك' : 'Bespoke Private Journeys Designed to Surpass All Expectations'}
                            </h2>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[9px] text-slate-200 font-mono">
                                {lang === 'ar' ? 'تبدأ الباقات من $399' : 'Packages starting from $399'}
                              </span>
                              <button 
                                onClick={() => setSelectedCategoryTab('tourism')}
                                className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-[9px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <span>{lang === 'ar' ? 'اكتشف الآن' : 'Explore Now'}</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 3. Wallet Balance Preview (Luxury Card style) */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-4 shadow-lg border border-slate-800 relative overflow-hidden">
                          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest block">
                                {lang === 'ar' ? 'المحفظة الرقمية لنخبة مساري' : 'Masari Elite Digital Wallet'}
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black font-mono text-amber-400">
                                  {formatCurrency(2450.00)}
                                </span>
                              </div>
                            </div>
                            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
                              <Wallet size={16} className="text-amber-400 animate-pulse" />
                            </div>
                          </div>

                          <div className="border-t border-slate-800 my-3" />

                          <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span>{lang === 'ar' ? 'الرصيد نشط ومتاح للاستخدام' : 'Balance active & verified'}</span>
                            </div>
                            <button
                              onClick={() => setShowRechargeModal(true)}
                              className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer text-[10px]"
                            >
                              <span>{lang === 'ar' ? 'شحن المحفظة +' : 'Top-up Balance +'}</span>
                            </button>
                          </div>
                        </div>

                        {/* 4. Quick Services & Features Hub */}
                        <QuickServicesGrid 
                          lang={lang} 
                          onSelectService={(section) => {
                            if (section === 'travelers') {
                              setActiveTab('profile');
                            } else {
                              setSelectedCategoryTab(section as any);
                            }
                          }} 
                          openSmartSearch={() => setShowSmartSearch(true)} 
                          openAiAssistant={() => setActiveTab('ai')} 
                        />


                        {/* 5. Special Offers Carousel */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                              {lang === 'ar' ? 'العروض الحصرية والكوبونات' : 'Bespoke Vouchers & Hot Offers'}
                            </h4>
                            <span className="text-[8px] bg-amber-500 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                              MASARI15
                            </span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                            {[
                              { titleAr: 'باقة مكة المكرمة الفاخرة', titleEn: 'Makkah Royal Suite Offer', descAr: 'استخدم الكود MASARI15 لخصم 15٪ كاملة على الفنادق', descEn: 'Apply coupon code MASARI15 for immediate 15% discount', discount: '15% OFF', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80' },
                              { titleAr: 'مغامرة سقطرى الساحرة', titleEn: 'Socotra Island All-Inclusive', descAr: 'سعر ترويجي حصري يشمل تذاكر الطيران والإقامة والجولات', descEn: 'All-inclusive local package with internal flight tickets included', discount: 'SPECIAL', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' }
                            ].map((offer, idx) => (
                              <div key={idx} className="bg-white border border-slate-150 rounded-xl overflow-hidden min-w-[220px] max-w-[220px] shadow-sm flex flex-col justify-between">
                                <div className="h-24 relative">
                                  <img src={offer.image} alt={offer.titleEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <span className="absolute top-2 right-2 bg-amber-500 text-white font-mono font-black text-[8px] px-1.5 py-0.5 rounded shadow-sm">
                                    {offer.discount}
                                  </span>
                                </div>
                                <div className="p-2.5 space-y-1">
                                  <h5 className="text-[10px] font-black text-slate-800">
                                    {lang === 'ar' ? offer.titleAr : offer.titleEn}
                                  </h5>
                                  <p className="text-[8px] text-slate-500 leading-tight">
                                    {lang === 'ar' ? offer.descAr : offer.descEn}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 6. Popular Destinations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {lang === 'ar' ? 'الوجهات الأكثر طلباً' : 'Prestigious Travel Destinations'}
                          </h4>
                          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1.5">
                            {[
                              { nameAr: 'جزيرة سقطرى', nameEn: 'Socotra Island', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=200&q=80', tagAr: 'طبيعة بكر', tagEn: 'Exotic Nature' },
                              { nameAr: 'مكة المكرمة', nameEn: 'Makkah', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=200&q=80', tagAr: 'روحانيات', tagEn: 'Holy Sanctuary' },
                              { nameAr: 'القاهرة', nameEn: 'Cairo', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=200&q=80', tagAr: 'تاريخ وحضارة', tagEn: 'Historic Nile' },
                              { nameAr: 'دبي', nameEn: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80', tagAr: 'تسوق فاخر', tagEn: 'Modern Luxury' },
                              { nameAr: 'المدينة المنورة', nameEn: 'Madinah', image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=200&q=80', tagAr: 'هدوء وسكينة', tagEn: 'Peaceful' },
                            ].map((dest, idx) => (
                              <div key={idx} className="flex flex-col items-center text-center space-y-1 min-w-[70px] cursor-pointer">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200/80 shadow-xs hover:border-amber-500 transition-all duration-150">
                                  <img src={dest.image} alt={dest.nameEn} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="text-[9px] font-black text-slate-800 truncate w-full">
                                  {lang === 'ar' ? dest.nameAr : dest.nameEn}
                                </span>
                                <span className="text-[6px] text-amber-600 block leading-none">
                                  {lang === 'ar' ? dest.tagAr : dest.tagEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 7. Recommended Trips & 8. Featured Hotels */}
                        <div className="grid grid-cols-2 gap-3">
                          
                          {/* Recommended Trips Block */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-850 uppercase tracking-tight">
                              {lang === 'ar' ? 'رحلات موصى بها' : 'Signature Trips'}
                            </h4>
                            {[
                              { nameAr: 'باقة سقطرى الملكية', nameEn: 'Socotra Royal Trip', price: 850, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80' },
                              { nameAr: 'باقة القاهرة الكلاسيكية', nameEn: 'Cairo Classic Suite', price: 420, image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=200&q=80' }
                            ].map((trip, idx) => (
                              <div key={idx} className="bg-white border border-slate-150 rounded-xl p-2 flex gap-2 items-center hover:shadow-xs transition-shadow">
                                <img src={trip.image} alt={trip.nameEn} className="w-9 h-9 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-[8px] font-black text-slate-800 truncate">
                                    {lang === 'ar' ? trip.nameAr : trip.nameEn}
                                  </h5>
                                  <span className="text-[8px] font-mono font-bold text-masari-blue block">
                                    {formatCurrency(trip.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Featured Hotels Block */}
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-slate-850 uppercase tracking-tight">
                              {lang === 'ar' ? 'فنادق مميزة' : 'Elite Stays'}
                            </h4>
                            {[
                              { nameAr: 'شيراتون صنعاء الفاخر', nameEn: 'Sheraton Sana\'a Luxury', price: 120, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=200&q=80' },
                              { nameAr: 'أبراج الكسوة مكة', nameEn: 'Al Kiswah Towers Hotel', price: 85, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=200&q=80' }
                            ].map((hotel, idx) => (
                              <div key={idx} className="bg-white border border-slate-150 rounded-xl p-2 flex gap-2 items-center hover:shadow-xs transition-shadow">
                                <img src={hotel.image} alt={hotel.nameEn} className="w-9 h-9 rounded-lg object-cover" referrerPolicy="no-referrer" />
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-[8px] font-black text-slate-800 truncate">
                                    {lang === 'ar' ? hotel.nameAr : hotel.nameEn}
                                  </h5>
                                  <span className="text-[8px] font-mono font-bold text-amber-600 block">
                                    {formatCurrency(hotel.price)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                        </div>

                        {/* 9. Top Airlines Partners */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {lang === 'ar' ? 'شركاء الطيران المعتمدون' : 'Licensed Carrier Fleet'}
                          </h4>
                          <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-150 text-center">
                            {[
                              { code: 'IY', nameAr: 'اليمنية', nameEn: 'Yemenia' },
                              { code: 'QB', nameAr: 'طيران بلقيس', nameEn: 'Queen Bilqis' },
                              { code: 'SV', nameAr: 'السعودية', nameEn: 'Saudia' },
                              { code: 'EK', nameAr: 'طيران الإمارات', nameEn: 'Emirates' }
                            ].map((air) => (
                              <div key={air.code} className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center justify-center">
                                <div className="w-6 h-6 bg-masari-blue/10 text-masari-blue font-black rounded-full flex items-center justify-center text-[10px]">
                                  {air.code}
                                </div>
                                <span className="text-[7px] font-black text-slate-700 block mt-1 truncate w-full">
                                  {lang === 'ar' ? air.nameAr : air.nameEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 10. Upcoming Reservations */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {lang === 'ar' ? 'رحلتك القادمة ومرحلة الحجز' : 'Active Reservation & Gate Pass'}
                          </h4>
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-3 rounded-xl border border-slate-150 flex justify-between items-center relative overflow-hidden">
                            <div className="space-y-1 flex-1">
                              <span className="text-[7px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                                {lang === 'ar' ? 'مؤكد وموثق' : 'VERIFIED'}
                              </span>
                              <h5 className="text-[11px] font-black text-slate-800 leading-snug mt-1">
                                {lang === 'ar' ? 'اليمنية • صنعاء إلى القاهرة' : 'Yemenia Airways • Sanaa ➔ Cairo'}
                              </h5>
                              <div className="flex gap-2 text-[8px] font-mono text-slate-500 mt-1">
                                <span>Ref: MSR-2026-FLI</span>
                                <span>Date: 2026-08-10</span>
                              </div>
                            </div>
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center p-1 relative shadow-sm shrink-0">
                              <div className="w-full h-full bg-slate-900 rounded-[2px]" />
                              <span className="absolute inset-0.5 bg-white rounded flex items-center justify-center text-[5px] font-black font-mono">QR</span>
                            </div>
                          </div>
                        </div>

                        {/* 11. Favorite Trips */}
                        {favorites.length > 0 && (
                          <div className="space-y-2 animate-fade-in">
                            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                              {lang === 'ar' ? 'المفضلة الفاخرة لديك' : 'Your Curated Favorites'}
                            </h4>
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                              {favorites.map((favId) => {
                                return (
                                  <div key={favId} className="bg-white border border-slate-150 p-2 rounded-xl flex items-center gap-2 min-w-[120px] max-w-[120px] shadow-sm">
                                    <div className="w-6 h-6 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center">
                                      <Heart size={11} className="fill-red-500 text-red-500" />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 truncate flex-1">
                                      ID: {favId}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 12. Travel Tips & Advisories */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {lang === 'ar' ? 'إرشادات وتوجيهات مسافر مساري' : 'Essential Yemeni Travel Guides'}
                          </h4>
                          <div className="space-y-1.5">
                            {[
                              { titleAr: 'المستندات المطلوبة لإصدار تأشيرة العمرة الإلكترونية', titleEn: 'Required Docs for Saudi Umrah E-Visa' },
                              { titleAr: 'دليل السفر الشامل والتخييم الآمن في جزيرة سقطرى', titleEn: 'Socotra Island Packing and Eco-guidelines' }
                            ].map((tip, idx) => (
                              <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-150 text-[9px] text-slate-600 flex gap-2 items-center">
                                <Info size={11} className="text-masari-blue shrink-0" />
                                <span className="font-medium leading-tight flex-1">
                                  {lang === 'ar' ? tip.titleAr : tip.titleEn}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 13. AI Assistant Shortcut */}
                        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-3.5 rounded-2xl text-white flex justify-between items-center relative overflow-hidden shadow-md">
                          <div className="space-y-1 z-10">
                            <span className="text-[8px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block uppercase">
                              {lang === 'ar' ? 'مساعد الذكاء الاصطناعي VIP' : 'AI Private Butler'}
                            </span>
                            <h5 className="text-[11px] font-black leading-tight mt-1">
                              {lang === 'ar' ? 'مساعد مساري الذكي لتصميم باقتك الفاخرة' : 'Bespoke Travel Consultation, Assisted by AI'}
                            </h5>
                          </div>
                          <button
                            onClick={() => {
                              alert(lang === 'ar' ? 'المساعد الذكي لمساري جاهز لخدمتك مجاناً مع تحديثات النظام القادمة.' : 'Masari AI counselor is on standby for the next system update.');
                            }}
                            className="bg-white hover:bg-opacity-95 text-slate-900 font-bold text-[9px] px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition-all shadow-sm"
                          >
                            {lang === 'ar' ? 'تحدث الآن' : 'Consult AI'}
                          </button>
                        </div>

                        {/* 14. Latest Notifications Summary banner */}
                        <div className="bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl flex items-center gap-2 text-slate-700 text-[9px]">
                          <Bell size={12} className="text-amber-600 shrink-0" />
                          <span className="font-semibold leading-relaxed">
                            {lang === 'ar' ? 'آخر إشعار: تم تفعيل ترقيتك لعضوية النخبة الذهبية مجاناً لموسم صيف 2026.' : 'Notice: Free premium VIP upgrade is active for 2026.'}
                          </span>
                        </div>

                        {/* 15. Partner Logos (Credibility credentials) */}
                        <div className="space-y-1.5 text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                            {lang === 'ar' ? 'جهات الترخيص والاعتماد الدولي' : 'Licensed Credentials & Partners'}
                          </span>
                          <div className="flex justify-center items-center gap-3 bg-white p-2 rounded-xl border border-slate-150 text-[8px] font-mono text-slate-400">
                            <span>IATA LICENSED</span>
                            <span>•</span>
                            <span>MINISTRY OF TOURISM YEMEN</span>
                            <span>•</span>
                            <span>HAJJ ASSOCIATION</span>
                          </div>
                        </div>

                        {/* 16. Customer Reviews */}
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            {lang === 'ar' ? 'شهادات وآراء نخبة عملائنا' : 'Yemeni Elite Travelers Reviews'}
                          </h4>
                          <div className="bg-white border border-slate-150 p-3 rounded-xl space-y-2">
                            <p className="text-[9px] text-slate-500 italic leading-relaxed">
                              {lang === 'ar' 
                                ? '"تجربة مذهلة في رحلة العمرة الملكية، طاقم مساري كان متواجداً معنا في كل خطوة ومحطتنا كانت مميزة للغاية."' 
                                : '"Amazing custom service. They handled my Socotra eco-trip with extreme precision and VIP status. Best service in Yemen."'}
                            </p>
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-slate-700">
                                {lang === 'ar' ? 'م. خالد الطويل (عدن)' : 'Eng. Khalid Al-Tawil (Aden)'}
                              </span>
                              <div className="flex gap-0.5 text-amber-500">
                                {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-amber-500" />)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 17. Statistics section */}
                        <div className="grid grid-cols-3 gap-2 bg-white border border-slate-150 p-3 rounded-xl text-center">
                          <div>
                            <strong className="text-xs font-black font-mono text-masari-blue block">+50k</strong>
                            <span className="text-[7px] font-black text-slate-400 uppercase">
                              {lang === 'ar' ? 'حاج ومعتمر' : 'Pilgrims'}
                            </span>
                          </div>
                          <div>
                            <strong className="text-xs font-black font-mono text-amber-600 block">+120</strong>
                            <span className="text-[7px] font-black text-slate-400 uppercase">
                              {lang === 'ar' ? 'وجهة سياحية' : 'Destinations'}
                            </span>
                          </div>
                          <div>
                            <strong className="text-xs font-black font-mono text-emerald-600 block">100%</strong>
                            <span className="text-[7px] font-black text-slate-400 uppercase">
                              {lang === 'ar' ? 'خدمة معتمدة' : 'Official License'}
                            </span>
                          </div>
                        </div>

                        {/* 18. Promotional banners */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-amber-700 block">
                              {lang === 'ar' ? 'عضوية الفرسان الفضية' : 'Al-Fursan Club Upgrade'}
                            </span>
                            <span className="text-[8px] text-slate-500 block">
                              {lang === 'ar' ? 'ادخل الكود MASARI15 لخصم 15٪ فوري' : 'Get instant travel credit bonus with codes'}
                            </span>
                          </div>
                          <div className="bg-amber-500 text-white font-mono text-[8px] px-1.5 py-0.5 rounded font-black">
                            15% OFF
                          </div>
                        </div>

                        {/* 19. Footer section */}
                        <div className="border-t border-slate-200 pt-4 text-center space-y-1.5 pb-2 shrink-0">
                          <span className="text-[10px] font-black text-slate-700 block font-mono">
                            MASARI TRAVEL PLATFORM
                          </span>
                          <span className="text-[7px] text-slate-400 block max-w-xs mx-auto leading-relaxed">
                            {lang === 'ar' 
                              ? 'جميع الحقوق محفوظة © 2026. شركة مساري المعتمدة رسمياً ووكيل الطيران الدولي المرخص بموجب قوانين سلطة الطيران والوزارة.' 
                              : 'All rights reserved © 2026. Masari Travel Agency, IATA Accredited Carrier, registered under the Ministry of Tourism guidelines.'}
                          </span>
                        </div>

                      </div>
                    )}

                    {selectedCategoryTab === 'flights' && (
                      <div className="space-y-4">
                        {/* Interactive Flights search form */}
                        <form onSubmit={handleFlightSearch} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm space-y-3">
                          <div className="flex justify-between gap-1.5 text-[9px] font-bold">
                            <button
                              id="trip-one-btn"
                              type="button"
                              onClick={() => setFlightTripType('one')}
                              className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                                flightTripType === 'one' ? 'bg-masari-blue/10 text-masari-blue' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {lang === 'ar' ? 'ذهاب' : 'One Way'}
                            </button>
                            <button
                              id="trip-round-btn"
                              type="button"
                              onClick={() => setFlightTripType('round')}
                              className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                                flightTripType === 'round' ? 'bg-masari-blue/10 text-masari-blue' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {lang === 'ar' ? 'ذهاب وإياب' : 'Round Trip'}
                            </button>
                            <button
                              id="trip-multi-btn"
                              type="button"
                              onClick={() => setFlightTripType('multi')}
                              className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
                                flightTripType === 'multi' ? 'bg-masari-blue/10 text-masari-blue' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {lang === 'ar' ? 'ذهاب وإياب مفتوح' : 'Multi-City'}
                            </button>
                          </div>

                          {/* From dropdown search */}
                          <div className="space-y-1 relative">
                            <label className="text-[9px] font-bold text-slate-500">{lang === 'ar' ? 'من' : 'From'}</label>
                            <div 
                              onClick={() => setShowFlightDropdownFrom(!showFlightDropdownFrom)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs flex justify-between items-center cursor-pointer"
                            >
                              <span>{flightFrom}</span>
                              <MapPin size={11} className="text-slate-400" />
                            </div>
                            {showFlightDropdownFrom && (
                              <div className="absolute left-0 right-0 top-12 bg-white border border-slate-200 rounded-lg shadow-lg z-30 max-h-32 overflow-y-auto text-xs py-1">
                                {['Sanaa (SAH)', 'Aden (ADE)', 'Cairo (CAI)', 'Doha (DOH)', 'Sharjah (SHJ)'].map((city) => (
                                  <div 
                                    key={city}
                                    onClick={() => {
                                      setFlightFrom(city);
                                      setShowFlightDropdownFrom(false);
                                    }}
                                    className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer"
                                  >
                                    {city}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* To dropdown search */}
                          <div className="space-y-1 relative">
                            <label className="text-[9px] font-bold text-slate-500">{lang === 'ar' ? 'إلى' : 'To'}</label>
                            <div 
                              onClick={() => setShowFlightDropdownTo(!showFlightDropdownTo)} 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs flex justify-between items-center cursor-pointer"
                            >
                              <span>{flightTo}</span>
                              <MapPin size={11} className="text-slate-400" />
                            </div>
                            {showFlightDropdownTo && (
                              <div className="absolute left-0 right-0 top-12 bg-white border border-slate-200 rounded-lg shadow-lg z-30 max-h-32 overflow-y-auto text-xs py-1">
                                {['Cairo (CAI)', 'Sanaa (SAH)', 'Doha (DOH)', 'Sharjah (SHJ)', 'Dubai (DXB)'].map((city) => (
                                  <div 
                                    key={city}
                                    onClick={() => {
                                      setFlightTo(city);
                                      setShowFlightDropdownTo(false);
                                    }}
                                    className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer"
                                  >
                                    {city}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                <Calendar size={10} />
                                <span>{lang === 'ar' ? 'تاريخ الذهاب' : 'Dep Date'}</span>
                              </label>
                              <input 
                                type="date" 
                                value={flightDate} 
                                onChange={(e) => setFlightDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                <Calendar size={10} />
                                <span>{lang === 'ar' ? 'تاريخ العودة' : 'Ret Date'}</span>
                              </label>
                              <input 
                                type="date" 
                                value={flightReturnDate} 
                                disabled={flightTripType === 'one'}
                                onChange={(e) => setFlightReturnDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] focus:outline-none disabled:opacity-50" 
                              />
                            </div>
                          </div>

                          {/* Passengers selector */}
                          <div className="border-t border-slate-150 pt-2 grid grid-cols-3 gap-1.5 text-center text-[9px] font-bold text-slate-500">
                            <div>
                              <span>{lang === 'ar' ? 'البالغين 12+' : 'Adults'}</span>
                              <div className="flex items-center justify-center gap-1 mt-1 bg-slate-50 rounded px-1">
                                <button 
                                  id="flight-adult-dec"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, adults: Math.max(1, flightPassengers.adults - 1) })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-slate-800">{flightPassengers.adults}</span>
                                <button 
                                  id="flight-adult-inc"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, adults: flightPassengers.adults + 1 })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                            <div>
                              <span>{lang === 'ar' ? 'الأطفال 2-11' : 'Children'}</span>
                              <div className="flex items-center justify-center gap-1 mt-1 bg-slate-50 rounded px-1">
                                <button 
                                  id="flight-child-dec"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, children: Math.max(0, flightPassengers.children - 1) })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-slate-800">{flightPassengers.children}</span>
                                <button 
                                  id="flight-child-inc"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, children: flightPassengers.children + 1 })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                            <div>
                              <span>{lang === 'ar' ? 'الرضع أقل من 2' : 'Infants'}</span>
                              <div className="flex items-center justify-center gap-1 mt-1 bg-slate-50 rounded px-1">
                                <button 
                                  id="flight-infant-dec"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, infants: Math.max(0, flightPassengers.infants - 1) })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-slate-800">{flightPassengers.infants}</span>
                                <button 
                                  id="flight-infant-inc"
                                  type="button" 
                                  onClick={() => setFlightPassengers({ ...flightPassengers, infants: flightPassengers.infants + 1 })} 
                                  className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <button
                            id="flight-search-submit"
                            type="submit"
                            className="w-full bg-masari-orange hover:bg-opacity-95 text-white py-2 rounded-lg text-xs font-bold font-sans cursor-pointer transition-colors text-center"
                          >
                            {isSearchingFlights ? (lang === 'ar' ? 'جاري البحث...' : 'Searching...') : (lang === 'ar' ? 'حجز وبحث' : 'Search & Book')}
                          </button>
                        </form>

                        {/* Search Flights results */}
                        <div className="space-y-2.5">
                          <h4 className="text-[11px] font-bold text-slate-800 border-r-3 border-masari-cyan pr-1.5 pl-1.5">
                            {lang === 'ar' ? 'رحلات الطيران المتاحة' : 'Available Flight Offers'}
                          </h4>

                          {/* Default state: show some mock flights prior to search if results empty */}
                          {(flightSearchResults.length > 0 ? flightSearchResults : mockFlights).map((flight) => (
                            <div key={flight.id} className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={flight.airlineLogoUrl} 
                                    alt="Airline" 
                                    referrerPolicy="no-referrer"
                                    className="w-6 h-6 rounded-full object-cover" 
                                  />
                                  <div>
                                    <span className="text-[10px] font-black block text-slate-800">{flight.airline}</span>
                                    <span className="text-[8px] font-mono text-slate-400">{flight.flightNo}</span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-masari-blue font-mono">{formatCurrency(flight.price)}</span>
                              </div>

                              <div className="flex justify-between items-center text-center px-4 bg-slate-50 py-1.5 rounded-lg text-xs">
                                <div>
                                  <span className="font-bold text-slate-800 block">{flight.departureTime}</span>
                                  <span className="text-[8px] font-mono text-slate-400">{flight.from}</span>
                                </div>
                                <div className="flex-1 px-4 relative flex flex-col items-center justify-center">
                                  <span className="text-[7px] text-slate-400 font-mono block">{flight.duration}</span>
                                  <div className="w-full h-[1.5px] bg-slate-200 relative my-0.5">
                                    <div className="absolute w-1 h-1 rounded-full bg-masari-cyan left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
                                  </div>
                                  <span className="text-[6px] text-slate-400 block">{flight.stops === 0 ? (lang === 'ar' ? 'مباشر' : 'Direct') : `${flight.stops} stop`}</span>
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 block">{flight.arrivalTime}</span>
                                  <span className="text-[8px] font-mono text-slate-400">{flight.to}</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-[8px] text-slate-400">{flight.classType} Class</span>
                                <button
                                  id={`book-flight-${flight.id}`}
                                  onClick={() => bookGeneralPackage('flight', flight.id, `${flight.airline} &bull; ${flight.from} - ${flight.to}`, `${flight.airline} &bull; ${flight.from} - ${flight.to}`, flight.price)}
                                  className="bg-masari-blue hover:bg-opacity-95 text-white text-[9px] font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-colors"
                                >
                                  {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* B. TOURISM CATEGORY VIEW */}
                    {selectedCategoryTab === 'tourism' && (
                      <div className="space-y-4">
                        {/* Country filtering dropdown representation */}
                        <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm space-y-2">
                          <label className="text-[10px] font-extrabold text-slate-500 uppercase">{lang === 'ar' ? 'اختر الدولة الوجهة' : 'Select Destination Country'}</label>
                          <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1.5">
                            <button
                              id="country-all-btn"
                              onClick={() => setSelectedCountry('')}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                                !selectedCountry ? 'bg-masari-blue text-white' : 'bg-slate-150 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {lang === 'ar' ? 'الكل' : 'All'}
                            </button>
                            {middleEastCountries.slice(0, 7).map((c) => (
                              <button
                                id={`country-${c.code}-btn`}
                                key={c.code}
                                onClick={() => setSelectedCountry(c.en)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                                  selectedCountry === c.en ? 'bg-masari-blue text-white' : 'bg-slate-150 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <span>{c.flag}</span>
                                <span>{lang === 'ar' ? c.ar : c.en}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Packages List */}
                        <div className="space-y-3">
                          <h4 className="text-[11px] font-bold text-slate-800 border-r-3 border-masari-cyan pr-1.5 pl-1.5">
                            {lang === 'ar' ? 'العروض السياحية الفاخرة' : 'Luxury Holiday Packages'}
                          </h4>

                          {mockTourismPackages
                            .filter(pkg => !selectedCountry || pkg.countryEn === selectedCountry)
                            .map((pkg) => (
                              <div key={pkg.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs">
                                <div className="h-28 w-full relative">
                                  <img 
                                    src={pkg.image} 
                                    alt={pkg.titleEn} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover" 
                                  />
                                  <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-0.5 rounded text-[9px] font-mono">
                                    {pkg.durationDays} {lang === 'ar' ? 'أيام' : 'Days'}
                                  </div>
                                  <div className="absolute bottom-2 right-2 bg-masari-blue text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-md font-mono">
                                    {formatCurrency(pkg.price)}
                                  </div>
                                </div>

                                <div className="p-3 space-y-2">
                                  <div>
                                    <span className="text-[8px] font-mono text-masari-cyan uppercase font-bold">
                                      {lang === 'ar' ? pkg.countryAr : pkg.countryEn}
                                    </span>
                                    <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                                      {lang === 'ar' ? pkg.titleAr : pkg.titleEn}
                                    </h4>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                      {lang === 'ar' ? 'أبرز المعالم:' : 'Highlights:'}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {(lang === 'ar' ? pkg.highlightsAr : pkg.highlightsEn).map((h, i) => (
                                        <span key={i} className="text-[8px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100">
                                          {h}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 mt-2">
                                    <span className="text-[8px] text-slate-400">
                                      {lang === 'ar' ? 'شامل الفنادق والإفطار' : 'Hotel + B/F Included'}
                                    </span>
                                    <button
                                      id={`book-tour-${pkg.id}`}
                                      onClick={() => bookGeneralPackage('tourism', pkg.id, pkg.titleAr, pkg.titleEn, pkg.price)}
                                      className="bg-masari-blue hover:bg-opacity-95 text-white text-[9px] font-bold px-3 py-1 rounded-lg cursor-pointer transition-colors"
                                    >
                                      {lang === 'ar' ? 'احجز الآن' : 'Book Tour'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* C. UMRAH CATEGORY VIEW */}
                    {selectedCategoryTab === 'umrah' && (
                      <div className="space-y-4">
                        <div className="p-3 bg-masari-blue/5 rounded-xl border border-masari-blue/10 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-masari-blue/10 text-masari-blue flex items-center justify-center text-xs">
                            🕌
                          </div>
                          <div>
                            <h5 className="text-[10px] font-bold text-slate-800">{lang === 'ar' ? 'رحلات العمرة للعام 1447هـ' : 'Umrah Journeys 1447 AH'}</h5>
                            <p className="text-[8px] text-slate-400">{lang === 'ar' ? 'باقات متكاملة شاملة الإرشاد والتأشيرات المباشرة.' : 'Comprehensive packages including visa support.'}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {mockUmrahPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs">
                              <div className="h-28 w-full relative">
                                <img 
                                  src={pkg.image} 
                                  alt={pkg.titleEn} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute top-2 left-2 bg-masari-blue text-white px-2 py-0.5 rounded text-[8px] font-bold font-mono">
                                  {pkg.durationDays} {lang === 'ar' ? 'يوماً' : 'Days'}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-slate-900/90 text-white px-2 py-1 rounded-lg text-[10px] font-black font-mono">
                                  {formatCurrency(pkg.price)}
                                </div>
                              </div>

                              <div className="p-3 space-y-2">
                                <h4 className="text-[11px] font-black text-slate-850 leading-tight">
                                  {lang === 'ar' ? pkg.titleAr : pkg.titleEn}
                                </h4>

                                <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-500 bg-slate-50 p-1.5 rounded">
                                  <div>
                                    <span className="text-slate-400 block">{lang === 'ar' ? 'فندق مكة:' : 'Makkah Hotel:'}</span>
                                    <strong className="text-slate-700 font-bold truncate block">{lang === 'ar' ? pkg.hotelMakkahAr : pkg.hotelMakkahEn}</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block">{lang === 'ar' ? 'فندق المدينة:' : 'Madinah Hotel:'}</span>
                                    <strong className="text-slate-700 font-bold truncate block">{lang === 'ar' ? pkg.hotelMadinahAr : pkg.hotelMadinahEn}</strong>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    <img 
                                      src={pkg.airlineLogo} 
                                      alt="Carrier" 
                                      referrerPolicy="no-referrer"
                                      className="w-4 h-4 rounded-full object-cover" 
                                    />
                                    <span className="text-[8px] text-slate-400">{lang === 'ar' ? pkg.airlineNameAr : pkg.airlineNameEn}</span>
                                  </div>
                                  <button
                                    id={`book-umrah-${pkg.id}`}
                                    onClick={() => bookGeneralPackage('umrah', pkg.id, pkg.titleAr, pkg.titleEn, pkg.price)}
                                    className="bg-masari-blue hover:bg-opacity-95 text-white text-[9px] font-bold px-3 py-1 rounded-lg cursor-pointer transition-colors"
                                  >
                                    {lang === 'ar' ? 'احجز الآن' : 'Book Package'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* D. HAJJ CATEGORY VIEW */}
                    {selectedCategoryTab === 'hajj' && (
                      <div className="space-y-4">
                        {mockHajjPackages.map((pkg) => (
                          <div key={pkg.id} className="bg-white border-2 border-masari-gold/20 rounded-xl overflow-hidden shadow-sm">
                            <div className="h-32 w-full relative">
                              <img 
                                src={pkg.image} 
                                alt={pkg.titleEn} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute top-2 left-2 bg-masari-gold text-slate-900 px-2 py-0.5 rounded text-[8px] font-black font-mono shadow-md">
                                {lang === 'ar' ? 'حج معتمد رسمي' : 'Certified Hajj'}
                              </div>
                              <div className="absolute bottom-2 right-2 bg-slate-950/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black font-mono">
                                {formatCurrency(pkg.price)}
                              </div>
                            </div>

                            <div className="p-3.5 space-y-3">
                              <div>
                                <span className="text-[8px] font-mono text-masari-gold uppercase font-black block tracking-wider">
                                  {lang === 'ar' ? pkg.hotelAr : pkg.hotelEn}
                                </span>
                                <h4 className="text-[12px] font-black text-slate-900 leading-snug">
                                  {lang === 'ar' ? pkg.titleAr : pkg.titleEn}
                                </h4>
                              </div>

                              <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                                  {lang === 'ar' ? 'مواصفات الفندق والخدمات:' : 'Features & Hotel Inclusions:'}
                                </span>
                                <ul className="space-y-1 text-[8px] text-slate-600 list-none pl-0">
                                  {(lang === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((f, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-masari-gold mt-0.5">&#10004;</span>
                                      <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Interactive Hajj booking form exactly representation of the attached screens */}
                              <form onSubmit={(e) => handleHajjBooking(e, pkg)} className="border-t border-slate-150 pt-3.5 space-y-2">
                                <span className="text-[9px] font-extrabold text-masari-orange uppercase tracking-wider block">
                                  {lang === 'ar' ? 'طلب حجز معتمد للمنصة:' : 'Certified Platform Booking Form:'}
                                </span>
                                
                                <div className="space-y-1.5">
                                  <input 
                                    type="text" 
                                    value={hajjBookingForm.fullName}
                                    onChange={(e) => setHajjBookingForm({ ...hajjBookingForm, fullName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                    placeholder={lang === 'ar' ? 'ادخل اسمك الكامل' : 'Enter full name'}
                                  />
                                  <input 
                                    type="text" 
                                    value={hajjBookingForm.companionName}
                                    onChange={(e) => setHajjBookingForm({ ...hajjBookingForm, companionName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                    placeholder={lang === 'ar' ? 'اسم المرافق' : 'Companion name'}
                                  />
                                  <input 
                                    type="tel" 
                                    value={hajjBookingForm.phone}
                                    onChange={(e) => setHajjBookingForm({ ...hajjBookingForm, phone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                    placeholder={lang === 'ar' ? 'ادخل رقم الهاتف' : 'Enter phone number'}
                                  />
                                  <input 
                                    type="email" 
                                    value={hajjBookingForm.email}
                                    onChange={(e) => setHajjBookingForm({ ...hajjBookingForm, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                                    placeholder={lang === 'ar' ? 'ادخل الايميل' : 'Enter email address'}
                                  />
                                  
                                  <div className="grid grid-cols-2 gap-1.5">
                                    <div className="space-y-0.5">
                                      <label className="text-[7px] text-slate-400 block">{lang === 'ar' ? 'كم عدد الأطفال' : 'Children Count'}</label>
                                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg justify-center py-1">
                                        <button 
                                          id={`hajj-child-dec-${pkg.id}`}
                                          type="button" 
                                          onClick={() => setHajjBookingForm({ ...hajjBookingForm, childrenCount: Math.max(0, hajjBookingForm.childrenCount - 1) })} 
                                          className="text-slate-400 cursor-pointer"
                                        >
                                          <Minus size={8} />
                                        </button>
                                        <span className="text-[9px] text-slate-800 font-bold">{hajjBookingForm.childrenCount}</span>
                                        <button 
                                          id={`hajj-child-inc-${pkg.id}`}
                                          type="button" 
                                          onClick={() => setHajjBookingForm({ ...hajjBookingForm, childrenCount: hajjBookingForm.childrenCount + 1 })} 
                                          className="text-slate-400 cursor-pointer"
                                        >
                                          <Plus size={8} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="space-y-0.5">
                                      <label className="text-[7px] text-slate-400 block">{lang === 'ar' ? 'نوع السكن' : 'Housing Type'}</label>
                                      <select
                                        id={`hajj-housing-select-${pkg.id}`}
                                        value={hajjBookingForm.housingType}
                                        onChange={(e) => setHajjBookingForm({ ...hajjBookingForm, housingType: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[9px] focus:outline-none"
                                      >
                                        <option value="hotel">{lang === 'ar' ? 'غرفة فندقية' : 'Hotel Room'}</option>
                                        <option value="suite">{lang === 'ar' ? 'جناح فندقي' : 'Suite'}</option>
                                        <option value="tent">{lang === 'ar' ? 'خيمة المشاعر' : 'Holy Tent'}</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  id={`submit-hajj-booking-${pkg.id}`}
                                  type="submit"
                                  className="w-full bg-masari-orange hover:bg-opacity-95 text-white py-2 rounded-lg text-xs font-bold font-sans cursor-pointer transition-colors text-center"
                                >
                                  {lang === 'ar' ? 'حجز' : 'Submit Hajj Booking'}
                                </button>
                              </form>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* E. HOTELS CATEGORY VIEW */}
                    {selectedCategoryTab === 'hotels' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-amber-700 block">كوبون نخبة مساري المميز</span>
                            <span className="text-[9px] text-slate-500 block">ادخل الكود <strong className="font-mono text-slate-700">MASARI15</strong> لحجز فندقي فاخر بخصم 15%</span>
                          </div>
                          <div className="bg-amber-500 text-white font-mono text-[9px] px-2 py-1 rounded font-black">15% OFF</div>
                        </div>

                        {mockHotels.map((hotel) => {
                          const isFav = favorites.includes(hotel.id);
                          return (
                            <div key={hotel.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                              <div className="h-32 w-full relative">
                                <img 
                                  src={hotel.image} 
                                  alt={hotel.nameEn} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                />
                                <button 
                                  id={`fav-${hotel.id}`}
                                  onClick={() => {
                                    if (isFav) {
                                      setFavorites(favorites.filter(id => id !== hotel.id));
                                    } else {
                                      setFavorites([...favorites, hotel.id]);
                                    }
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-white/95 rounded-full text-slate-500 hover:text-red-500 transition-colors shadow-md cursor-pointer"
                                >
                                  <Heart size={14} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                                </button>
                                <div className="absolute bottom-2 right-2 bg-slate-950/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black font-mono">
                                  {formatCurrency(hotel.price)} <span className="text-[8px] font-normal">/{lang === 'ar' ? 'ليلة' : 'night'}</span>
                                </div>
                              </div>

                              <div className="p-3.5 space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                                      {lang === 'ar' ? hotel.nameAr : hotel.nameEn}
                                    </h4>
                                    <span className="text-[8px] text-slate-400 block mt-0.5">{lang === 'ar' ? hotel.locationAr : hotel.locationEn}</span>
                                  </div>
                                  <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-600">
                                    <Star size={9} className="fill-amber-500 text-amber-500" />
                                    <span>{hotel.rating}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {(lang === 'ar' ? hotel.amenitiesAr : hotel.amenitiesEn).map((am, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-600 text-[8px] px-1.5 py-0.5 rounded">
                                      {am}
                                    </span>
                                  ))}
                                </div>

                                <button
                                  id={`book-hotel-${hotel.id}`}
                                  onClick={() => setShowBookingDetailsSheet({
                                    show: true,
                                    type: 'hotel',
                                    id: hotel.id,
                                    titleAr: hotel.nameAr,
                                    titleEn: hotel.nameEn,
                                    price: hotel.price,
                                    image: hotel.image
                                  })}
                                  className="w-full mt-2 bg-masari-blue hover:bg-opacity-95 text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-colors text-center"
                                >
                                  {lang === 'ar' ? 'طلب تفاصيل الحجز الفندقي' : 'Request Hotel Booking'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedCategoryTab === 'bus' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-emerald-50 border border-emerald-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-emerald-700 block">برنامج النقل الجماعي والبري الحديث</span>
                            <span className="text-[9px] text-slate-500 block">حجوزات باصات VIP يومية مباشرة بين المحافظات والمنافذ الدولية</span>
                          </div>
                          <div className="bg-emerald-500 text-white font-mono text-[9px] px-2 py-1 rounded font-black">FAST TRIP</div>
                        </div>

                        {mockBuses.map((bus) => (
                          <div key={bus.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-3.5 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="bg-emerald-500/10 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full">
                                  {lang === 'ar' ? bus.classAr : bus.classEn}
                                </span>
                                <h4 className="text-[11px] font-black text-slate-800 leading-tight mt-1.5">
                                  {lang === 'ar' ? bus.companyAr : bus.companyEn}
                                </h4>
                                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mt-1">
                                  <MapPin size={9} />
                                  <span>{lang === 'ar' ? `${bus.fromAr} ➔ ${bus.toAr}` : `${bus.fromEn} to ${bus.toEn}`}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black text-emerald-600 block">{formatCurrency(bus.price)}</span>
                                <span className="text-[8px] text-slate-400 font-mono block mt-0.5">{lang === 'ar' ? 'ذهاب فقط' : 'One Way'}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[9px] text-slate-600">
                              <div>
                                <span className="text-slate-400 block text-[7px] uppercase font-black">{lang === 'ar' ? 'وقت المغادرة:' : 'Departure:'}</span>
                                <span className="font-bold">{bus.departureTime}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[7px] uppercase font-black">{lang === 'ar' ? 'الوصول المتوقع:' : 'Arrival:'}</span>
                                <span className="font-bold">{bus.arrivalTime}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {(lang === 'ar' ? bus.amenitiesAr : bus.amenitiesEn).map((am, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-600 text-[8px] px-1.5 py-0.5 rounded">
                                  {am}
                                </span>
                              ))}
                            </div>

                            <button
                              id={`book-bus-${bus.id}`}
                              onClick={() => setShowBookingDetailsSheet({
                                show: true,
                                type: 'bus',
                                id: bus.id,
                                titleAr: `${bus.companyAr}: ${bus.fromAr} - ${bus.toAr}`,
                                titleEn: `${bus.companyEn}: ${bus.fromEn} to ${bus.toEn}`,
                                price: bus.price,
                                image: bus.image
                              })}
                              className="w-full bg-masari-blue hover:bg-opacity-95 text-white text-[10px] font-bold py-2.5 rounded-lg cursor-pointer transition-colors text-center"
                            >
                              {lang === 'ar' ? 'احجز تذكرة باص مخصصة الآن' : 'Book Bus Ticket'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCategoryTab === 'cars' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-cyan-50 border border-cyan-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-cyan-700 block">أسطول مساري البري الراقي</span>
                            <span className="text-[9px] text-slate-500 block">تأجير سيارات فاخرة واقتصادية مع خيارات سائق وتأمين شامل</span>
                          </div>
                          <div className="bg-cyan-500 text-white font-mono text-[9px] px-2 py-1 rounded font-black">UNLIMITED</div>
                        </div>

                        {mockCars.map((car) => (
                          <div key={car.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-32 w-full relative bg-slate-100">
                              <img 
                                src={car.image} 
                                alt={car.modelEn} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-amber-500/90 text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                                <Star size={8} className="fill-white text-white" />
                                <span>{car.rating}</span>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-slate-950/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black font-mono">
                                {formatCurrency(car.price)} <span className="text-[8px] font-normal">/{lang === 'ar' ? 'يوم' : 'day'}</span>
                              </div>
                            </div>

                            <div className="p-3.5 space-y-2">
                              <div>
                                <span className="text-[8px] font-bold text-cyan-600 block">{lang === 'ar' ? car.typeAr : car.typeEn}</span>
                                <h4 className="text-[11px] font-black text-slate-800 leading-tight mt-0.5">
                                  {lang === 'ar' ? car.modelAr : car.modelEn}
                                </h4>
                                <span className="text-[8px] text-slate-400 block mt-0.5">
                                  {lang === 'ar' ? `الشركة الموفرة: ${car.companyAr}` : `Provider: ${car.companyEn}`}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {(lang === 'ar' ? car.featuresAr : car.featuresEn).map((f, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 text-[8px] px-1.5 py-0.5 rounded">
                                    {f}
                                  </span>
                                ))}
                              </div>

                              <button
                                id={`book-car-${car.id}`}
                                onClick={() => setShowBookingDetailsSheet({
                                  show: true,
                                  type: 'car',
                                  id: car.id,
                                  titleAr: car.modelAr,
                                  titleEn: car.modelEn,
                                  price: car.price,
                                  image: car.image
                                })}
                                className="w-full mt-2 bg-masari-blue hover:bg-opacity-95 text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-colors text-center"
                              >
                                {lang === 'ar' ? 'طلب استئجار السيارة' : 'Request Car Rental'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCategoryTab === 'transfers' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-indigo-50 border border-indigo-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-indigo-700 block">خدمة التوصيل الملوكي والخاص</span>
                            <span className="text-[9px] text-slate-500 block">توصيل من المطارات وبين المدن المقدسة بأحدث السيارات الصالون والليموزين</span>
                          </div>
                          <div className="bg-indigo-500 text-white font-mono text-[9px] px-2 py-1 rounded font-black">VIP LOUNGE</div>
                        </div>

                        {mockTransfers.map((tf) => (
                          <div key={tf.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-32 w-full relative">
                              <img 
                                src={tf.image} 
                                alt={tf.nameEn} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 right-2 bg-slate-950/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black font-mono">
                                {formatCurrency(tf.price)}
                              </div>
                            </div>

                            <div className="p-3.5 space-y-2">
                              <div>
                                <h4 className="text-[11px] font-black text-slate-800 leading-snug">
                                  {lang === 'ar' ? tf.nameAr : tf.nameEn}
                                </h4>
                                <p className="text-[8px] text-slate-400 mt-1">
                                  {lang === 'ar' ? `المركبة: ${tf.vehicleAr}` : `Vehicle: ${tf.vehicleEn}`}
                                </p>
                              </div>

                              <div className="flex justify-between text-[8px] bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-600">
                                <div>
                                  <span className="text-slate-400 block text-[7px] uppercase font-black">{lang === 'ar' ? 'السعة الاستيعابية:' : 'Capacity:'}</span>
                                  <span className="font-bold">{lang === 'ar' ? tf.capacityAr : tf.capacityEn}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[7px] uppercase font-black">{lang === 'ar' ? 'مدة الرحلة المقدرة:' : 'Estimated Duration:'}</span>
                                  <span className="font-bold">{tf.duration}</span>
                                </div>
                              </div>

                              <button
                                id={`book-transfer-${tf.id}`}
                                onClick={() => setShowBookingDetailsSheet({
                                  show: true,
                                  type: 'transfer',
                                  id: tf.id,
                                  titleAr: tf.nameAr,
                                  titleEn: tf.nameEn,
                                  price: tf.price,
                                  image: tf.image
                                })}
                                className="w-full mt-2 bg-masari-blue hover:bg-opacity-95 text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-colors text-center"
                              >
                                {lang === 'ar' ? 'حجز التوصيل الفوري' : 'Request VIP Private Transfer'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCategoryTab === 'visa' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-amber-700 block">إصدار التأشيرات والوثائق الإلكترونية</span>
                            <span className="text-[9px] text-slate-500 block">بوابتك لإصدار تأشيرات العمرة والسياحة مع تأمين طبي معتمد</span>
                          </div>
                          <div className="bg-amber-500 text-white font-mono text-[9px] px-2 py-1 rounded font-black">FAST VISA</div>
                        </div>

                        {mockVisas.map((visa) => (
                          <div key={visa.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-32 w-full relative">
                              <img 
                                src={visa.image} 
                                alt={visa.titleEn} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute bottom-2 right-2 bg-slate-950/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-black font-mono">
                                {formatCurrency(visa.price)}
                              </div>
                            </div>

                            <div className="p-3.5 space-y-2">
                              <div>
                                <h4 className="text-[11px] font-black text-slate-800 leading-tight">
                                  {lang === 'ar' ? visa.titleAr : visa.titleEn}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 mt-1.5 text-[8px] text-slate-500">
                                  <div>
                                    <span className="block text-slate-400">{lang === 'ar' ? 'فترة المعالجة:' : 'Processing Time:'}</span>
                                    <span className="font-bold text-slate-700">{lang === 'ar' ? visa.processingTimeAr : visa.processingTimeEn}</span>
                                  </div>
                                  <div>
                                    <span className="block text-slate-400">{lang === 'ar' ? 'الصلاحية:' : 'Validity:'}</span>
                                    <span className="font-bold text-slate-700">{lang === 'ar' ? visa.validityAr : visa.validityEn}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">
                                  {lang === 'ar' ? 'المستندات المطلوبة:' : 'Required documents:'}
                                </span>
                                <ul className="space-y-1 text-[8px] text-slate-600 list-disc pl-3">
                                  {(lang === 'ar' ? visa.requirementsAr : visa.requirementsEn).map((req, idx) => (
                                    <li key={idx} className="leading-tight">{req}</li>
                                  ))}
                                </ul>
                              </div>

                              <button
                                id={`book-visa-${visa.id}`}
                                onClick={() => setShowBookingDetailsSheet({
                                  show: true,
                                  type: 'visa',
                                  id: visa.id,
                                  titleAr: visa.titleAr,
                                  titleEn: visa.titleEn,
                                  price: visa.price,
                                  image: visa.image
                                })}
                                className="w-full mt-2 bg-masari-blue hover:bg-opacity-95 text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-colors text-center"
                              >
                                {lang === 'ar' ? 'تقديم طلب التأشيرة الإلكتروني' : 'Apply for E-Visa'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* B. SEARCH BOTTOM NAVIGATION VIEW - MASARI AI PLATFORM INTEGRATION */}
                {activeTab === 'search' && (
                  <AiPlatformView
                    lang={lang}
                    bookings={bookings}
                    setBookings={setBookings}
                    wallet={wallet}
                    setWallet={setWallet}
                    walletTransactions={walletTransactions}
                    setWalletTransactions={setWalletTransactions}
                    currency={currency}
                    formatCurrency={formatCurrency}
                    setActiveTab={setActiveTab}
                  />
                )}

                {/* C. BOOKINGS BOTTOM NAVIGATION VIEW */}
                {activeTab === 'bookings' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150 shadow-xs">
                      <button
                        id="bookings-back-btn"
                        onClick={() => setActiveTab('home')}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-masari-blue transition-colors cursor-pointer"
                      >
                        <ArrowRight size={15} className={lang === 'ar' ? '' : 'rotate-180'} />
                        <span>{lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
                      </button>
                      <h4 className="text-[12px] font-black text-slate-800">
                        {lang === 'ar' ? 'رحلاتي وحجوزاتي المعتمدة' : 'My Active Vouchers & Bookings'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono text-[9px]">
                        {bookings.length} {lang === 'ar' ? 'حجوزات' : 'items'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs relative">
                          <span className={`absolute top-0 left-0 right-0 h-1.5 ${
                            booking.type === 'hajj' ? 'bg-masari-gold' : 
                            booking.type === 'umrah' ? 'bg-masari-cyan' : 'bg-masari-blue'
                          }`} />
                          
                          <div className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[8px] font-mono text-slate-400 block">{booking.bookingRef}</span>
                                <h5 className="text-[11px] font-black text-slate-850 leading-tight">
                                  {lang === 'ar' ? booking.titleAr : booking.titleEn}
                                </h5>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                                booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {lang === 'ar' 
                                  ? (booking.status === 'confirmed' ? 'مؤكد' : 'قيد المراجعة') 
                                  : (booking.status === 'confirmed' ? 'Confirmed' : 'Pending Review')}
                              </span>
                            </div>

                            <div className="border-t border-b border-dashed border-slate-150 py-2 grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-mono">
                              <div>
                                <span>{lang === 'ar' ? 'تاريخ الحجز:' : 'Booking Date:'}</span>
                                <strong className="text-slate-700 font-bold block">{booking.bookingDate}</strong>
                              </div>
                              <div>
                                <span>{lang === 'ar' ? 'تاريخ المغادرة:' : 'Dep Date:'}</span>
                                <strong className="text-slate-700 font-bold block">{booking.departureDate}</strong>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 text-[9px]">
                              <span className="text-slate-400">
                                {booking.details.passengersCount} {lang === 'ar' ? 'مسافرين' : 'Passenger(s)'}
                              </span>
                              <span className="font-bold text-masari-blue font-mono">
                                {formatCurrency(booking.price)}
                              </span>
                            </div>

                            {/* Ticket Voucher simulated barcode representation */}
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between gap-2 mt-2">
                              <div className="flex-1 space-y-0.5">
                                <span className="text-[7px] text-slate-400 block uppercase font-bold">{lang === 'ar' ? 'تذكرة الصعود والتحقق الرقمي' : 'Digital boarding verification'}</span>
                                <code className="text-[8px] font-mono text-slate-600 block">{booking.bookingRef}-PASS-2026</code>
                              </div>
                              {/* Simulated visual small barcode */}
                              <div className="flex gap-0.5 h-6 overflow-hidden pr-2">
                                <span className="w-1.5 bg-slate-900" />
                                <span className="w-0.5 bg-slate-900" />
                                <span className="w-1 bg-slate-900" />
                                <span className="w-1.5 bg-slate-900" />
                                <span className="w-0.5 bg-slate-900" />
                                <span className="w-1 bg-slate-900" />
                                <span className="w-1.5 bg-slate-900" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* D. SETTINGS BOTTOM NAVIGATION VIEW */}
                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150 shadow-xs">
                      <button
                        id="settings-back-btn"
                        onClick={() => setActiveTab('home')}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-masari-blue transition-colors cursor-pointer"
                      >
                        <ArrowRight size={15} className={lang === 'ar' ? '' : 'rotate-180'} />
                        <span>{lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
                      </button>
                      <h4 className="text-[12px] font-black text-slate-800">
                        {lang === 'ar' ? 'إعدادات المنصة والهوية' : 'Global Settings & Identity'}
                      </h4>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-150 p-3.5 space-y-4">
                      
                      {/* Language setting toggle */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'لغة واجهة المستخدم' : 'Interface Language'}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            id="lang-ar-btn"
                            onClick={() => setLang('ar')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                              lang === 'ar' ? 'bg-masari-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            العربية
                          </button>
                          <button
                            id="lang-en-btn"
                            onClick={() => setLang('en')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                              lang === 'en' ? 'bg-masari-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            English
                          </button>
                        </div>
                      </div>

                      {/* Currency setting toggle */}
                      <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'العملة المعروضة' : 'Preferred Currency'}</span>
                        </div>
                        <div className="flex gap-1 font-mono">
                          {['USD', 'SAR', 'YER'].map((curr) => (
                            <button
                              id={`currency-${curr}-btn`}
                              key={curr}
                              onClick={() => setCurrency(curr as Currency)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                currency === curr ? 'bg-masari-blue text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {curr}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* App Theme selector */}
                      <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'طابع الهوية الفاخرة' : 'Luxury Identity Theme'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-masari-gold">
                          {lang === 'ar' ? 'ذهبي ملكي (افتراضي)' : 'Royal Gold (Default)'}
                        </span>
                      </div>

                    </div>

                    <div className="bg-white rounded-xl border border-slate-150 p-1 divide-y divide-slate-100">
                      <button 
                        id="btn-sheet-about"
                        onClick={() => setActiveDetailSheet('about')}
                        className="w-full text-left flex items-center justify-between p-3 text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <Info size={13} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'من نحن وتاريخ مساري' : 'About Us & History'}</span>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>

                      <button 
                        id="btn-sheet-contact"
                        onClick={() => setActiveDetailSheet('contact')}
                        className="w-full text-left flex items-center justify-between p-3 text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail size={13} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'اتصل بنا وفروعنا المعتمدة' : 'Contact Us & Branches'}</span>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>

                      <button 
                        id="btn-sheet-help"
                        onClick={() => setActiveDetailSheet('help')}
                        className="w-full text-left flex items-center justify-between p-3 text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <HelpCircle size={13} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'مركز المساعدة والأسئلة الشائعة' : 'Help Center & FAQs'}</span>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>

                      <button 
                        id="btn-sheet-privacy"
                        onClick={() => setActiveDetailSheet('privacy')}
                        className="w-full text-left flex items-center justify-between p-3 text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <ShieldAlert size={13} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Policy'}</span>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>

                      <button 
                        id="btn-sheet-terms"
                        onClick={() => setActiveDetailSheet('terms')}
                        className="w-full text-left flex items-center justify-between p-3 text-[11px] hover:bg-slate-50 transition-colors cursor-pointer"
                        style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <FileSignature size={13} className="text-slate-400" />
                          <span>{lang === 'ar' ? 'الشروط والأحكام واللوائح' : 'Legal Terms & Conditions'}</span>
                        </div>
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>
                    </div>

                    {/* Offline mode / Sandbox confirmation */}
                    <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl flex gap-2 text-slate-600 text-[10px] leading-relaxed">
                      <AlertCircle size={14} className="text-masari-orange shrink-0 mt-0.5" />
                      <div>
                        <strong>{lang === 'ar' ? 'وضع التأسيس والتحقق:' : 'Pre-flight Architecture mode:'}</strong>
                        <p className="mt-0.5">
                          {lang === 'ar' ? 'هذه تجميعة تحقق محاكية وخالية من الأكواد البرمجية الضارة، والبيانات والعملات يتم تفعيلها محلياً.' : 'All calculations, currency switches, and bookings run securely on client context.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* E. PROFILE BOTTOM NAVIGATION VIEW (INTEGRATED WALLET & IDENTITY LEDGER PLATFORM) */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 pb-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150 shadow-xs">
                      <button
                        id="profile-back-btn"
                        onClick={() => setActiveTab('home')}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-masari-blue transition-colors cursor-pointer"
                      >
                        <ArrowRight size={15} className={lang === 'ar' ? '' : 'rotate-180'} />
                        <span>{lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
                      </button>
                      <h4 className="text-[12px] font-black text-slate-800">
                        {lang === 'ar' ? 'الملف الشخصي والمحفظة' : 'Profile & Wallet'}
                      </h4>
                    </div>
                    {/* Identity profile card */}
                    <div className="bg-white rounded-xl border border-slate-150 p-4 shadow-xs text-center space-y-3">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto border-2 border-masari-gold shadow-md">
                        <User size={28} className="text-slate-400" />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded bg-masari-gold/25 text-amber-800 text-[8px] font-bold tracking-wider inline-block">
                          {lang === 'ar' ? 'عضو نخبة VIP' : 'VIP ELITE MEMBER'}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 mt-1">محمد البرق</h4>
                        <p className="text-[10px] text-slate-400 font-mono">mhmdalbraq131@gmail.com</p>
                      </div>
                    </div>

                    {/* Cryptographic PII Simulation Block */}
                    <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-3 shadow-md border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-slate-400 tracking-wider font-bold uppercase">{lang === 'ar' ? 'البيانات الشخصية المشفرة (AES-256)' : 'PII Cryptographic Shield (AES-256)'}</span>
                        <button
                          id="pii-toggle-decrypt"
                          onClick={() => {
                            const showNow = !showWalletDetails;
                            setShowWalletDetails(showNow);
                            const piiAudit = {
                              id: `aud-${Date.now()}`,
                              action: showNow ? 'PII_DECRYPT_REQUESTED' : 'PII_RE_ENCRYPTED',
                              details: showNow ? 'تم استدعاء مفتاح فك التشفير وعرض بيانات جواز السفر المكتومة.' : 'تم تشفير وإخفاء بيانات الهوية الحساسة تلقائياً.',
                              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                              severity: 'INFO'
                            };
                            setSecurityLogs(prev => [piiAudit, ...prev]);
                          }}
                          className="px-2 py-0.5 rounded bg-masari-gold text-slate-900 text-[8px] font-bold hover:bg-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {showWalletDetails ? <EyeOff size={10} /> : <Lock size={10} />}
                          <span>{showWalletDetails ? (lang === 'ar' ? 'قفل البيانات' : 'Mask PII') : (lang === 'ar' ? 'فك تشفير PII' : 'Decrypt PII')}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-slate-850 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[8px] uppercase">{lang === 'ar' ? 'رقم الهوية الوطنية' : 'Yemeni National ID'}</span>
                          <strong className="font-mono text-white tracking-wide mt-0.5 block">
                            {showWalletDetails ? '101-3829-281' : '••••••••••••'}
                          </strong>
                        </div>
                        <div className="bg-slate-850 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[8px] uppercase">{lang === 'ar' ? 'رقم جواز السفر' : 'Passport No.'}</span>
                          <strong className="font-mono text-white tracking-wide mt-0.5 block">
                            {showWalletDetails ? '0912-YE-829A' : '••••••••••••'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Financial Hub Tabs */}
                    <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs">
                      {/* Inner Navigation Tabs */}
                      <div className="flex border-b border-slate-100 bg-slate-50 text-[9px] font-bold">
                        <button
                          onClick={() => setActiveWalletTab('overview')}
                          className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                            activeWalletTab === 'overview' ? 'border-masari-blue text-masari-blue bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'ar' ? 'المحفظة' : 'Wallet'}
                        </button>
                        <button
                          onClick={() => setActiveWalletTab('recharge')}
                          className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                            activeWalletTab === 'recharge' ? 'border-masari-blue text-masari-blue bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'ar' ? 'إيداع' : 'Deposit'}
                        </button>
                        <button
                          onClick={() => setActiveWalletTab('transfer')}
                          className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                            activeWalletTab === 'transfer' ? 'border-masari-blue text-masari-blue bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'ar' ? 'تحويل' : 'Transfer'}
                        </button>
                        <button
                          onClick={() => setActiveWalletTab('ledger')}
                          className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                            activeWalletTab === 'ledger' ? 'border-masari-blue text-masari-blue bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'ar' ? 'دفتر الأستاذ' : 'Ledger'}
                        </button>
                        <button
                          onClick={() => setActiveWalletTab('security')}
                          className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-b-2 ${
                            activeWalletTab === 'security' ? 'border-masari-blue text-masari-blue bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {lang === 'ar' ? 'الأمان' : 'Security'}
                        </button>
                      </div>

                      <div className="p-3.5 space-y-3">
                        {/* 1. OVERVIEW VIEW */}
                        {activeWalletTab === 'overview' && (
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block uppercase">{lang === 'ar' ? 'الرصيد المتاح الكلي' : 'Available Balance'}</span>
                                <strong className="text-sm font-black text-masari-blue font-mono">{formatCurrency(wallet.availableBalance)}</strong>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 block uppercase">{lang === 'ar' ? 'الحالة المالية' : 'Financial Status'}</span>
                                <span className="text-[8px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded block mt-0.5">
                                  {lang === 'ar' ? 'مؤمن ونشط' : 'Active Secured'}
                                </span>
                              </div>
                            </div>

                            {/* Wallet categories grids */}
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-500 text-[8px] block">{lang === 'ar' ? 'رصيد الحجز المعلق (الضمان)' : 'Escrow Reserved Balance'}</span>
                                <strong className="font-mono text-slate-700 mt-0.5 block">{formatCurrency(wallet.reservedBalance)}</strong>
                              </div>
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-500 text-[8px] block">{lang === 'ar' ? 'الرصيد المعلق (قيد التسوية)' : 'Settlement Pending Balance'}</span>
                                <strong className="font-mono text-slate-700 mt-0.5 block">{formatCurrency(wallet.pendingBalance)}</strong>
                              </div>
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-500 text-[8px] block">{lang === 'ar' ? 'رصيد المكافآت التراكمي' : 'Reward Points Balance'}</span>
                                <strong className="font-mono text-slate-700 mt-0.5 block">{formatCurrency(wallet.rewardBalance)}</strong>
                              </div>
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-slate-500 text-[8px] block">{lang === 'ar' ? 'رصيد بطاقات الهدايا' : 'Gift Wallet Balance'}</span>
                                <strong className="font-mono text-slate-700 mt-0.5 block">{formatCurrency(wallet.giftBalance)}</strong>
                              </div>
                            </div>

                            {/* Associated user details */}
                            <div className="border-t border-slate-100 pt-3 space-y-2 text-[11px]">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">{lang === 'ar' ? 'الهاتف المعتمد' : 'Primary Phone'}</span>
                                <strong className="text-slate-750 font-mono">+967 777 123 456</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">{lang === 'ar' ? 'الفرع والمقاصة' : 'Registration Hub / Clearing'}</span>
                                <strong className="text-slate-750">{lang === 'ar' ? 'المركز الرئيسي - صنعاء' : 'Main Branch - Sanaa'}</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. RECHARGE (DEPOSIT) VIEW */}
                        {activeWalletTab === 'recharge' && (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-700">{lang === 'ar' ? 'إيداع فوري عبر البطاقة المصرفية' : 'Instant Bank Card Settlement Gateway'}</h4>
                            <div className="space-y-1.5">
                              <label className="text-[8px] text-slate-500 font-bold block uppercase">{lang === 'ar' ? 'مبلغ الشحن (USD)' : 'Recharge Amount (USD)'}</label>
                              <div className="flex gap-1.5">
                                <input
                                  type="number"
                                  value={rechargeAmountInput}
                                  onChange={(e) => setRechargeAmountInput(e.target.value)}
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                                  placeholder="e.g. 500"
                                />
                                <button
                                  id="wallet-submit-recharge"
                                  onClick={() => {
                                    const parsed = parseFloat(rechargeAmountInput);
                                    if (isNaN(parsed) || parsed <= 0) {
                                      alert(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح!' : 'Please enter a valid deposit amount!');
                                      return;
                                    }
                                    const updatedAvailable = wallet.availableBalance + parsed;
                                    setWallet({
                                      ...wallet,
                                      availableBalance: updatedAvailable
                                    });

                                    // Insert Transaction Record
                                    const txId = `tx-deposit-${Date.now()}`;
                                    const newTx = {
                                      id: txId,
                                      referenceNo: `MSR-TX-${Date.now().toString().slice(-6)}`,
                                      type: 'deposit',
                                      status: 'completed',
                                      amount: parsed,
                                      descriptionAr: `شحن رصيد المحفظة عبر بطاقة الائتمان`,
                                      descriptionEn: `Instant Credit Card Deposit Approved`,
                                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                    };
                                    setWalletTransactions(prev => [newTx, ...prev]);

                                    // Insert Ledger Record
                                    const newLedger = {
                                      id: `led-${Date.now()}`,
                                      debit: 0.0,
                                      credit: parsed,
                                      balanceAfter: updatedAvailable,
                                      description: 'إيداع فوري من بوابة البطاقات المصرفية',
                                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                    };
                                    setLedgerEntries(prev => [newLedger, ...prev]);

                                    // Security audit record
                                    const newAudit = {
                                      id: `aud-${Date.now()}`,
                                      action: 'WALLET_FUNDS_TOUCHED',
                                      details: `عملية إيداع ناجحة بمبلغ $${parsed} وتحديث الأرصدة.`,
                                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                      severity: 'INFO'
                                    };
                                    setSecurityLogs(prev => [newAudit, ...prev]);

                                    alert(lang === 'ar' ? `تم إيداع مبلغ (${formatCurrency(parsed)}) بنجاح وتحديث دفتر الأستاذ الموحد!` : `Successfully deposited ${formatCurrency(parsed)} into your wallet! Ledger accounts updated.`);
                                    setRechargeAmountInput('');
                                  }}
                                  className="bg-masari-blue hover:bg-opacity-90 text-white font-bold text-xs px-4 rounded-lg cursor-pointer"
                                >
                                  {lang === 'ar' ? 'إيداع' : 'Deposit'}
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-[8px] font-mono font-bold text-slate-500 text-center">
                              {['50', '100', '250', '500'].map((amt) => (
                                <button
                                  key={amt}
                                  onClick={() => setRechargeAmountInput(amt)}
                                  className="bg-slate-100 hover:bg-slate-200 py-1 rounded cursor-pointer"
                                >
                                  +${amt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. TRANSFER (PEER-TO-PEER) VIEW */}
                        {activeWalletTab === 'transfer' && (
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-700">{lang === 'ar' ? 'تحويل فوري بين الحسابات' : 'Peer-to-Peer Fund Clearing'}</h4>
                            <div className="space-y-2.5">
                              <div className="space-y-1">
                                <label className="text-[8px] text-slate-500 font-bold block uppercase">{lang === 'ar' ? 'اسم المستلم أو رقم هاتفه' : 'Recipient Phone or Username'}</label>
                                <input
                                  type="text"
                                  value={transferRecipientInput}
                                  onChange={(e) => setTransferRecipientInput(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                                  placeholder="e.g. +967 777 999 888"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[8px] text-slate-500 font-bold block uppercase">{lang === 'ar' ? 'مبلغ التحويل (USD)' : 'Transfer Amount (USD)'}</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="number"
                                    value={transferAmountInput}
                                    onChange={(e) => setTransferAmountInput(e.target.value)}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                                    placeholder="e.g. 150"
                                  />
                                  <button
                                    id="wallet-submit-transfer"
                                    onClick={() => {
                                      const parsed = parseFloat(transferAmountInput);
                                      if (!transferRecipientInput) {
                                        alert(lang === 'ar' ? 'يرجى إدخال المستلم أولاً!' : 'Please enter the recipient phone or identifier first!');
                                        return;
                                      }
                                      if (isNaN(parsed) || parsed <= 0) {
                                        alert(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح!' : 'Please enter a valid transfer amount!');
                                        return;
                                      }
                                      if (wallet.availableBalance < parsed) {
                                        alert(lang === 'ar' ? 'عذراً، رصيدك غير كافٍ لإتمام عملية التحويل!' : 'Insufficient wallet funds for this transfer!');
                                        return;
                                      }

                                      const updatedAvailable = wallet.availableBalance - parsed;
                                      setWallet({
                                        ...wallet,
                                        availableBalance: updatedAvailable
                                      });

                                      // Insert Transaction Record
                                      const txId = `tx-transfer-${Date.now()}`;
                                      const newTx = {
                                        id: txId,
                                        referenceNo: `MSR-TX-${Date.now().toString().slice(-6)}`,
                                        type: 'transfer',
                                        status: 'completed',
                                        amount: parsed,
                                        descriptionAr: `تحويل رصيد صادرة إلى ${transferRecipientInput}`,
                                        descriptionEn: `Cleared P2P Transfer to ${transferRecipientInput}`,
                                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                      };
                                      setWalletTransactions(prev => [newTx, ...prev]);

                                      // Insert Ledger Record
                                      const newLedger = {
                                        id: `led-${Date.now()}`,
                                        debit: parsed,
                                        credit: 0.0,
                                        balanceAfter: updatedAvailable,
                                        description: `حوالة مالية صادرة للمستلم ${transferRecipientInput}`,
                                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                      };
                                      setLedgerEntries(prev => [newLedger, ...prev]);

                                      // Security audit record
                                      const newAudit = {
                                        id: `aud-${Date.now()}`,
                                        action: 'WALLET_FUNDS_TOUCHED',
                                        details: `تم خصم $${parsed} وتحويلها للحساب ${transferRecipientInput}.`,
                                        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                                        severity: 'INFO'
                                      };
                                      setSecurityLogs(prev => [newAudit, ...prev]);

                                      alert(lang === 'ar' ? `تم تحويل مبلغ (${formatCurrency(parsed)}) بنجاح إلى المستفيد وتحديث سجلات المحاسبة!` : `Successfully transferred ${formatCurrency(parsed)} to ${transferRecipientInput}!`);
                                      setTransferAmountInput('');
                                      setTransferRecipientInput('');
                                    }}
                                    className="bg-masari-orange hover:bg-opacity-90 text-white font-bold text-xs px-4 rounded-lg cursor-pointer"
                                  >
                                    {lang === 'ar' ? 'تحويل' : 'Transfer'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. LEDGER (DOUBLE ENTRY BOOKKEEPING TRACE) VIEW */}
                        {activeWalletTab === 'ledger' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[9px] font-bold text-slate-700 uppercase">{lang === 'ar' ? 'دفتر الأستاذ المالي المزدوج (غير قابل للتعديل)' : 'Double-Entry Bookkeeping Audit Log'}</h4>
                              <span className="text-[7px] text-slate-400 font-mono tracking-wider">IMMUTABLE LEDGER</span>
                            </div>
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-0.5">
                              {ledgerEntries.map((led) => (
                                <div key={led.id} className="p-2 bg-slate-50 border border-slate-150 rounded text-[9px] font-mono space-y-1">
                                  <div className="flex justify-between text-slate-600 font-sans">
                                    <span>{led.description}</span>
                                    <span className="text-[8px] text-slate-400">{led.timestamp}</span>
                                  </div>
                                  <div className="flex justify-between font-bold">
                                    <div className="flex gap-2">
                                      {led.debit > 0 && <span className="text-rose-600">DR: -${led.debit}</span>}
                                      {led.credit > 0 && <span className="text-emerald-600">CR: +${led.credit}</span>}
                                    </div>
                                    <span className="text-slate-800">BAL: ${led.balanceAfter}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. SECURITY & AUDIT TRAILS VIEW */}
                        {activeWalletTab === 'security' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-[9px] font-bold text-slate-700 uppercase">{lang === 'ar' ? 'سجل الرصد الأمني ومحاولات المصادقة' : 'MFA & Authentication Security Audits'}</h4>
                              <span className="text-[7px] text-slate-400 font-mono tracking-wider">COMPLIANT</span>
                            </div>
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar pr-0.5">
                              {securityLogs.map((log) => (
                                <div key={log.id} className="p-2 bg-slate-50 border border-slate-150 rounded text-[9px] font-mono space-y-1">
                                  <div className="flex justify-between font-bold">
                                    <span className={`px-1 py-0.5 rounded text-[7px] text-white ${
                                      log.severity === 'CRITICAL' ? 'bg-rose-600' : log.severity === 'WARNING' ? 'bg-amber-500' : 'bg-slate-700'
                                    }`}>{log.action}</span>
                                    <span className="text-[8px] text-slate-400 font-normal">{log.timestamp}</span>
                                  </div>
                                  <p className="text-slate-700 font-sans leading-relaxed text-[9px]">{log.details}</p>
                                </div>
                              ))}
                            </div>

                            {/* Reset button to demonstrate full recovery */}
                            {failedAttempts > 0 && (
                              <button
                                onClick={() => {
                                  setFailedAttempts(0);
                                  setIsIpBlockedState(false);
                                  alert(lang === 'ar' ? 'تمت إعادة تعيين محاولات الدخول الخاطئة بنجاح!' : 'Failed login attempts successfully reset.');
                                }}
                                className="w-full mt-1 bg-slate-800 hover:bg-slate-700 text-white py-1 rounded text-[8px] font-bold font-sans cursor-pointer"
                              >
                                {lang === 'ar' ? 'تصفير عداد محاولات الدخول الخاطئة' : 'Clear Login Failures Counter'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Traveler & Passport Document Management Hub */}
                    <div className="bg-white rounded-xl border border-slate-150 p-3 shadow-xs space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-masari-blue" />
                          <h4 className="text-xs font-black text-slate-800">
                            {lang === 'ar' ? 'سجل المسافرين والجوازات المعتمدة' : 'Passport & Traveler Ledger'}
                          </h4>
                        </div>
                        <span className="text-[9px] font-bold font-mono bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded">
                          {travelers.length} {lang === 'ar' ? 'مسافر' : 'Travelers'}
                        </span>
                      </div>
                      <TravelerManager 
                        lang={lang}
                        travelers={travelers}
                        onAddTraveler={(t) => {
                          const existing = travelers.find(x => x.id === t.id);
                          if (existing) {
                            setTravelers(travelers.map(x => x.id === t.id ? t : x));
                          } else {
                            setTravelers([...travelers, t]);
                          }
                        }}
                        onRemoveTraveler={(id) => {
                          setTravelers(travelers.filter(t => t.id !== id));
                        }}
                      />
                    </div>

                    <button
                      id="profile-logout-btn"
                      onClick={() => {
                        setAuthModalMode('login');
                        setShowAuthModal(true);
                      }}
                      className="w-full bg-slate-900 text-white text-xs py-2.5 rounded-lg font-bold font-sans hover:bg-slate-800 transition-colors cursor-pointer text-center"
                    >
                      {lang === 'ar' ? 'تسجيل الخروج والتبديل' : 'Sign Out / Switch Account'}
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Sticky Navigation exact representation of the design */}
              <div className="bg-white border-t border-slate-200 h-14 shrink-0 px-4 flex justify-between items-center relative z-20">
                <button
                  id="tab-home-btn"
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors cursor-pointer ${
                    activeTab === 'home' ? 'text-masari-blue' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Home size={16} />
                  <span className="text-[8px] font-black">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
                </button>

                <button
                  id="tab-search-btn"
                  onClick={() => setActiveTab('search')}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors cursor-pointer ${
                    activeTab === 'search' ? 'text-masari-blue' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Search size={16} />
                  <span className="text-[8px] font-black">{lang === 'ar' ? 'البحث' : 'Search'}</span>
                </button>

                <button
                  id="tab-bookings-btn"
                  onClick={() => setActiveTab('bookings')}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors cursor-pointer ${
                    activeTab === 'bookings' ? 'text-masari-blue' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Ticket size={16} />
                  <span className="text-[8px] font-black">{lang === 'ar' ? 'حجوزاتي' : 'Bookings'}</span>
                </button>

                <button
                  id="tab-settings-btn"
                  onClick={() => setActiveTab('settings')}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors cursor-pointer ${
                    activeTab === 'settings' ? 'text-masari-blue' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Settings size={16} />
                  <span className="text-[8px] font-black">{lang === 'ar' ? 'إعدادات' : 'Settings'}</span>
                </button>

                <button
                  id="tab-profile-btn"
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors cursor-pointer ${
                    activeTab === 'profile' ? 'text-masari-blue' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <User size={16} />
                  <span className="text-[8px] font-black">{lang === 'ar' ? 'حسابي' : 'Profile'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ==================== SANDBOX SIMULATION MASKS & VIEWS ==================== */}
        {simulationState === 'loading' && (
          <div className="absolute inset-x-0 bottom-14 top-7 bg-slate-50/95 z-30 flex flex-col p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 animate-pulse">
              <RefreshCw className="animate-spin text-masari-blue" size={14} />
              <span>{lang === 'ar' ? 'جاري مزامنة بيانات مساري...' : 'Syncing Masari systems...'}</span>
            </div>
            {/* 3 stacked shimmer skeleton loaders */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="h-24 bg-slate-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {simulationState === 'empty' && (
          <div className="absolute inset-x-0 bottom-14 top-7 bg-slate-50 z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-200 shadow-inner">
              <FileText size={28} />
            </div>
            <h4 className="text-sm font-black text-slate-800">{lang === 'ar' ? 'لا توجد بيانات متاحة' : 'No Records Found'}</h4>
            <p className="text-[11px] text-slate-500 max-w-[240px] mt-1.5 leading-relaxed">
              {lang === 'ar' 
                ? 'عذراً، لم نتمكن من العثور على أي رحلات أو باقات تطابق معايير التصفية الحالية.' 
                : 'Sorry, we couldn\'t find any flights or packages matching your active filters.'}
            </p>
            <button
              onClick={() => {
                setSimulationState('default');
                setSearchQuery('');
                setSelectedCountry('');
              }}
              className="mt-4 bg-masari-blue hover:bg-opacity-90 text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-all"
            >
              {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset Simulation filters'}
            </button>
          </div>
        )}

        {simulationState === 'error' && (
          <div className="absolute inset-x-0 bottom-14 top-7 bg-slate-50 z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 border border-red-200 shadow-inner">
              <AlertCircle size={28} />
            </div>
            <h4 className="text-sm font-black text-slate-800">{lang === 'ar' ? 'فشل الاتصال بالخادم الرئيسي' : 'Mainframe Connection Offline'}</h4>
            <p className="text-[11px] text-slate-500 max-w-[240px] mt-1.5 leading-relaxed">
              {lang === 'ar' 
                ? 'فشل الاتصال بنظام الحجز المركزي لشركات الطيران والفنادق. يرجى التحقق من اتصال الشبكة.' 
                : 'Secure connection to the central travel mainframe timed out. Please verify link.'}
            </p>
            <button
              onClick={() => setSimulationState('default')}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-5 py-2 rounded-lg cursor-pointer transition-all"
            >
              {lang === 'ar' ? 'إعادة محاولة الاتصال' : 'Retry Connection Link'}
            </button>
          </div>
        )}



        {/* ==================== INTERACTIVE BOOKING SUMMARY SHEET ==================== */}
        {showBookingDetailsSheet && showBookingDetailsSheet.show && (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 max-h-[90%] flex flex-col space-y-4 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[8px] font-mono font-black text-masari-gold uppercase tracking-wider block">
                    {lang === 'ar' ? 'ملخص حجز تفصيلي' : 'Interactive Reservation Summary'}
                  </span>
                  <h4 className="text-xs font-black text-slate-850 leading-none mt-1">
                    {lang === 'ar' ? showBookingDetailsSheet.titleAr : showBookingDetailsSheet.titleEn}
                  </h4>
                </div>
                <button 
                  onClick={() => {
                    setShowBookingDetailsSheet(null);
                    setAppliedPromo(null);
                    setPromoInput('');
                    setPromoError(null);
                    setTravelerForm({ fullName: '', passportNo: '', phone: '', email: '', selectedAddons: [] });
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              {/* Package Card header */}
              <div className="flex gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                {showBookingDetailsSheet.image && (
                  <img 
                    src={showBookingDetailsSheet.image} 
                    alt="Package Preview" 
                    className="w-14 h-14 rounded-lg object-cover" 
                  />
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{showBookingDetailsSheet.type.toUpperCase()}</span>
                  <h5 className="text-[10px] font-black text-slate-800 truncate">
                    {lang === 'ar' ? showBookingDetailsSheet.titleAr : showBookingDetailsSheet.titleEn}
                  </h5>
                  <span className="text-[10px] font-mono font-bold text-masari-blue mt-0.5">{formatCurrency(showBookingDetailsSheet.price)}</span>
                </div>
              </div>

              {/* Traveler Form details */}
              <div className="space-y-2 text-xs">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'ar' ? 'بيانات المسافر الرئيسي:' : 'Primary Traveler details:'}</span>
                <input 
                  type="text" 
                  value={travelerForm.fullName}
                  onChange={(e) => setTravelerForm({ ...travelerForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-masari-blue"
                  placeholder={lang === 'ar' ? 'ادخل الاسم الكامل (مطابق للجواز)' : 'Full name matching passport'}
                />
                <input 
                  type="text" 
                  value={travelerForm.passportNo}
                  onChange={(e) => setTravelerForm({ ...travelerForm, passportNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none focus:border-masari-blue"
                  placeholder={lang === 'ar' ? 'رقم جواز السفر' : 'Passport Number (e.g. Y-00000)'}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="tel" 
                    value={travelerForm.phone}
                    onChange={(e) => setTravelerForm({ ...travelerForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                    placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone number'}
                  />
                  <input 
                    type="email" 
                    value={travelerForm.email}
                    onChange={(e) => setTravelerForm({ ...travelerForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                    placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  />
                </div>
              </div>

              {/* Travel Add-ons selection list */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'ar' ? 'ترقية خدمات الرحلة (اختياري):' : 'Enhance Journey Add-ons (Optional):'}</span>
                {[
                  { id: 'lounge', labelAr: 'دخول صالة كبار الشخصيات بالمطار (+$20)', labelEn: 'VIP Lounge Lounge Access (+$20)', price: 20 },
                  { id: 'baggage', labelAr: 'حقيبة شحن إضافية 23 كجم (+$35)', labelEn: 'Extra Check-in Luggage 23kg (+$35)', price: 35 },
                  { id: 'insurance', labelAr: 'تأمين طبي وتأمين سفر شامل (+$15)', labelEn: 'Full Travel Medical Insurance (+$15)', price: 15 }
                ].map(addon => {
                  const isChecked = travelerForm.selectedAddons.includes(addon.id);
                  return (
                    <label key={addon.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-[10px] cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setTravelerForm({ ...travelerForm, selectedAddons: travelerForm.selectedAddons.filter(id => id !== addon.id) });
                          } else {
                            setTravelerForm({ ...travelerForm, selectedAddons: [...travelerForm.selectedAddons, addon.id] });
                          }
                        }}
                        className="rounded text-masari-blue focus:ring-0" 
                      />
                      <span className="text-slate-700 font-medium">{lang === 'ar' ? addon.labelAr : addon.labelEn}</span>
                    </label>
                  );
                })}
              </div>

              {/* Promotional Coupon Validation */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{lang === 'ar' ? 'كوبونات الخصم والترويج:' : 'Promo Coupons & Discount codes:'}</span>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] uppercase font-mono font-bold"
                    placeholder={lang === 'ar' ? 'ادخل رمز الكوبون' : 'Promo Code'}
                  />
                  <button
                    onClick={() => {
                      if (promoInput === 'MASARI15') {
                        setAppliedPromo('MASARI15');
                        setPromoError(null);
                      } else {
                        setPromoError(lang === 'ar' ? 'الكوبون غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired coupon.');
                        setAppliedPromo(null);
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-850 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    {lang === 'ar' ? 'تطبيق' : 'Apply'}
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-[9px] text-emerald-600 font-bold block">✓ {lang === 'ar' ? 'تم تطبيق خصم 15% بنجاح!' : 'Coupon applied successfully: 15% off base!'}</span>
                )}
                {promoError && (
                  <span className="text-[9px] text-red-500 font-medium block">✗ {promoError}</span>
                )}
              </div>

              {/* Price Breakdown Calculation */}
              {(() => {
                const base = showBookingDetailsSheet.price;
                const addonsPrice = (travelerForm.selectedAddons.includes('lounge') ? 20 : 0) + 
                                     (travelerForm.selectedAddons.includes('baggage') ? 35 : 0) + 
                                     (travelerForm.selectedAddons.includes('insurance') ? 15 : 0);
                const discount = appliedPromo === 'MASARI15' ? base * 0.15 : 0;
                const subtotal = base + addonsPrice - discount;
                const tax = subtotal * 0.05;
                const total = subtotal + tax;

                return (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{lang === 'ar' ? 'السعر الأساسي:' : 'Base price:'}</span>
                      <strong className="text-slate-800">{formatCurrency(base)}</strong>
                    </div>
                    {addonsPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">{lang === 'ar' ? 'إجمالي الخدمات الإضافية:' : 'Add-on fees:'}</span>
                        <strong className="text-slate-800">+{formatCurrency(addonsPrice)}</strong>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>{lang === 'ar' ? 'خصم الكوبون (15%):' : 'Promo discount (15%):'}</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500 text-[9px]">
                      <span>{lang === 'ar' ? 'الضرائب والرسوم الحكومية (5%):' : 'Govt Tax & VAT (5%):'}</span>
                      <span>+{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 text-xs font-black font-sans text-masari-blue">
                      <span>{lang === 'ar' ? 'الإجمالي النهائي المطلوب:' : 'Final payable total:'}</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  if (!travelerForm.fullName || !travelerForm.phone) {
                    alert(lang === 'ar' ? 'يرجى إدخال اسم المسافر والهاتف للتأكيد المباشر!' : 'Please fill traveler name and phone to confirm registration.');
                    return;
                  }
                  
                  // Calculate final checkout total
                  const base = showBookingDetailsSheet.price;
                  const addonsPrice = (travelerForm.selectedAddons.includes('lounge') ? 20 : 0) + 
                                       (travelerForm.selectedAddons.includes('baggage') ? 35 : 0) + 
                                       (travelerForm.selectedAddons.includes('insurance') ? 15 : 0);
                  const discount = appliedPromo === 'MASARI15' ? base * 0.15 : 0;
                  const finalTotal = (base + addonsPrice - discount) * 1.05;

                  const ref = `MSR-2026-${showBookingDetailsSheet.type.substring(0,3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
                  const newBooking: Booking = {
                    id: `b-${Date.now()}`,
                    bookingRef: ref,
                    type: showBookingDetailsSheet.type as any,
                    titleAr: showBookingDetailsSheet.titleAr,
                    titleEn: showBookingDetailsSheet.titleEn,
                    price: finalTotal,
                    bookingDate: new Date().toISOString().split('T')[0],
                    departureDate: '2026-09-01',
                    status: 'confirmed',
                    details: {
                      passengersCount: 1,
                      phone: travelerForm.phone,
                      email: travelerForm.email || 'guest@masari.com',
                      additionalInfo: `Passport: ${travelerForm.passportNo || 'N/A'}`
                    }
                  };

                  setBookings([newBooking, ...bookings]);
                  setShowBookingDetailsSheet(null);
                  setAppliedPromo(null);
                  setPromoInput('');
                  setTravelerForm({ fullName: '', passportNo: '', phone: '', email: '', selectedAddons: [] });

                  setActiveModalBooking({
                    show: true,
                    title: lang === 'ar' ? showBookingDetailsSheet.titleAr : showBookingDetailsSheet.titleEn,
                    ref: ref,
                    price: finalTotal,
                    type: showBookingDetailsSheet.type.toUpperCase(),
                  });
                }}
                className="w-full bg-masari-orange hover:bg-opacity-95 text-white font-sans font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer text-center"
              >
                {lang === 'ar' ? 'تأكيد الحجز والدفع المعتمد ➔' : 'Complete checkout booking ➔'}
              </button>
            </div>
          </div>
        )}

        {/* ==================== LEGAL & SUPPORT DETAILED SHEETS ==================== */}
        {activeDetailSheet && (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-fade-in">
            <div className="bg-white rounded-t-3xl p-5 max-h-[85%] flex flex-col space-y-4 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                <h4 className="text-xs font-black text-slate-800">
                  {activeDetailSheet === 'about' && (lang === 'ar' ? 'من نحن وتاريخ مساري' : 'About Us & Corporate History')}
                  {activeDetailSheet === 'contact' && (lang === 'ar' ? 'اتصل بنا ومكاتب الفروع' : 'Contact Us & Registered Hubs')}
                  {activeDetailSheet === 'help' && (lang === 'ar' ? 'الأسئلة الشائعة والمساعدة' : 'Help Center & Active FAQ')}
                  {activeDetailSheet === 'privacy' && (lang === 'ar' ? 'سياسة الخصوصية والأمان' : 'Privacy & Data Governance')}
                  {activeDetailSheet === 'terms' && (lang === 'ar' ? 'الشروط والضوابط التنظيمية' : 'Platform Terms of Agreement')}
                </h4>
                <button 
                  onClick={() => setActiveDetailSheet(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>

              <div className="text-[10px] text-slate-600 leading-relaxed space-y-3 font-sans">
                {activeDetailSheet === 'about' && (
                  <div className="space-y-2">
                    <p>
                      <strong>{lang === 'ar' ? 'وكالة مساري للسفريات والسياحة والحج والعمرة' : 'Masari Travel, Tourism, Hajj, & Umrah Agency'}</strong>
                    </p>
                    <p>
                      {lang === 'ar' 
                        ? 'تأسست وكالة مساري كوكالة معتمدة رسمياً من وزارة السياحة اليمنية، وحاصلة على ترخيص الطيران الدولي (IATA) وعضو المجلس الأعلى لتفويج الحجاج والمعتمرين.' 
                        : 'Masari Travel was incorporated as a government-authorized agent by the Ministry of Tourism, Yemen. We hold premium international IATA credentials and act as a licensed carrier for Hajj and Umrah pilgrims.'}
                    </p>
                    <p>
                      {lang === 'ar' 
                        ? 'نحن نوفر شبكة خدمات متكاملة تغطي كافة المدن اليمنية، لنربط المواطنين بالعالم الخارجي وبالمشاعر المقدسة عبر تجربة ميسرة وخدمات VIP مخصصة.' 
                        : 'We operate state-of-the-art hubs across all districts, connecting Yemeni citizens to global routes and holy sites with absolute premium service quality.'}
                    </p>
                  </div>
                )}

                {activeDetailSheet === 'contact' && (
                  <div className="space-y-3">
                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>{lang === 'ar' ? 'الفرع الرئيسي - صنعاء' : 'Main Headquarters - Sana\'a'}</strong>
                      <p>{lang === 'ar' ? 'شارع حدة، عمارة مساري الدولية، الدور الأول' : 'Hadda Street, Masari International Building, 1st Floor'}</p>
                      <p className="font-mono text-[9px] text-masari-blue">Tel: +967-1-444555 | Mobile: +967-777-123456</p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>{lang === 'ar' ? 'فرع عدن' : 'Aden Registered Hub'}</strong>
                      <p>{lang === 'ar' ? 'كريتر، شارع أروى، بجانب البنك المركزي' : 'Crater, Arwa Street, Adjacent to Central Bank'}</p>
                      <p className="font-mono text-[9px] text-masari-blue">Tel: +967-2-222333 | Mobile: +967-771-000111</p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>{lang === 'ar' ? 'فرع القاهرة (مكتب تمثيلي للرعاية الطبية)' : 'Cairo Liaison & Medical Office'}</strong>
                      <p>{lang === 'ar' ? 'الدقي، شارع التحرير، عمارة برج الأطباء' : 'Dokki, Al Tahrir Street, Medical Towers'}</p>
                      <p className="font-mono text-[9px] text-masari-blue">Tel: +20-2-333444 | Mobile: +20-100-555666</p>
                    </div>
                  </div>
                )}

                {activeDetailSheet === 'help' && (
                  <div className="space-y-2.5">
                    <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong className="text-slate-800">{lang === 'ar' ? 'كيف أحصل على فيزا العمرة؟' : 'How is the Umrah Visa issued?'}</strong>
                      <p>{lang === 'ar' ? 'بمجرد تأكيد حجز باقة العمرة، يتولى ممثلو مساري معالجة المستندات وإصدار التأشيرة الرقمية من وزارة الحج السعودية خلال 72 ساعة.' : 'Upon booking any Umrah package, Masari handles data entry and retrieves the official digital visa from the Ministry of Hajj, KSA within 72 hours.'}</p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong className="text-slate-800">{lang === 'ar' ? 'ما هي سياسة تعديل مواعيد الطيران؟' : 'What is the flight modification policy?'}</strong>
                      <p>{lang === 'ar' ? 'تعديل الرحلات يتبع لتعليمات شركات الطيران الناقلة (مثل اليمنية أو بلقيس)، ولكن فريق الدعم متوفر 24/7 لمساعدتكم مجاناً.' : 'Rescheduling depends on carriers rules (e.g. Yemenia). However, Masari custom support team is on standby 24/7 to adjust coordinates without premium admin charges.'}</p>
                    </div>
                  </div>
                )}

                {activeDetailSheet === 'privacy' && (
                  <div className="space-y-2">
                    <p>{lang === 'ar' ? 'نحن في وكالة مساري نحترم خصوصيتك تماماً. كل بيانات الجوازات، تذاكر الطيران، وأرقام التحويلات المالية يتم تشفيرها وفقاً لمعايير الأمان المصرفية.' : 'We prioritize passenger confidentiality. All passports, vouchers, tickets, and associated logs are processed under end-to-end industry security encryption.'}</p>
                    <p>{lang === 'ar' ? 'نحن لا نشارك بياناتك مع أي جهات خارجية باستثناء سلطات الهجرة والجمارك والمنافذ الجوية لضمان سلامة مغادرتك.' : 'Personal details are exclusively mapped to booking authorities (e.g., immigration and custom services) to guarantee boarding clearances.'}</p>
                  </div>
                )}

                {activeDetailSheet === 'terms' && (
                  <div className="space-y-2">
                    <p>{lang === 'ar' ? 'تخضع باقات الحج والعمرة للضوابط الصادرة عن وزارة الأوقاف والإرشاد اليمنية ووزارة الحج السعودية.' : 'Pilgrim bookings are regulated under Yemeni Endowments and KSA Hajj guidelines.'}</p>
                    <p>{lang === 'ar' ? 'تعتبر جميع الحجوزات نهائية بعد إصدار التذكرة الرسمية، وأي رسوم إلغاء تكون تابعة لشروط الفنادق وشركات الطيران الشريكة.' : 'Tickets are deemed non-reversible upon formal airline voucher issuance, subject to standard provider terms.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Booking Confirmation Alert Overlay within Simulated Device */}
        {activeModalBooking && activeModalBooking.show && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 shadow-2xl max-w-xs w-full text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 font-sans">
                  {lang === 'ar' ? 'تم تسجيل طلب الحجز!' : 'Booking Request Filed!'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  {lang === 'ar' 
                    ? `جاري التحقق من الغرف المتاحة لباقة ${activeModalBooking.title}. مرجع الحجز الخاص بك هو:` 
                    : `Validating real-time availability for ${activeModalBooking.title}. Your reference is:`}
                </p>
                <code className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded block mt-2">
                  {activeModalBooking.ref}
                </code>
              </div>
              <button
                id="modal-close-btn"
                onClick={() => {
                  setActiveModalBooking(null);
                  setActiveTab('bookings');
                }}
                className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg font-bold cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {lang === 'ar' ? 'عرض التذكرة' : 'View Ticket'}
              </button>
            </div>
          </div>
        )}

        {/* Feature Overlays & Modals */}
        <WalletRechargeModal 
          isOpen={showRechargeModal} 
          onClose={() => setShowRechargeModal(false)} 
          lang={lang} 
          currency={currency} 
          formatCurrency={formatCurrency} 
          wallet={wallet} 
          setWallet={setWallet} 
          setWalletTransactions={setWalletTransactions} 
          setLedgerEntries={setLedgerEntries} 
          setSecurityLogs={setSecurityLogs} 
        />

        <NotificationCenter 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
          lang={lang} 
          notifications={notifications} 
          onMarkAllRead={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} 
          onClearAll={() => setNotifications([])} 
        />

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          lang={lang} 
          authMode={authModalMode} 
          onAuthenticateSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }} 
        />

        <SmartSearchOverlay 
          isOpen={showSmartSearch} 
          onClose={() => setShowSmartSearch(false)} 
          lang={lang} 
          onSelectSearchQuery={(q) => {
            setShowSmartSearch(false);
            setActiveTab('search');
          }} 
          openAiAssistantWithQuery={(q) => {
            setShowSmartSearch(false);
            setActiveTab('ai');
          }} 
        />

        <BookingCheckoutSheet 
          isOpen={showBookingDetailsSheet?.show || false} 
          onClose={() => setShowBookingDetailsSheet(null)} 
          lang={lang} 
          currency={currency} 
          formatCurrency={formatCurrency} 
          bookingItem={showBookingDetailsSheet ? {
            type: showBookingDetailsSheet.type,
            id: showBookingDetailsSheet.id,
            titleAr: showBookingDetailsSheet.titleAr,
            titleEn: showBookingDetailsSheet.titleEn,
            price: showBookingDetailsSheet.price,
            image: showBookingDetailsSheet.image
          } : null} 
          user={currentUser} 
          travelers={travelers} 
          wallet={wallet} 
          openAuthModal={() => {
            setAuthModalMode('login');
            setShowAuthModal(true);
          }} 
          onConfirmBooking={(newBooking, deductedAmount) => {
            setBookings([newBooking, ...bookings]);
            setWallet(prev => ({ ...prev, availableBalance: Math.max(0, prev.availableBalance - deductedAmount) }));
            setShowBookingDetailsSheet(null);
            setActiveTab('bookings');
          }} 
        />

      </div>
    </div>
  );
}
