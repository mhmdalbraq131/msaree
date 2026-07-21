/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Building2, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Percent, 
  ShieldCheck, 
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { Language, Currency } from '../../types';

interface WalletRechargeModalProps {
  lang: Language;
  currency: Currency;
  formatCurrency: (val: number) => string;
  isOpen: boolean;
  onClose: () => void;
  wallet: any;
  setWallet: (w: any) => void;
  setWalletTransactions: (fn: (prev: any[]) => any[]) => void;
  setLedgerEntries: (fn: (prev: any[]) => any[]) => void;
  setSecurityLogs: (fn: (prev: any[]) => any[]) => void;
}

export default function WalletRechargeModal({
  lang,
  currency,
  formatCurrency,
  isOpen,
  onClose,
  wallet,
  setWallet,
  setWalletTransactions,
  setLedgerEntries,
  setSecurityLogs
}: WalletRechargeModalProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [method, setMethod] = useState<'card' | 'apple' | 'bank' | 'points' | 'promo'>('card');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('4000 1234 5678 9010');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleRecharge = () => {
    if (finalAmount <= 0) {
      alert(isAr ? 'يرجى تحديد مبلغ صحيح للشحن!' : 'Please enter a valid deposit amount!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const updatedBalance = wallet.availableBalance + finalAmount;
      setWallet({
        ...wallet,
        availableBalance: updatedBalance
      });

      const txRef = `MSR-TX-${Date.now().toString().slice(-6)}`;
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Add transaction
      setWalletTransactions((prev: any[]) => [
        {
          id: `tx-dep-${Date.now()}`,
          referenceNo: txRef,
          type: 'deposit',
          status: 'completed',
          amount: finalAmount,
          descriptionAr: `شحن رصيد المحفظة عبر (${method.toUpperCase()})`,
          descriptionEn: `Wallet Recharge via (${method.toUpperCase()})`,
          timestamp: timestamp,
        },
        ...prev
      ]);

      // Add Ledger entry
      setLedgerEntries((prev: any[]) => [
        {
          id: `led-${Date.now()}`,
          debit: 0.0,
          credit: finalAmount,
          balanceAfter: updatedBalance,
          description: `إيداع شحن محفظة - ${txRef}`,
          timestamp: timestamp,
        },
        ...prev
      ]);

      // Add Audit log
      setSecurityLogs((prev: any[]) => [
        {
          id: `aud-${Date.now()}`,
          action: 'WALLET_DEPOSIT_SUCCESS',
          details: `شحن محفظة بمبلغ $${finalAmount} عبر ${method.toUpperCase()}.`,
          timestamp: timestamp,
          severity: 'INFO'
        },
        ...prev
      ]);

      setSuccessMessage(isAr 
        ? `تم شحن المحفظة بمبلغ ${formatCurrency(finalAmount)} بنجاح!` 
        : `Wallet recharged with ${formatCurrency(finalAmount)} successfully!`);

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-masari-blue text-white flex items-center justify-center font-bold">
              <Wallet size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">{isAr ? 'شحن المحفظة الرقمية' : 'Recharge Wallet'}</h3>
              <p className="text-[9px] text-slate-400 font-mono">MASARI PAY &bull; INSTANT TOP-UP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-mono">{isAr ? 'الرصيد المتاح الحالي' : 'Current Available Balance'}</span>
            <span className="text-sm font-black font-mono text-masari-cyan">{formatCurrency(wallet.availableBalance)}</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-2 py-1 rounded font-bold border border-emerald-500/30">
            {isAr ? 'محفوظ وآمن' : 'Secured'}
          </span>
        </div>

        {/* Amount Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 block">
            {isAr ? 'اختر مبلغ الشحن' : 'Select Amount'}
          </label>
          <div className="grid grid-cols-4 gap-1.5 font-mono text-xs font-bold">
            {[50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedAmount === amt && !customAmount 
                    ? 'bg-masari-blue text-white border-masari-blue shadow-sm' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={isAr ? 'أو أدخل مبلغا مخصصا ($)...' : 'Or enter custom amount ($)...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 block">
            {isAr ? 'وسيلة الدفع' : 'Payment Method'}
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                method === 'card' ? 'bg-masari-blue/10 border-masari-blue text-masari-blue font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <CreditCard size={14} />
              <span className="text-[10px]">{isAr ? 'بطاقة ائتمان' : 'Credit/Debit Card'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('apple')}
              className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                method === 'apple' ? 'bg-masari-blue/10 border-masari-blue text-masari-blue font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Smartphone size={14} />
              <span className="text-[10px]">Apple / Google Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('bank')}
              className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                method === 'bank' ? 'bg-masari-blue/10 border-masari-blue text-masari-blue font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Building2 size={14} />
              <span className="text-[10px]">{isAr ? 'حوالة بنكية' : 'Bank Transfer'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('promo')}
              className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                method === 'promo' ? 'bg-masari-blue/10 border-masari-blue text-masari-blue font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <Gift size={14} />
              <span className="text-[10px]">{isAr ? 'كوبون / نقاط' : 'Promo / Points'}</span>
            </button>
          </div>
        </div>

        {/* Method Specific Fields */}
        {method === 'card' && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div>
              <label className="text-[9px] text-slate-500 font-bold block mb-0.5">{isAr ? 'رقم البطاقة' : 'Card Number'}</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs focus:outline-none focus:border-masari-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">MM/YY</label>
                <input
                  type="text"
                  defaultValue="12/28"
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">CVC</label>
                <input
                  type="text"
                  defaultValue="888"
                  className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>
            </div>
          </div>
        )}

        {method === 'promo' && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <label className="text-[9px] text-slate-500 font-bold block">{isAr ? 'رمز الكوبون أو الهدية' : 'Gift Promo Code'}</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="MASARI2026"
                className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs focus:outline-none focus:border-masari-blue uppercase"
              />
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleRecharge}
          disabled={isProcessing}
          className="w-full bg-masari-blue hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
        >
          {isProcessing ? (
            <span>{isAr ? 'جاري المعالجة والربط بالدفتر...' : 'Processing Payment...'}</span>
          ) : (
            <>
              <span>{isAr ? `تأكيد شحن ${formatCurrency(finalAmount)}` : `Confirm ${formatCurrency(finalAmount)} Top-up`}</span>
              <ShieldCheck size={14} />
            </>
          )}
        </button>

      </div>
    </div>
  );
}
