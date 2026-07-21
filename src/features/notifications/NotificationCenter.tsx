/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Wallet, 
  FileCheck, 
  Gift, 
  Tag, 
  Plane, 
  CheckCircle2 
} from 'lucide-react';
import { NotificationItem, Language } from '../../types';

interface NotificationCenterProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const initialMockNotificationsList: NotificationItem[] = [
  {
    id: 'n-101',
    category: 'travel_reminder',
    titleAr: 'تذكير بموعد الرحلة • صنعاء إلى القاهرة',
    titleEn: 'Flight Departure Alert • Sanaa to Cairo',
    bodyAr: 'رحلتك رقم MS-810 تنطلق غداً الساعة 08:30 صباحاً. يرجى التواجد بالمطار قبل ساعتين.',
    bodyEn: 'Flight MS-810 departs tomorrow at 08:30 AM. Arrive at the terminal 2 hours prior.',
    timeAr: 'منذ 10 دقائق',
    timeEn: '10m ago',
    read: false
  },
  {
    id: 'n-102',
    category: 'passport_expiry',
    titleAr: 'تنبيه انتهاء الجواز • فاطمة المحسني',
    titleEn: 'Passport Expiry Warning • Fatima Al-Muhseni',
    bodyAr: 'صلاحية الجواز الحالي أقل من 6 أشهر (تنتهي 2026-09-10). يرجى التجديد لضمان إصدار التأشيرات.',
    bodyEn: 'Passport validity is under 6 months. Please renew before booking international trips.',
    timeAr: 'منذ ساعتين',
    timeEn: '2h ago',
    read: false
  },
  {
    id: 'n-103',
    category: 'wallet_activity',
    titleAr: 'تم إيداع مكافأة النخبة الذهبية',
    titleEn: 'Gold Elite Cashback Deposited',
    bodyAr: 'تمت إضافة $75.00 إلى رصيد محفظتك الرقمية كمكافأة ولاء من مساري.',
    bodyEn: '$75.00 loyalty cashback credited to your digital wallet balance.',
    timeAr: 'أمس',
    timeEn: 'Yesterday',
    read: true
  },
  {
    id: 'n-104',
    category: 'price_drop',
    titleAr: 'انخفاض أسعار فنادق مكة المكرمة',
    titleEn: 'Hotel Price Drop in Makkah',
    bodyAr: 'خصم خاص 20% على فندق أبراج الكسوة لموسم العمرة القادم.',
    bodyEn: 'Special 20% price drop on Al Kiswah Towers for upcoming Umrah season.',
    timeAr: 'قبل يومين',
    timeEn: '2d ago',
    read: true
  }
];

export default function NotificationCenter({
  lang,
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll
}: NotificationCenterProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel_reminder': return <Plane size={14} className="text-masari-blue" />;
      case 'passport_expiry': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'wallet_activity': return <Wallet size={14} className="text-emerald-500" />;
      case 'price_drop': return <Tag size={14} className="text-purple-500" />;
      default: return <Gift size={14} className="text-masari-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex justify-end">
      <div className="bg-white w-full max-w-xs h-full flex flex-col shadow-2xl border-l border-slate-200 animate-slide-in">
        
        {/* Header */}
        <div className="p-3.5 bg-slate-950 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-masari-cyan" />
            <h3 className="text-xs font-black">{isAr ? 'مركز التنبيهات والأشعارات' : 'Notifications Center'}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter & Action Controls */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-[10px] shrink-0">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                filter === 'all' ? 'bg-masari-blue text-white' : 'text-slate-600'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                filter === 'unread' ? 'bg-masari-blue text-white' : 'text-slate-600'
              }`}
            >
              {isAr ? 'غير مقروء' : 'Unread'} ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-masari-blue hover:underline font-bold cursor-pointer"
            >
              {isAr ? 'قراءة الكل' : 'Mark all read'}
            </button>
            <button
              onClick={onClearAll}
              className="text-rose-500 hover:underline font-bold cursor-pointer"
            >
              {isAr ? 'مسح' : 'Clear'}
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-1">
              <CheckCircle2 size={32} className="text-slate-300" />
              <span className="text-xs font-bold">{isAr ? 'لا توجد إشعارات حالياً' : 'No notifications'}</span>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  notif.read ? 'bg-white border-slate-200' : 'bg-masari-blue/5 border-masari-blue/30 font-medium'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    {getCategoryIcon(notif.category)}
                    <span className="text-[11px] leading-tight">{isAr ? notif.titleAr : notif.titleEn}</span>
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono shrink-0">
                    {isAr ? notif.timeAr : notif.timeEn}
                  </span>
                </div>

                <p className="text-[10px] text-slate-600 leading-relaxed">
                  {isAr ? notif.bodyAr : notif.bodyEn}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
