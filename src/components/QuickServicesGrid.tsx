/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Plane, 
  Building2, 
  Compass, 
  Bus, 
  Car, 
  ArrowLeftRight, 
  FileCheck, 
  Moon, 
  Heart, 
  Wallet, 
  Sparkles 
} from 'lucide-react';
import { ActiveSection, Language } from '../types';

interface QuickServicesGridProps {
  lang: Language;
  onSelectService: (section: ActiveSection) => void;
  openAiAssistant: () => void;
  openSmartSearch?: () => void;
}

export const servicesList = [
  {
    id: ActiveSection.Flights,
    titleAr: 'حجز الطيران',
    titleEn: 'Flights',
    subtitleAr: 'رحلات دولية ومحلية',
    subtitleEn: 'Intl & Domestic',
    icon: Plane,
    color: 'from-blue-600 to-cyan-500',
    badgeAr: 'أفضل سعر',
    badgeEn: 'Best Rate',
  },
  {
    id: ActiveSection.Hotels,
    titleAr: 'الفنادق',
    titleEn: 'Hotels',
    subtitleAr: 'مكة، المدينة، والعالم',
    subtitleEn: 'Makkah & Worldwide',
    icon: Building2,
    color: 'from-amber-600 to-yellow-500',
    badgeAr: 'خصم 15%',
    badgeEn: '15% Off',
  },
  {
    id: ActiveSection.Tourism,
    titleAr: 'السياحة',
    titleEn: 'Tourism',
    subtitleAr: 'رحلات وباقات عالمية',
    subtitleEn: 'Global Tours',
    icon: Compass,
    color: 'from-emerald-600 to-teal-500',
    badgeAr: 'شاملة',
    badgeEn: 'Inclusive',
  },
  {
    id: ActiveSection.Bus,
    titleAr: 'النقل بالحافلات',
    titleEn: 'Bus Travel',
    subtitleAr: 'رحلات برية مباشرة',
    subtitleEn: 'VIP Direct Routes',
    icon: Bus,
    color: 'from-purple-600 to-indigo-500',
    badgeAr: 'فاخر VIP',
    badgeEn: 'VIP Class',
  },
  {
    id: ActiveSection.Cars,
    titleAr: 'تأجير السيارات',
    titleEn: 'Car Rental',
    subtitleAr: 'سيارات فاخرة واقتصادية',
    subtitleEn: 'Luxury & Economy',
    icon: Car,
    color: 'from-rose-600 to-pink-500',
    badgeAr: 'بدون سائق',
    badgeEn: 'Self Drive',
  },
  {
    id: ActiveSection.Transfers,
    titleAr: 'النقل الخاص',
    titleEn: 'Transfers',
    subtitleAr: 'توصيل مطار وفنادق',
    subtitleEn: 'Airport & Hotel Pickup',
    icon: ArrowLeftRight,
    color: 'from-sky-600 to-blue-500',
    badgeAr: 'مباشر',
    badgeEn: 'Direct',
  },
  {
    id: ActiveSection.Visa,
    titleAr: 'التأشيرات',
    titleEn: 'Visa Services',
    subtitleAr: 'إصدار سريع ومضمون',
    subtitleEn: 'Fast & Guaranteed',
    icon: FileCheck,
    color: 'from-amber-500 to-amber-700',
    badgeAr: 'إلكترونية',
    badgeEn: 'E-Visa',
  },
  {
    id: ActiveSection.Hajj,
    titleAr: 'خدمات الحج',
    titleEn: 'Hajj Packages',
    subtitleAr: 'حملات ملكية متكاملة',
    subtitleEn: 'Royal Campaigns',
    icon: Heart,
    color: 'from-amber-600 to-yellow-600',
    badgeAr: '1447هـ',
    badgeEn: 'Season 2026',
  },
  {
    id: ActiveSection.Umrah,
    titleAr: 'باقات العمرة',
    titleEn: 'Umrah Packages',
    subtitleAr: 'برامج طيران وبر',
    subtitleEn: 'Air & Land Packages',
    icon: Moon,
    color: 'from-teal-600 to-emerald-500',
    badgeAr: 'تأشيرة مجاناً',
    badgeEn: 'Free Visa',
  },
  {
    id: ActiveSection.Wallet,
    titleAr: 'المحفظة الرقمية',
    titleEn: 'My Wallet',
    subtitleAr: 'شحن واسترداد فوري',
    subtitleEn: 'Instant Cashback',
    icon: Wallet,
    color: 'from-slate-700 to-slate-900',
    badgeAr: 'الرصيد',
    badgeEn: 'Balance',
  },
  {
    id: ActiveSection.AiAssistant,
    titleAr: 'مساعد مساري الذكي',
    titleEn: 'AI Travel Agent',
    subtitleAr: 'تخطيط رحلتك بذكاء',
    subtitleEn: 'Smart Concierge',
    icon: Sparkles,
    color: 'from-masari-blue to-masari-cyan',
    badgeAr: 'ذكاء إصطناعي',
    badgeEn: 'AI Powered',
    isAi: true,
  },
];

export default function QuickServicesGrid({ lang, onSelectService, openAiAssistant }: QuickServicesGridProps) {
  const isAr = lang === 'ar';

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-masari-cyan" />
          <span>{isAr ? 'الخدمات السريعة والمباشرة' : 'Quick Travel Services'}</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">11 MODULES</span>
      </div>

      {/* Grid of 11 Services */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {servicesList.map((srv) => {
          const IconComp = srv.icon;
          return (
            <button
              key={srv.id}
              id={`quick-service-btn-${srv.id}`}
              onClick={() => {
                if (srv.isAi) {
                  openAiAssistant();
                } else {
                  onSelectService(srv.id);
                }
              }}
              className={`flex flex-col items-center p-2 rounded-2xl border border-slate-100 bg-white hover:border-masari-cyan/40 hover:shadow-md transition-all cursor-pointer group text-center relative overflow-hidden ${
                srv.isAi ? 'col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 border-masari-cyan/30 text-white' : ''
              }`}
            >
              {/* Badge */}
              <span className={`absolute top-1.5 right-1.5 text-[7px] font-bold px-1 rounded-full font-mono ${
                srv.isAi ? 'bg-masari-gold text-slate-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {isAr ? srv.badgeAr : srv.badgeEn}
              </span>

              {/* Icon Circle */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white mb-1.5 shadow-sm group-hover:scale-105 transition-transform bg-gradient-to-br ${srv.color}`}>
                <IconComp size={18} />
              </div>

              {/* Title & Subtitle */}
              <span className={`text-[10px] font-black leading-tight truncate w-full ${srv.isAi ? 'text-white' : 'text-slate-800'}`}>
                {isAr ? srv.titleAr : srv.titleEn}
              </span>
              <span className={`text-[8px] truncate w-full mt-0.5 ${srv.isAi ? 'text-slate-300' : 'text-slate-400'}`}>
                {isAr ? srv.subtitleAr : srv.subtitleEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
