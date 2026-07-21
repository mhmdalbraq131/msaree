/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Calendar, 
  Globe, 
  Info 
} from 'lucide-react';
import { Traveler, PassportDoc, Language } from '../../types';

interface TravelerManagerProps {
  lang: Language;
  travelers: Traveler[];
  onAddTraveler: (t: Traveler) => void;
  onRemoveTraveler: (id: string) => void;
  onSelectTravelerForBooking?: (t: Traveler) => void;
  isSelectionMode?: boolean;
}

export const initialMockTravelers: Traveler[] = [
  {
    id: 'tr-101',
    type: 'primary',
    fullNameAr: 'محمد بن علي البراق',
    fullNameEn: 'Mohammed Ali Al-Buraq',
    passportNo: 'P09823412',
    nationalityAr: 'يمني',
    nationalityEn: 'Yemeni',
    birthDate: '1988-05-14',
    gender: 'male',
    passportExpiry: '2028-11-20',
    issuingCountryAr: 'اليمن',
    issuingCountryEn: 'Yemen',
    specialRequirements: 'مقعد قرب الممر - وجبة حلال خفيفة',
    emergencyContactPhone: '+967 777 000 111',
    isVerifiedPassport: true
  },
  {
    id: 'tr-102',
    type: 'spouse',
    fullNameAr: 'فاطمة أحمد المحسني',
    fullNameEn: 'Fatima Ahmed Al-Muhseni',
    passportNo: 'P08712390',
    nationalityAr: 'يمني',
    nationalityEn: 'Yemeni',
    birthDate: '1992-08-22',
    gender: 'female',
    passportExpiry: '2026-09-10', // Expiring soon (<6 months warning)
    issuingCountryAr: 'اليمن',
    issuingCountryEn: 'Yemen',
    specialRequirements: 'خدمة كرسي متحرك للمطار',
    emergencyContactPhone: '+967 777 000 111',
    isVerifiedPassport: true
  }
];

export default function TravelerManager({
  lang,
  travelers,
  onAddTraveler,
  onRemoveTraveler,
  onSelectTravelerForBooking,
  isSelectionMode = false
}: TravelerManagerProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'travelers' | 'passports'>('travelers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  // Form State
  const [form, setForm] = useState<Partial<Traveler>>({
    type: 'family' as any,
    fullNameAr: '',
    fullNameEn: '',
    passportNo: '',
    nationalityAr: 'يمني',
    nationalityEn: 'Yemeni',
    birthDate: '1995-01-01',
    gender: 'male',
    passportExpiry: '2029-01-01',
    issuingCountryAr: 'اليمن',
    issuingCountryEn: 'Yemen',
    specialRequirements: '',
    emergencyContactPhone: ''
  });

  const handleSimulatedOcrScan = () => {
    setIsScanningOcr(true);
    setOcrSuccess(false);

    setTimeout(() => {
      setIsScanningOcr(false);
      setOcrSuccess(true);
      setForm({
        ...form,
        fullNameAr: 'عمر خالد السقاف',
        fullNameEn: 'Omar Khalid Al-Saqqaf',
        passportNo: `P${Math.floor(10000000 + Math.random() * 90000000)}`,
        birthDate: '1990-03-15',
        passportExpiry: '2029-06-30',
        nationalityAr: 'يمني',
        nationalityEn: 'Yemeni',
        gender: 'male',
      });
    }, 1800);
  };

  const handleSaveTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullNameAr || !form.passportNo) {
      alert(isAr ? 'يرجى إدخال الاسم وجواز السفر!' : 'Please fill full name and passport number!');
      return;
    }

    const newTr: Traveler = {
      id: `tr-${Date.now()}`,
      type: form.type || 'friend',
      fullNameAr: form.fullNameAr || '',
      fullNameEn: form.fullNameEn || form.fullNameAr,
      passportNo: form.passportNo || '',
      nationalityAr: form.nationalityAr || 'يمني',
      nationalityEn: form.nationalityEn || 'Yemeni',
      birthDate: form.birthDate || '1990-01-01',
      gender: form.gender || 'male',
      passportExpiry: form.passportExpiry || '2029-01-01',
      issuingCountryAr: form.issuingCountryAr || 'اليمن',
      issuingCountryEn: form.issuingCountryEn || 'Yemen',
      specialRequirements: form.specialRequirements || '',
      emergencyContactPhone: form.emergencyContactPhone || '',
      isVerifiedPassport: true
    };

    onAddTraveler(newTr);
    setShowAddModal(false);
    setOcrSuccess(false);
  };

  // Helper check if passport expires in under 6 months
  const isExpiringSoon = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiry <= sixMonthsFromNow;
  };

  return (
    <div className="w-full space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
      
      {/* Header Tabs */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <button
            id="travelers-tab-btn"
            onClick={() => setActiveTab('travelers')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'travelers' ? 'bg-masari-blue text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            <Users size={13} />
            <span>{isAr ? 'إدارة المسافرين' : 'Travelers List'}</span>
            <span className="text-[9px] bg-white/20 px-1 rounded-full">{travelers.length}</span>
          </button>
          <button
            id="passports-tab-btn"
            onClick={() => setActiveTab('passports')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
              activeTab === 'passports' ? 'bg-masari-blue text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            <FileText size={13} />
            <span>{isAr ? 'مركز الجوازات' : 'Passport Center'}</span>
          </button>
        </div>

        <button
          id="add-traveler-modal-open-btn"
          onClick={() => setShowAddModal(true)}
          className="bg-masari-cyan text-white text-[11px] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer shadow-sm"
        >
          <UserPlus size={13} />
          <span>{isAr ? 'إضافة مسافر' : 'Add Traveler'}</span>
        </button>
      </div>

      {/* Main Content View */}
      {activeTab === 'travelers' ? (
        <div className="space-y-2">
          {travelers.map((tr) => {
            const warningExpiry = isExpiringSoon(tr.passportExpiry);
            return (
              <div
                key={tr.id}
                className={`bg-white p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                  warningExpiry ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200 hover:border-masari-blue/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-masari-blue text-xs border border-slate-200">
                      {tr.type === 'primary' ? '👤' : tr.gender === 'male' ? '👨' : '👩'}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">
                        {isAr ? tr.fullNameAr : tr.fullNameEn}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-mono">
                        {tr.passportNo} &bull; {isAr ? tr.nationalityAr : tr.nationalityEn} &bull; {tr.birthDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isSelectionMode ? (
                      <button
                        onClick={() => onSelectTravelerForBooking && onSelectTravelerForBooking(tr)}
                        className="bg-masari-blue text-white text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-slate-800"
                      >
                        {isAr ? 'اختيار للحجز' : 'Select'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onRemoveTraveler(tr.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Passport Status Warning Bar */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[9px] font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} className={warningExpiry ? 'text-amber-600' : 'text-slate-400'} />
                    <span className={warningExpiry ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                      {isAr ? 'انتهاء الجواز:' : 'Passport Expiry:'} {tr.passportExpiry}
                    </span>
                  </div>

                  {warningExpiry ? (
                    <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <AlertTriangle size={10} />
                      {isAr ? 'ينتهي خلال أقل من 6 أشهر' : 'Expiring < 6 Months'}
                    </span>
                  ) : (
                    <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck size={10} />
                      {isAr ? 'جواز ساري وموثق' : 'Valid Passport'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Passport Center Tab */
        <div className="space-y-3">
          <div className="bg-slate-900 text-white p-3 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black flex items-center gap-1.5 text-masari-gold">
                <Sparkles size={14} />
                <span>{isAr ? 'مركز الجوازات والمقارنة الرقمية (OCR)' : 'Smart Passport OCR Hub'}</span>
              </h4>
              <span className="text-[9px] bg-masari-gold/20 text-masari-gold px-1.5 rounded font-mono">AI OCR v2</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {isAr 
                ? 'ارفع صورة جواز السفر ليقوم الذكاء الاصطناعي باستخراج البيانات تلقائياً وتحديث صلاحية التأشيرات والتنبيه قبل الانتهاء.'
                : 'Upload passport photo for instant AI OCR field extraction, visa validation, and early expiry alerts.'}
            </p>

            {/* OCR Drag & Drop Zone */}
            <div
              onClick={handleSimulatedOcrScan}
              className="border-2 border-dashed border-slate-700 hover:border-masari-cyan p-4 rounded-xl flex flex-col items-center justify-center text-center bg-slate-950/60 cursor-pointer transition-colors"
            >
              <Camera size={24} className="text-masari-cyan mb-1 animate-pulse" />
              <span className="text-xs font-bold text-white">
                {isScanningOcr 
                  ? (isAr ? 'جاري المسح الضوئي واستخراج البيانات...' : 'Scanning & extracting passport fields...') 
                  : (isAr ? 'اضغط لرفع صورة الجواز أو التقاطها' : 'Click to upload or scan passport image')}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 font-mono">JPG, PNG, PDF (Max 10MB)</span>
            </div>
          </div>

          {/* List of Passports Status */}
          <div className="space-y-2">
            {travelers.map((tr) => (
              <div key={`p-${tr.id}`} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-800">{isAr ? tr.fullNameAr : tr.fullNameEn}</div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {tr.passportNo} &bull; {tr.passportExpiry}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    {isAr ? 'مستخرج بـ OCR' : 'OCR Extracted'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Traveler Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900">
                {isAr ? 'إضافة مسافر جديد' : 'Add New Traveler'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* OCR Auto Fill Option */}
            <div className="bg-slate-900 text-white p-2.5 rounded-xl flex justify-between items-center">
              <div className="text-[10px]">
                <span className="font-bold text-masari-cyan block">{isAr ? 'مسح الجواز بـ OCR' : 'Scan Passport OCR'}</span>
                <span className="text-[8px] text-slate-400">{isAr ? 'تعبئة تلقائية للبيانات' : 'Auto-fill fields from image'}</span>
              </div>
              <button
                type="button"
                onClick={handleSimulatedOcrScan}
                disabled={isScanningOcr}
                className="bg-masari-blue text-white text-[10px] px-2.5 py-1 rounded-lg font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1"
              >
                <Sparkles size={11} />
                <span>{isScanningOcr ? 'جاري المسح...' : (isAr ? 'مسح ضوئي' : 'Scan')}</span>
              </button>
            </div>

            {ocrSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-[10px] p-2 rounded-lg border border-emerald-200 flex items-center gap-1 font-bold">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>{isAr ? 'تم استخراج كافة بيانات الجواز بنجاح!' : 'Passport data successfully extracted via AI OCR!'}</span>
              </div>
            )}

            <form onSubmit={handleSaveTraveler} className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                  {isAr ? 'الاسم الكامل بالعربية' : 'Full Name (Arabic)'}
                </label>
                <input
                  type="text"
                  required
                  value={form.fullNameAr}
                  onChange={(e) => setForm({ ...form, fullNameAr: e.target.value })}
                  placeholder="محمد بن علي البراق"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                  {isAr ? 'الاسم كما في جواز السفر (إنجليزي)' : 'Full Name (English Passport)'}
                </label>
                <input
                  type="text"
                  required
                  value={form.fullNameEn}
                  onChange={(e) => setForm({ ...form, fullNameEn: e.target.value })}
                  placeholder="Mohammed Ali Al-Buraq"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isAr ? 'رقم الجواز' : 'Passport Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.passportNo}
                    onChange={(e) => setForm({ ...form, passportNo: e.target.value })}
                    placeholder="P12345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isAr ? 'الجنسية' : 'Nationality'}
                  </label>
                  <input
                    type="text"
                    value={form.nationalityAr}
                    onChange={(e) => setForm({ ...form, nationalityAr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isAr ? 'تاريخ الميلاد' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isAr ? 'تاريخ انتهاء الجواز' : 'Passport Expiry'}
                  </label>
                  <input
                    type="date"
                    value={form.passportExpiry}
                    onChange={(e) => setForm({ ...form, passportExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                  {isAr ? 'متطلبات خاصة أو طوارئ' : 'Special Requirements'}
                </label>
                <input
                  type="text"
                  value={form.specialRequirements}
                  onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
                  placeholder={isAr ? 'كرسي متحرك، وجبة حلال، إلخ' : 'Wheelchair, Halal meal, etc.'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-masari-blue text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 cursor-pointer shadow-md"
                >
                  {isAr ? 'حفظ المسافر' : 'Save Traveler'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
