/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Sparkles, X, ChevronRight, ChevronLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Language } from '../../types';

interface SmartSearchOverlayProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onSelectSearchQuery: (query: string) => void;
  openAiAssistantWithQuery: (query: string) => void;
}

export default function SmartSearchOverlay({
  lang,
  isOpen,
  onClose,
  onSelectSearchQuery,
  openAiAssistantWithQuery
}: SmartSearchOverlayProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');

  const quickPrompts = [
    { ar: 'فندق 5 نجوم قريب جداً من الحرم المكي', en: '5-star hotel near Makkah Haram' },
    { ar: 'أرخص حافلة VIP من صنعاء إلى عدن غداً', en: 'Cheapest VIP bus Sanaa to Aden tomorrow' },
    { ar: 'باقة عمرة عائلية 7 أيام شاملة الطيران والسكن', en: '7-day family Umrah package with flight & hotel' },
    { ar: 'رحلة طيران مباشرة صنعاء إلى القاهرة أقل من 300$', en: 'Direct flight Sanaa to Cairo under $300' },
    { ar: 'تأشيرة سياحية إلكترونية متعددة السفرات', en: 'Multiple-entry e-tourist visa' },
    { ar: 'توصيل خاص جمس يوكن من مطار جدة إلى مكة', en: 'Private GMC transfer Jeddah Airport to Makkah' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    openAiAssistantWithQuery(query);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-start justify-center p-4 pt-12">
      <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-200">
        
        {/* Header Search Box */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-masari-cyan animate-pulse" />
            <h3 className="text-xs font-black text-slate-900">
              {isAr ? 'البحث الطبيعي والذكي الموحد' : 'Universal Natural Smart Search'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باللغة الطبيعية (مثال: فندق رخيص بـ 100$ في مكة)...' : 'Search in natural language (e.g. cheap hotel in Makkah)...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-9 pr-9 text-xs focus:outline-none focus:border-masari-blue focus:bg-white"
            />
            <Search size={16} className="absolute top-3.5 left-3 text-slate-400" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-3.5 right-3 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-masari-blue text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-800 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{isAr ? 'ابحث بواسطة محرك مساري الذكي ➔' : 'Search via Masari AI Engine ➔'}</span>
          </button>
        </form>

        {/* Quick Prompts Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
            {isAr ? 'اقتراحات البحث الأكثر طلباً:' : 'Popular Search Prompts:'}
          </span>
          <div className="space-y-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  openAiAssistantWithQuery(isAr ? p.ar : p.en);
                  onClose();
                }}
                className="w-full text-right p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex justify-between items-center transition-all cursor-pointer"
              >
                <span className="truncate pr-2">{isAr ? p.ar : p.en}</span>
                <Sparkles size={12} className="text-masari-cyan shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
