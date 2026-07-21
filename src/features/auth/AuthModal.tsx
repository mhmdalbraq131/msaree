/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Phone, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { AuthScreen, Language, UserProfile } from '../../types';

interface AuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  authMode: 'login' | 'register' | 'guest_upgrade' | 'otp';
  onAuthenticateSuccess: (user: UserProfile) => void;
}

export default function AuthModal({
  lang,
  isOpen,
  onClose,
  authMode,
  onAuthenticateSuccess
}: AuthModalProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [screen, setScreen] = useState<AuthScreen>(authMode as AuthScreen || 'login');
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  
  // Inputs
  const [emailInput, setEmailInput] = useState('user@masari.com');
  const [phoneInput, setPhoneInput] = useState('+967 777 123 456');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [nameInput, setNameInput] = useState('محمد البراق');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [otpDigits, setOtpDigits] = useState(['5', '8', '2', '0', '9', '1']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpChange = (val: string, index: number) => {
    if (/^[0-9]?$/.test(val)) {
      const updated = [...otpDigits];
      updated[index] = val;
      setOtpDigits(updated);

      if (val && index < 5) {
        const nextInput = document.getElementById(`auth-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleTriggerAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setScreen('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const authenticatedUser: UserProfile = {
        id: 'usr-101',
        name: nameInput || 'محمد البراق',
        email: emailInput,
        phone: phoneInput,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        loyaltyTier: 'VIP',
        loyaltyPoints: 350,
        walletBalance: 1250.00,
        isGuest: false,
        profileCompletion: 85,
        savedTravelersCount: 2
      };

      onAuthenticateSuccess(authenticatedUser);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-4 space-y-3 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-masari-blue text-white flex items-center justify-center font-bold">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">
                {screen === 'guest_upgrade' 
                  ? (isAr ? 'ترقية حساب الزائر' : 'Upgrade Guest Account')
                  : screen === 'otp'
                  ? (isAr ? 'التحقق بخطوتين (OTP)' : 'OTP Verification')
                  : (isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register')}
              </h3>
              <p className="text-[9px] text-slate-400 font-mono">MASARI SECURE AUTHENTICATION</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {/* Guest Mode Reward Upgrade Banner */}
        {screen === 'guest_upgrade' && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 font-black text-xs">
              <Sparkles size={14} />
              <span>{isAr ? 'احصل على 50$ رصيد ترحيبي!' : 'Get $50 Welcome Credit!'}</span>
            </div>
            <p className="text-[10px] text-amber-100 leading-tight">
              {isAr 
                ? 'سجل حسابك الآن لتأكيد الحجز وحفظ الجوازات والحصول على نقاط الولاء المباشرة.' 
                : 'Create account now to finalize booking, save passports, and redeem instant loyalty points.'}
            </p>
          </div>
        )}

        {/* Screen 1: Login / Register Form */}
        {(screen === 'login' || screen === 'register' || screen === 'guest_upgrade') && (
          <form onSubmit={handleTriggerAuth} className="space-y-2.5 text-xs">
            
            {/* Toggle Email / Phone */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLoginType('email')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  loginType === 'email' ? 'bg-masari-blue text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <Mail size={12} />
                <span>{isAr ? 'بالبريد الإلكتروني' : 'Email'}</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginType('phone')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  loginType === 'phone' ? 'bg-masari-blue text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                <Smartphone size={12} />
                <span>{isAr ? 'برقم الهاتف (SMS)' : 'Phone OTP'}</span>
              </button>
            </div>

            {screen === 'register' && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>
            )}

            {loginType === 'email' ? (
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-masari-blue"
                />
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">{isAr ? 'رقم الهاتف (+967 / +966)' : 'Phone Number'}</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">{isAr ? 'كلمة المرور' : 'Password'}</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-masari-blue"
              />
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded text-masari-blue focus:ring-0"
                />
                <span>{isAr ? 'تذكر هذا الجهاز للجلسات القادمة' : 'Remember this device'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-masari-blue text-white py-3 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-md"
            >
              {isSubmitting ? (isAr ? 'جاري إرسال رمز التحقق...' : 'Sending Code...') : (isAr ? 'متابعة وإرسال رمز التحقق ➔' : 'Continue to OTP Verification ➔')}
            </button>
          </form>
        )}

        {/* Screen 2: OTP Verification */}
        {screen === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                {isAr ? 'أدخل رمز التحقق المكون من 6 أرقام' : 'Enter 6-digit OTP code'}
              </span>
              <p className="text-[10px] text-slate-400">
                {isAr ? `تم إرسال الرمز إلى ${emailInput || phoneInput}` : `Code sent to ${emailInput || phoneInput}`}
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-1.5 font-mono" style={{ direction: 'ltr' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`auth-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-11 text-center font-black text-sm bg-slate-50 border border-slate-300 rounded-xl focus:border-masari-blue focus:bg-white focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={16} />
              <span>{isSubmitting ? (isAr ? 'جاري التحقق والتأكيد...' : 'Verifying...') : (isAr ? 'تأكيد الرمز والدخول للمنصة' : 'Verify & Complete Sign In')}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
