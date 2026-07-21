/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Wallet, 
  CreditCard, 
  FileText, 
  Users, 
  Sparkles, 
  Clock, 
  Building2, 
  Plane, 
  Tag, 
  QrCode,
  Download
} from 'lucide-react';
import { Booking, Traveler, UserProfile, Language, Currency } from '../../types';

interface BookingCheckoutSheetProps {
  lang: Language;
  currency: Currency;
  formatCurrency: (val: number) => string;
  isOpen: boolean;
  onClose: () => void;
  bookingItem: {
    type: 'flight' | 'tourism' | 'umrah' | 'hajj' | 'hotel' | 'bus' | 'car' | 'transfer' | 'visa';
    id: string;
    titleAr: string;
    titleEn: string;
    price: number;
    image?: string;
  } | null;
  user: UserProfile;
  travelers: Traveler[];
  wallet: any;
  onConfirmBooking: (newBooking: Booking, deductedAmount: number) => void;
  openAuthModal: () => void;
}

export default function BookingCheckoutSheet({
  lang,
  currency,
  formatCurrency,
  isOpen,
  onClose,
  bookingItem,
  user,
  travelers,
  wallet,
  onConfirmBooking,
  openAuthModal
}: BookingCheckoutSheetProps) {
  if (!isOpen || !bookingItem) return null;

  const isAr = lang === 'ar';
  const [step, setStep] = useState<'review' | 'travelers' | 'payment' | 'invoice'>('review');
  const [selectedTravelerIds, setSelectedTravelerIds] = useState<string[]>(
    travelers.length > 0 ? [travelers[0].id] : []
  );
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'apple'>('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');

  const finalPrice = Math.max(0, bookingItem.price - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'MASARI2026' || promoCode.toUpperCase() === 'MASARI') {
      setDiscountAmount(25);
      alert(isAr ? 'تم تطبيق خصم 25$ بنجاح!' : '$25 discount applied successfully!');
    } else {
      alert(isAr ? 'كوبون غير صالح' : 'Invalid promo code');
    }
  };

  const toggleSelectTraveler = (id: string) => {
    if (selectedTravelerIds.includes(id)) {
      setSelectedTravelerIds(selectedTravelerIds.filter(i => i !== id));
    } else {
      setSelectedTravelerIds([...selectedTravelerIds, id]);
    }
  };

  const handleFinalPayment = () => {
    // Check if user is Guest mode and prompt upgrade if required
    if (user.isGuest) {
      openAuthModal();
      return;
    }

    if (paymentMethod === 'wallet' && wallet.availableBalance < finalPrice) {
      alert(isAr 
        ? `رصيد المحفظة (${formatCurrency(wallet.availableBalance)}) غير كافٍ لتأكيد الدفع (${formatCurrency(finalPrice)})!` 
        : `Wallet balance (${formatCurrency(wallet.availableBalance)}) is insufficient for this booking (${formatCurrency(finalPrice)})!`);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const ref = `MSR-2026-${bookingItem.type.substring(0,3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBookingRef(ref);

      const selectedTravelerNames = travelers
        .filter(t => selectedTravelerIds.includes(t.id))
        .map(t => isAr ? t.fullNameAr : t.fullNameEn);

      const newBookingRecord: Booking = {
        id: `b-${Date.now()}`,
        bookingRef: ref,
        type: bookingItem.type,
        titleAr: bookingItem.titleAr,
        titleEn: bookingItem.titleEn,
        price: finalPrice,
        bookingDate: new Date().toISOString().split('T')[0],
        departureDate: '2026-09-01',
        status: 'confirmed',
        details: {
          passengersCount: Math.max(1, selectedTravelerIds.length),
          phone: user.phone || '+967 777 123 456',
          email: user.email || 'user@masari.com',
          travelerNames: selectedTravelerNames,
          paymentMethod: paymentMethod.toUpperCase(),
          invoiceUrl: `INVOICE-${ref}.pdf`
        }
      };

      onConfirmBooking(newBookingRecord, finalPrice);
      setStep('invoice');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-masari-blue text-white flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">{isAr ? 'إتمام حجز الرحلة وتأكيد العقد' : 'Complete Booking'}</h3>
              <p className="text-[9px] text-slate-400 font-mono">STEP {step === 'review' ? '1/3' : step === 'travelers' ? '2/3' : step === 'payment' ? '3/3' : 'FINAL'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Guest Warning Banner if in Guest Mode */}
        {user.isGuest && (
          <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl flex justify-between items-center">
            <div className="text-[10px] font-bold">
              <span>{isAr ? 'أنت تتصفح في وضع الزائر!' : 'You are browsing in Guest Mode!'}</span>
              <p className="text-[8px] opacity-90">{isAr ? 'قم بتسجيل الدخول لتأكيد الحجز وكسب النقاط' : 'Login to complete booking & earn rewards'}</p>
            </div>
            <button
              type="button"
              onClick={openAuthModal}
              className="bg-slate-950 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </div>
        )}

        {/* Item Summary Card */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex gap-2.5 items-center">
          {bookingItem.image && (
            <img 
              src={bookingItem.image} 
              alt="" 
              className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0" 
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex-1 text-xs">
            <h4 className="font-extrabold text-slate-800 leading-tight">
              {isAr ? bookingItem.titleAr : bookingItem.titleEn}
            </h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">{bookingItem.type}</span>
              <span className="font-mono font-black text-masari-blue">{formatCurrency(finalPrice)}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: REVIEW & TRAVELERS */}
        {step === 'review' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 flex justify-between items-center">
                <span>{isAr ? 'اختر المسافرين المحددين' : 'Select Travelers'}</span>
                <span className="text-[9px] text-masari-blue font-mono font-bold">{selectedTravelerIds.length} SELECTED</span>
              </label>

              <div className="space-y-1.5">
                {travelers.map((tr) => (
                  <div
                    key={tr.id}
                    onClick={() => toggleSelectTraveler(tr.id)}
                    className={`p-2 rounded-xl border flex justify-between items-center text-xs cursor-pointer transition-all ${
                      selectedTravelerIds.includes(tr.id) ? 'bg-masari-blue/5 border-masari-blue' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-800">{isAr ? tr.fullNameAr : tr.fullNameEn}</div>
                      <div className="text-[9px] text-slate-400 font-mono">{tr.passportNo} &bull; {tr.birthDate}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-xs ${
                      selectedTravelerIds.includes(tr.id) ? 'bg-masari-blue border-masari-blue text-white' : 'border-slate-300'
                    }`}>
                      {selectedTravelerIds.includes(tr.id) && '✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">{isAr ? 'كوبون الخصم' : 'Promo Code'}</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="MASARI2026"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono uppercase focus:outline-none focus:border-masari-blue"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
                >
                  {isAr ? 'تطبيق' : 'Apply'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('payment')}
              className="w-full bg-masari-blue text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-md"
            >
              {isAr ? 'المتابعة لوسائل الدفع ➔' : 'Proceed to Payment ➔'}
            </button>
          </div>
        )}

        {/* STEP 2: PAYMENT METHOD */}
        {step === 'payment' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 block">{isAr ? 'وسيلة الدفع المناسبة' : 'Payment Method'}</label>
              
              {/* Wallet Method */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border flex justify-between items-center text-xs cursor-pointer transition-all ${
                  paymentMethod === 'wallet' ? 'bg-masari-blue/5 border-masari-blue' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-masari-blue" />
                  <div>
                    <div className="font-bold text-slate-800">{isAr ? 'المحفظة الرقمية (رصيد مساري)' : 'Digital Wallet'}</div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {isAr ? 'الرصيد المتاح:' : 'Available:'} {formatCurrency(wallet.availableBalance)}
                    </div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'wallet' ? 'bg-masari-blue border-masari-blue text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'wallet' && '✓'}
                </div>
              </div>

              {/* Card Method */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex justify-between items-center text-xs cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-masari-blue/5 border-masari-blue' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-masari-cyan" />
                  <div>
                    <div className="font-bold text-slate-800">{isAr ? 'بطاقة ائتمانية (Visa / MasterCard)' : 'Credit Card'}</div>
                    <div className="text-[9px] text-slate-400 font-mono">•••• 4000</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'card' ? 'bg-masari-blue border-masari-blue text-white' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'card' && '✓'}
                </div>
              </div>
            </div>

            {/* Summary Total */}
            <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center">
              <span className="text-xs font-bold">{isAr ? 'المبلغ النهائي المخصوم:' : 'Total Amount:'}</span>
              <span className="text-sm font-black font-mono text-masari-cyan">{formatCurrency(finalPrice)}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                {isAr ? 'رجوع' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleFinalPayment}
                disabled={isProcessing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                {isProcessing ? (
                  <span>{isAr ? 'جاري الإصدار...' : 'Issuing Ticket...'}</span>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>{isAr ? 'تأكيد الحجز والدفع' : 'Confirm & Pay'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INVOICE GENERATION & AI SUMMARY */}
        {step === 'invoice' && (
          <div className="space-y-3 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">{isAr ? 'تم تأكيد الحجز بنجاح!' : 'Booking Confirmed!'}</h3>
              <p className="text-xs font-mono font-bold text-masari-blue">{confirmedBookingRef}</p>
            </div>

            {/* Digital QR Invoice card */}
            <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-2 text-right">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="font-bold text-masari-gold">{isAr ? 'فاتورة إلكترونية رسمية' : 'Official Digital Invoice'}</span>
                <QrCode size={20} className="text-masari-cyan" />
              </div>
              <div className="text-[10px] space-y-1 text-slate-300">
                <div>{isAr ? 'الخدمة:' : 'Service:'} <strong className="text-white">{isAr ? bookingItem.titleAr : bookingItem.titleEn}</strong></div>
                <div>{isAr ? 'المبلغ المدفوع:' : 'Amount Paid:'} <strong className="text-emerald-400 font-mono">{formatCurrency(finalPrice)}</strong></div>
                <div>{isAr ? 'حالة الحجز:' : 'Status:'} <strong className="text-emerald-400 font-mono">CONFIRMED (ISSUED)</strong></div>
              </div>
            </div>

            {/* AI Concierge Travel Summary */}
            <div className="bg-masari-blue/10 border border-masari-blue/30 p-3 rounded-xl text-right text-xs space-y-1">
              <div className="flex items-center gap-1 font-extrabold text-masari-blue">
                <Sparkles size={14} />
                <span>{isAr ? 'ملخص مساري الذكي للرحلة' : 'AI Trip Summary'}</span>
              </div>
              <p className="text-[10px] text-slate-700 leading-relaxed">
                {isAr 
                  ? 'تم حفظ حجزك وجوازات السفر المرفقة في حسابك. يمكنك الوصول للفاتورة وتفاصيل الرحلة في أي وقت من جدول الحجوزات.' 
                  : 'Your booking & associated passports are safely attached to your account. Access your digital ticket and invoice anytime.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer hover:bg-slate-800"
            >
              {isAr ? 'إغلاق والعودة للرئيسية' : 'Close & Return Home'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
