/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking } from '../../../types';

export interface Recommendation {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'flight' | 'tourism' | 'umrah' | 'hajj' | 'hotel' | 'bus' | 'car' | 'transfer';
  price: number;
  score: number;
  reasonAr: string;
  reasonEn: string;
  image: string;
}

export interface ExpenseCategory {
  nameAr: string;
  nameEn: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface RitualStep {
  step: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: 'umrah' | 'hajj';
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'booking' | 'visa' | 'wallet' | 'promo' | 'tip';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  timeAr: string;
  timeEn: string;
  read: boolean;
  severity: 'info' | 'warning' | 'success';
}

// Custom Coupons
export const mockCoupons = [
  { code: 'MASARI10', discount: 10, type: 'percent', active: true },
  { code: 'WELCOME50', discount: 50, type: 'fixed', active: true },
  { code: 'HAJJ2026', discount: 150, type: 'fixed', active: true },
];

// High-impact travel recommendations
export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    titleAr: 'عمرة التكافل الاقتصادي الممتاز',
    titleEn: 'Economic Premium Umrah Package',
    type: 'umrah',
    price: 350,
    score: 98,
    reasonAr: 'بناءً على تفضيلات ميزانيتك ومستوى الإقامة المفضل القريب من الحرم.',
    reasonEn: 'Based on your budget preferences and closer hotel proximity to Haram.',
    image: 'https://images.unsplash.com/photo-1564769625905-50e9ad63ea9f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec2',
    titleAr: 'سيارة تويوتا هايلاندر عائلية 2025',
    titleEn: 'Toyota Highlander Family SUV 2025',
    type: 'car',
    price: 80,
    score: 92,
    reasonAr: 'خيار مثالي لرحلتك العائلية القادمة لضمان راحة الأبناء والأمتعة.',
    reasonEn: 'Perfect match for your family size to ensure comfort for kids and baggage.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rec3',
    titleAr: 'توصيل ملوكي VIP - مطار جدة إلى مكة',
    titleEn: 'VIP Royal Transfer: Jeddah Airport to Makkah',
    type: 'transfer',
    price: 60,
    score: 95,
    reasonAr: 'متطابق مع رحلتك القادمة على الخطوط اليمنية لتفادي عناء الانتظار.',
    reasonEn: 'Perfectly timed with your incoming Yemenia flight to avoid border queues.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  }
];

// Spending distribution categories
export const mockExpenseCategories: ExpenseCategory[] = [
  { nameAr: 'تذاكر طيران', nameEn: 'Flights', amount: 850, percentage: 40, color: '#2563eb' },
  { nameAr: 'فنادق وإقامة', nameEn: 'Hotels', amount: 650, percentage: 30, color: '#f59e0b' },
  { nameAr: 'الحج والعمرة', nameEn: 'Pilgrimage', amount: 450, percentage: 21, color: '#10b981' },
  { nameAr: 'نقل وتأجير سيارات', nameEn: 'Transfers', amount: 180, percentage: 9, color: '#06b6d4' },
];

// Detailed Hajj/Umrah Preparation Checklists
export const pilgrimChecklist = [
  { id: 'chk-1', textAr: 'استخراج وثيقة التصريح الإلكتروني وتأشيرة الدخول', textEn: 'Obtain electronic permit & entry visa', required: true, done: true },
  { id: 'chk-2', textAr: 'الحصول على شهادة التطعيم واللقاحات المعتمدة الدولي', textEn: 'International approved immunization certificate', required: true, done: true },
  { id: 'chk-3', textAr: 'تجهيز ملابس الإحرام البيضاء النظيفة للرجال', textEn: 'Prepare white clean Ihram garments (for Men)', required: false, done: false },
  { id: 'chk-4', textAr: 'شراء وتفعيل حزمة التجوال والمحفظة الرقمية لمساري', textEn: 'Activate roaming package & Masari digital wallet', required: false, done: true },
  { id: 'chk-5', textAr: 'تأكيد حجز النقل الخاص بين الفندق ومشاعر منى وعرفة', textEn: 'Confirm transport links between hotel & holy ritual sites', required: true, done: false },
];

// Required Documents list
export const requiredDocuments = [
  { nameAr: 'جواز السفر (صلاحية أكثر من 6 أشهر)', nameEn: 'Valid Passport (6+ Months)', statusAr: 'تم التحقق بنجاح', statusEn: 'Verified Successfully', valid: true },
  { nameAr: 'تصريح العمرة/الحج الرسمي', nameEn: 'Official Hajj/Umrah Permit', statusAr: 'قيد المراجعة الفورية', statusEn: 'Pending Review', valid: false },
  { nameAr: 'الهوية الوطنية اليمنية الموحدة', nameEn: 'Yemeni Unified National ID', statusAr: 'تم التحقق بنجاح', statusEn: 'Verified Successfully', valid: true },
  { nameAr: 'تأمين طبي معتمد يغطي الإقامة', nameEn: 'Approved Medical Insurance', statusAr: 'مكتمل ومسجل', statusEn: 'Completed & Registered', valid: true },
];

// Ritual Step-by-Step guide
export const ritualSteps: RitualStep[] = [
  { step: 1, titleAr: 'الإحرام والنية', titleEn: 'Ihram & Intention', descriptionAr: 'الاغتسال، ارتداء ملابس الإحرام، وإعلان نية العمرة عند الميقات المخصص.', descriptionEn: 'Perform ritual cleansing, don the Ihram, and declare intention at the Miqat.', type: 'umrah' },
  { step: 2, titleAr: 'الطواف حول الكعبة', titleEn: 'Tawaf (Circumambulation)', descriptionAr: 'الطواف حول الكعبة المشرفة سبعة أشواط بدءاً من الحجر الأسود.', descriptionEn: 'Circumambulate the Holy Kaaba seven times counterclockwise starting from the Black Stone.', type: 'umrah' },
  { step: 3, titleAr: 'السعي بين الصفا والمروة', titleEn: 'Sa\'ee (Safa & Marwa)', descriptionAr: 'السعي سبعة أشواط بين جبل الصفا وجبل المروة بنشاط وسكينة.', descriptionEn: 'Walk seven times between the hills of Safa and Marwa with devotion.', type: 'umrah' },
  { step: 4, titleAr: 'الحلق أو التقصير', titleEn: 'Halq or Taqsir (Shaving)', descriptionAr: 'حلق شعر الرأس أو تقصيره للتحلل الكامل من إحرام العمرة.', descriptionEn: 'Shave or trim hair to signify the completion and exit of Ihram restrictions.', type: 'umrah' },
  { step: 5, titleAr: 'الوقوف بعرفة (للحج)', titleEn: 'Wuquf at Arafat (Hajj)', descriptionAr: 'الركن الأعظم للحج، بالوقوف والتضرع والدعاء من زوال الشمس إلى غروبها يوم 9 ذي الحجة.', descriptionEn: 'The supreme pillar of Hajj: standing and praying at Arafat from noon to sunset on 9th Dhul-Hijjah.', type: 'hajj' },
  { step: 6, titleAr: 'المبيت بمزدلفة ورمي الجمرات', titleEn: 'Muzdalifah & Jamarat', descriptionAr: 'جمع الحصى والمبيت بمزدلفة ثم التوجه لمنى لرمي الجمرات الطاهرة.', descriptionEn: 'Collect pebbles, spend the night at Muzdalifah, then head to Mina for Jamarat stoning.', type: 'hajj' },
];

// Admin Panel Mock Analytics
export const mockAdminAnalytics = {
  totalRevenue: 245800.00,
  revenueChangePercent: 12.4,
  monthlyBookings: [
    { month: 'Jan', revenue: 21000, bookings: 145 },
    { month: 'Feb', revenue: 28000, bookings: 190 },
    { month: 'Mar', revenue: 34000, bookings: 220 },
    { month: 'Apr', revenue: 52000, bookings: 310 }, // Ramadan Season Peak
    { month: 'May', revenue: 41000, bookings: 250 },
    { month: 'Jun', revenue: 69000, bookings: 420 }, // Hajj Season Peak
  ],
  popularDestinations: [
    { nameAr: 'مكة المكرمة', nameEn: 'Makkah', percentage: 48, count: 530, color: '#f59e0b' },
    { nameAr: 'المدينة المنورة', nameEn: 'Madinah', percentage: 22, count: 245, color: '#10b981' },
    { nameAr: 'القاهرة', nameEn: 'Cairo', percentage: 18, count: 200, color: '#3b82f6' },
    { nameAr: 'دبي', nameEn: 'Dubai', percentage: 12, count: 135, color: '#06b6d4' },
  ],
  walletStats: {
    totalActiveWallets: 1850,
    averageWalletBalance: 420.50,
    totalDepositsThisMonth: 48500.00,
    totalWithdrawalsThisMonth: 12400.00,
  },
  cancellationTrends: [
    { reasonAr: 'تأخر إصدار تأشيرة السفر', reasonEn: 'Visa processing delays', percentage: 45 },
    { reasonAr: 'تعديل جدول الرحلات والخطوط', reasonEn: 'Airlines schedule reshuffle', percentage: 30 },
    { reasonAr: 'ظروف عائلية أو صحية طارئة', reasonEn: 'Personal or medical emergencies', percentage: 25 },
  ]
};

// Intelligent dynamic notifications list
export const mockNotifications: NotificationItem[] = [
  {
    id: 'not-1',
    type: 'price_drop',
    titleAr: 'هبوط أسعار طيران القاهرة!',
    titleEn: 'Yemenia Cairo Flight Price Drop!',
    descAr: 'انخفضت أسعار التذاكر لرحلة صنعاء - القاهرة بمعدل 15% ليوم الخميس القادم.',
    descEn: 'Fare for flight IY-601 decreased by 15% for next Thursday departures.',
    timeAr: 'منذ دقيقتين',
    timeEn: '2 mins ago',
    read: false,
    severity: 'success',
  },
  {
    id: 'not-2',
    type: 'visa',
    titleAr: 'تنبيه انتهاء صلاحية جواز السفر',
    titleEn: 'Passport Expiration Warning',
    descAr: 'ينتهي جواز سفرك الحالي بعد 4 أشهر. يرجى تجديده لتفادي رفض تأشيرة العمرة.',
    descEn: 'Your current passport expires in 4 months. Please renew to prevent e-visa declines.',
    timeAr: 'منذ ساعة',
    timeEn: '1 hour ago',
    read: false,
    severity: 'warning',
  },
  {
    id: 'not-3',
    type: 'wallet',
    titleAr: 'تحديث ميزانية الحجز التلقائي',
    titleEn: 'Smart Wallet Balance Alert',
    descAr: 'رصيدك الحالي يقترب من الحد الأدنى المقترح لتأكيد باقات رحلات الحج 2026.',
    descEn: 'Your wallet funds are close to the minimum recommended for Hajj 2026 holds.',
    timeAr: 'منذ يوم',
    timeEn: 'Yesterday',
    read: true,
    severity: 'info',
  }
];
