/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Wallet, 
  LineChart, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  Gift, 
  Bell, 
  RefreshCw, 
  Layers, 
  PlusCircle, 
  Check, 
  Play, 
  UserCheck, 
  BarChart3, 
  Database, 
  FileText,
  User,
  Ticket,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Booking } from '../../../types';
import { MasariAiEngine, AiResult } from '../domain/aiEngine';
import { 
  mockRecommendations, 
  mockExpenseCategories, 
  pilgrimChecklist, 
  requiredDocuments, 
  ritualSteps, 
  mockAdminAnalytics, 
  mockNotifications
} from '../data/mockAiData';

interface AiPlatformViewProps {
  lang: 'ar' | 'en';
  bookings: Booking[];
  setBookings: (b: Booking[]) => void;
  wallet: any;
  setWallet: (w: any) => void;
  walletTransactions: any[];
  setWalletTransactions: (t: any[]) => void;
  currency: string;
  formatCurrency: (val: number) => string;
  setActiveTab: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  textAr: string;
  textEn: string;
  timestamp: Date;
  actionExecuted?: {
    type: string;
    success: boolean;
    detailsAr: string;
    detailsEn: string;
  };
  data?: any;
}

export default function AiPlatformView({
  lang,
  bookings,
  setBookings,
  wallet,
  setWallet,
  walletTransactions,
  setWalletTransactions,
  currency,
  formatCurrency,
  setActiveTab
}: AiPlatformViewProps) {
  const isAr = lang === 'ar';
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      textAr: `مرحباً بك في **منصة مساري للذكاء الاصطناعي الموحدة والحديثة**! 👋\n\nأنا مساعد السفر والتحليل المالي الذكي الخاص بك. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن أسعار الرحلات، تفاصيل ميزانيتك، إصدار تأشيرة العمرة، أو إلغاء حجز معين.`,
      textEn: `Welcome to the **MASARI Enterprise AI Intelligence & Travel Agent Platform**! 👋\n\nI am your intelligent travel co-pilot and financial assistant. How can I serve you today? You can ask me to search flights, analyze expenses, check visa checklists, or cancel a booking with instant wallet refund.`,
      timestamp: new Date()
    }
  ]);

  // Checklist items in state so users can uncheck/check
  const [activeChecklist, setActiveChecklist] = useState(pilgrimChecklist);
  const [activeNotifications, setActiveNotifications] = useState(mockNotifications);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      textAr: textToSend,
      textEn: textToSend,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI thinking and executing
    setTimeout(() => {
      const result = MasariAiEngine.processQuery(textToSend, {
        lang,
        bookings,
        setBookings,
        wallet,
        setWallet,
        walletTransactions,
        setWalletTransactions,
        currency,
        formatCurrency
      });

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        textAr: result.messageAr,
        textEn: result.messageEn,
        timestamp: new Date(),
        actionExecuted: result.actionExecuted,
        data: result.data
      };

      setChatHistory(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const toggleChecklistItem = (id: string) => {
    setActiveChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, done: !item.done };
      }
      return item;
    }));
  };

  const handleClearNotifications = () => {
    setActiveNotifications([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      
      {/* 1. Header with Pulse Core Glowing Ring */}
      <div className="bg-slate-900 text-white p-3.5 shrink-0 flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-masari-blue/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-masari-cyan/10 rounded-full blur-xl" />
        
        <div className="flex items-center gap-2.5 relative z-10">
          <button
            id="ai-platform-back-btn"
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isAr ? 'الرجوع للرئيسية' : 'Back to Home'}
          >
            {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-masari-blue to-masari-cyan flex items-center justify-center text-white shadow-lg shadow-masari-blue/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            {/* Animated outer gold aura */}
            <div className="absolute -inset-0.5 rounded-xl border border-masari-gold/40 animate-ping opacity-30" />
          </div>
          
          <div>
            <h2 className="text-xs font-black tracking-tight flex items-center gap-1">
              <span>{isAr ? 'منصة مساري للذكاء الاصطناعي' : 'MASARI AI Platform'}</span>
              <span className="bg-masari-gold/20 text-masari-gold text-[8px] font-mono px-1 rounded border border-masari-gold/30">v2.1</span>
            </h2>
            <p className="text-[9px] text-slate-400 font-mono">
              {isAr ? 'محرك ذكي متكامل مع دفتر الحسابات والحجوزات' : 'Fully integrated with Ledger & Active Bookings'}
            </p>
          </div>
        </div>

        {/* User / Admin Mode Toggle Switch */}
        <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 flex relative z-10 text-[9px] font-bold">
          <button
            id="ai-mode-user-btn"
            onClick={() => setMode('user')}
            className={`px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'user' ? 'bg-masari-blue text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3 h-3" />
            <span>{isAr ? 'المستخدم' : 'User'}</span>
          </button>
          <button
            id="ai-mode-admin-btn"
            onClick={() => setMode('admin')}
            className={`px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'admin' ? 'bg-masari-gold text-slate-900 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3 h-3" />
            <span>{isAr ? 'المسؤول' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0 bg-slate-100/50">
        
        {mode === 'user' ? (
          /* ==================== USER EXPERIENCE LAYOUT ==================== */
          <>
            {/* Quick Interactive Widgets Panel */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {/* Widget A: Wallet Info Core */}
              <div 
                onClick={() => handleSendMessage('show my wallet balance')}
                className="bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:border-masari-blue hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                  <span>{isAr ? 'المحفظة الرقمية' : 'Digital Wallet'}</span>
                  <Wallet className="w-3.5 h-3.5 text-masari-blue" />
                </div>
                <div className="text-xs font-black text-slate-800 font-mono">{formatCurrency(wallet.availableBalance)}</div>
                <div className="text-[8px] text-emerald-600 mt-0.5 flex items-center gap-0.5">
                  <Check className="w-2 h-2" />
                  <span>{isAr ? 'متصل بالدفتر الموحد' : 'Ledger Connected'}</span>
                </div>
              </div>

              {/* Widget B: Pilgrim Support Check */}
              <div 
                onClick={() => handleSendMessage('hajj preparation checklist')}
                className="bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:border-masari-blue hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                  <span>{isAr ? 'تحضيرات الحج' : 'Pilgrim Checklist'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-masari-gold" />
                </div>
                <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <span>{activeChecklist.filter(c => c.done).length}/{activeChecklist.length}</span>
                  <span className="text-[9px] text-slate-500 font-normal">{isAr ? 'مكتمل' : 'Done'}</span>
                </div>
                <div className="text-[8px] text-slate-400 mt-0.5 truncate">
                  {isAr ? 'عرض متطلبات المناسك والوثائق' : 'View requirements & papers'}
                </div>
              </div>
            </div>

            {/* Smart Intelligent Notifications Feed */}
            {activeNotifications.length > 0 && (
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Bell className="w-3 h-3 text-red-500 animate-bounce" />
                    {isAr ? 'تنبيهات الذكاء الاصطناعي النشطة' : 'AI Engine Smart Alerts'}
                  </span>
                  <button 
                    onClick={handleClearNotifications}
                    className="text-[9px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {isAr ? 'تجاهل الكل' : 'Dismiss All'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  {activeNotifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => handleSendMessage(isAr ? notif.titleAr : notif.titleEn)}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex gap-2 cursor-pointer hover:bg-slate-100/80 transition-colors text-right"
                    >
                      <div className="mt-0.5">
                        {notif.severity === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : notif.severity === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <Gift className="w-3.5 h-3.5 text-masari-blue shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 text-[10px] leading-tight">
                        <div className="font-bold text-slate-800">{isAr ? notif.titleAr : notif.titleEn}</div>
                        <div className="text-slate-500 text-[9px] mt-0.5">{isAr ? notif.descAr : notif.descEn}</div>
                      </div>
                      <span className="text-[8px] text-slate-400 shrink-0 self-end font-mono">{isAr ? notif.timeAr : notif.timeEn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversational Chat Box Layout */}
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-[320px] overflow-hidden shadow-sm relative">
              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-masari-blue text-white rounded-tr-none text-left'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none text-right'
                      }`}
                    >
                      {/* Render markdown bold tags inside the simple text for visual clarity */}
                      <p className="whitespace-pre-line text-[11px] leading-relaxed">
                        {isAr ? msg.textAr : msg.textEn}
                      </p>

                      {/* Display Action Log if an action was executed by the AI */}
                      {msg.actionExecuted && (
                        <div className="mt-2 p-1.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[9px] border border-slate-800 flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-white border-b border-slate-800 pb-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <span className="font-bold">SYSTEM ACTION RECORDED</span>
                          </div>
                          <div>TYPE: <span className="font-bold text-white">{msg.actionExecuted.type}</span></div>
                          <div>STATUS: <span className="text-emerald-400">SUCCESS</span></div>
                          <div className="text-[8px] text-slate-400 border-t border-slate-800/50 pt-1 mt-0.5">
                            {isAr ? msg.actionExecuted.detailsAr : msg.actionExecuted.detailsEn}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="text-[8px] text-slate-400 mt-0.5 px-1 font-mono">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-slate-100 p-2.5 rounded-2xl rounded-tl-none w-16">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-2 border-t border-slate-150 bg-slate-50 flex gap-2 items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-masari-blue"
                  placeholder={isAr ? 'اسألني عن الرحلات أو النفقات أو إلغاء الحجز...' : 'Ask about flights, transit, cancel bookings...'}
                />
                <button
                  onClick={() => handleSendMessage(chatInput)}
                  className="w-8 h-8 rounded-xl bg-masari-blue text-white flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Panel */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                {isAr ? 'اقتراحات البحث والتفاعل الطبيعي' : 'Natural Search Suggestions'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  isAr ? 'أرخص باص من صنعاء إلى عدن' : 'Cheapest bus from Sana\'a to Aden',
                  isAr ? 'فندق قريب من الحرم المكي' : 'Hotel near the Haram',
                  isAr ? 'باقة عمرة لمدة خمسة أيام' : 'Umrah package for five days',
                  isAr ? 'توصيل مطار VIP' : 'VIP airport transfer',
                  isAr ? 'ميزانيتي المتاحة 500 دولار فقط' : 'I only have 500 USD'
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-masari-blue transition-all cursor-pointer text-right flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-masari-blue" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Recommendations Module */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-masari-gold animate-pulse" />
                {isAr ? 'توصيات السفر الشخصية والذكية' : 'Personalized AI Recommendations'}
              </span>

              <div className="space-y-2">
                {mockRecommendations.map(rec => (
                  <div 
                    key={rec.id}
                    className="p-2.5 rounded-lg border border-slate-150 hover:border-masari-blue transition-all bg-slate-50 flex gap-2.5"
                  >
                    <img 
                      src={rec.image} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-[10px] min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 truncate">{isAr ? rec.titleAr : rec.titleEn}</span>
                        <span className="font-mono font-black text-masari-blue">{formatCurrency(rec.price)}</span>
                      </div>
                      <p className="text-slate-500 text-[9px] mt-0.5 line-clamp-2">
                        {isAr ? rec.reasonAr : rec.reasonEn}
                      </p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="bg-masari-gold/15 text-masari-gold font-bold font-mono text-[8px] px-1 rounded border border-masari-gold/20">
                          🎯 {rec.score}% MATCH
                        </span>
                        <button
                          onClick={() => handleSendMessage(`book ${isAr ? rec.titleAr : rec.titleEn}`)}
                          className="text-[9px] font-black text-masari-blue flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          <span>{isAr ? 'احجز الآن' : 'Book Now'}</span>
                          {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Hajj & Umrah Helper (Checklist + Rituals) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                {isAr ? 'دليل ومساعد الحاج والمعتمر التفاعلي' : 'Pilgrim Ritual & Docs Companion'}
              </span>

              {/* Step checklist */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 block">{isAr ? 'قائمة الاستعداد والتحضيرات الشخصية:' : 'Preparation Checklist status:'}</span>
                <div className="space-y-1.5">
                  {activeChecklist.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-center gap-2 p-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 transition-colors cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        item.done ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-300'
                      }`}>
                        {item.done && <Check className="w-3 h-3" />}
                      </div>
                      <span className={`text-[9.5px] leading-tight ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {isAr ? item.textAr : item.textEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ritual Guide */}
              <div className="space-y-2 pt-1">
                <span className="text-[9px] font-bold text-slate-400 block">{isAr ? 'المراحل ومسار المناسك المعتمد:' : 'Standard Ritual Steps Pathway:'}</span>
                <div className="relative border-r-2 border-slate-200 mr-2 space-y-3.5 pr-3">
                  {ritualSteps.filter(r => r.type === 'umrah').map(r => (
                    <div key={r.step} className="relative text-right">
                      <div className="absolute -right-[19px] top-0 w-3.5 h-3.5 rounded-full bg-masari-gold flex items-center justify-center text-[8px] font-black text-white border border-white">
                        {r.step}
                      </div>
                      <div className="text-[10px]">
                        <div className="font-bold text-slate-800">{isAr ? r.titleAr : r.titleEn}</div>
                        <p className="text-slate-500 text-[9px] leading-relaxed mt-0.5">{isAr ? r.descriptionAr : r.descriptionEn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ==================== ADMIN EXPERIENCE LAYOUT ==================== */
          <div className="space-y-3">
            
            {/* Admin Header overview */}
            <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                <span>{isAr ? 'إجمالي المبيعات السنوية' : 'TOTAL ANUAL REVENUE'}</span>
                <BarChart3 className="w-4 h-4 text-masari-gold animate-pulse" />
              </div>
              <div className="text-lg font-black font-mono text-masari-gold">
                {formatCurrency(mockAdminAnalytics.totalRevenue)}
              </div>
              <p className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>+{mockAdminAnalytics.revenueChangePercent}% {isAr ? 'نمو ربع سنوي مسجل' : 'MoM Business Growth'}</span>
              </p>
            </div>

            {/* A. REVENUE TREND BAR CHART (PURE SVG/HTML) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <LineChart className="w-3.5 h-3.5 text-masari-blue" />
                {isAr ? 'تطور العائدات ومبيعات المواسم 2026' : 'Revenue Development & Peak Season Cycles'}
              </span>

              {/* Pure HTML Bar Chart representing data */}
              <div className="flex justify-between items-end h-24 pt-4 border-b border-slate-200/60 pb-1">
                {mockAdminAnalytics.monthlyBookings.map((b, idx) => {
                  const maxRevenue = 69000;
                  const percentHeight = (b.revenue / maxRevenue) * 100;
                  const isPeak = b.month === 'Jun' || b.month === 'Apr';
                  
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-6 bg-slate-950 text-white font-mono text-[8px] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow pointer-events-none">
                        {formatCurrency(b.revenue)}
                      </div>

                      {/* Bar */}
                      <div 
                        style={{ height: `${percentHeight}%` }}
                        className={`w-4 rounded-t transition-all duration-300 ${
                          isPeak ? 'bg-gradient-to-t from-masari-gold to-yellow-400 shadow-md shadow-amber-500/10' : 'bg-masari-blue hover:bg-slate-800'
                        }`}
                      />
                      <span className="text-[9px] text-slate-500 font-bold mt-1 font-mono">{b.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 pt-0.5">
                <span>{isAr ? 'موسم رمضان (أبريل)' : 'Ramadan (April Peak)'}</span>
                <span>{isAr ? 'موسم الحج (يونيو)' : 'Hajj (June Peak)'}</span>
              </div>
            </div>

            {/* B. POPULAR DESTINATIONS AND MARKET SHARE */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                {isAr ? 'حصة المبيعات وتفضيلات الوجهات' : 'Destination Market Share Distribution'}
              </span>

              <div className="space-y-2">
                {mockAdminAnalytics.popularDestinations.map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-slate-800">{isAr ? d.nameAr : d.nameEn}</span>
                      <span className="font-mono text-slate-500">{d.count} {isAr ? 'حجز' : 'Bookings'} ({d.percentage}%)</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${d.percentage}%`, backgroundColor: d.color }} 
                        className="h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C. FINANCIAL WALLET STATISTICS LEDGER */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 border-b border-slate-100 pb-1.5">
                <Wallet className="w-3.5 h-3.5 text-masari-blue" />
                {isAr ? 'دفتر إحصائيات محافظ العملاء الموحدة' : 'Unified Customer Wallet Ledger stats'}
              </span>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-slate-400 block text-[8px] uppercase font-bold">{isAr ? 'المحافظ النشطة:' : 'Active Wallets:'}</span>
                  <strong className="text-slate-800 font-mono">{mockAdminAnalytics.walletStats.totalActiveWallets}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-slate-400 block text-[8px] uppercase font-bold">{isAr ? 'متوسط رصيد المحفظة:' : 'Avg Balance:'}</span>
                  <strong className="text-slate-800 font-mono">{formatCurrency(mockAdminAnalytics.walletStats.averageWalletBalance)}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-slate-400 block text-[8px] uppercase font-bold">{isAr ? 'إيداعات الشهر الجاري:' : 'Monthly Deposits:'}</span>
                  <strong className="text-emerald-600 font-mono">{formatCurrency(mockAdminAnalytics.walletStats.totalDepositsThisMonth)}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
                  <span className="text-slate-400 block text-[8px] uppercase font-bold">{isAr ? 'سحبيات الشهر الجاري:' : 'Monthly Voids:'}</span>
                  <strong className="text-rose-600 font-mono">{formatCurrency(mockAdminAnalytics.walletStats.totalWithdrawalsThisMonth)}</strong>
                </div>
              </div>
            </div>

            {/* D. CANCELLATION CAUSE ANALYSIS */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                {isAr ? 'أسباب وإحصائيات إلغاء الحجوزات' : 'Cancellation Cause Analysis'}
              </span>

              <div className="space-y-2">
                {mockAdminAnalytics.cancellationTrends.map((c, idx) => (
                  <div key={idx} className="p-2 rounded bg-rose-50/50 border border-rose-100 flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-700 leading-tight pr-2 text-right">
                      {isAr ? c.reasonAr : c.reasonEn}
                    </span>
                    <span className="font-mono font-black text-rose-600 shrink-0">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* E. STRATEGIC RECOMMENDATIONS FOR DIRECTORS */}
            <div className="bg-yellow-50/40 border border-yellow-200/80 p-3 rounded-xl space-y-1.5">
              <span className="text-[10px] font-black uppercase text-yellow-800 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                {isAr ? 'توصيات تشغيلية مدعومة بالذكاء الاصطناعي' : 'AI-Driven Operational Strategy'}
              </span>
              <p className="text-[10px] text-yellow-900 leading-relaxed text-right">
                {isAr 
                  ? 'نقترح ربطاً آلياً مباشراً مع وكالات الخارجية لإصدار تأشيرات الحج والعمرة الفورية بنظام الربط التلقائي بوزارة الحج السعودية لخفض إلغاء الرحلات بمعدل 30%.' 
                  : 'We strongly suggest active API integration with KSA Hajj ministries to auto-approve electronic pilgrim visas on ticket issuance, potentially reducing current cancellation metrics by 30%.'}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* 3. Bottom Verification Stamp */}
      <div className="bg-slate-900 text-slate-500 text-[8px] py-1.5 px-3 text-center font-mono border-t border-slate-800 shrink-0 relative z-10">
        {isAr 
          ? 'نظام مساري الذكي الموحد • تشفير وحماية بدرجة المؤسسات • 2026' 
          : 'MASARI INTELLIGENCE PLATFORM • ENTERPRISE SHA-256 SECURED • 2026'}
      </div>

    </div>
  );
}
