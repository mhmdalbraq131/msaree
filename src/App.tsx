/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DeviceSimulator from './components/DeviceSimulator';
import TechHub from './components/TechHub';
import { Language, Currency } from './types';
import { Compass, BookOpen, Smartphone, ShieldCheck, ChevronRight, ChevronLeft, Globe, HelpCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [viewMode, setViewMode] = useState<'both' | 'simulator' | 'specs'>('both');

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col antialiased selection:bg-masari-cyan selection:text-slate-900">
      
      {/* Luxury Enterprise Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 transition-all duration-150 shadow-lg">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-masari-blue to-masari-cyan rounded-xl flex items-center justify-center text-white shadow-lg shadow-masari-blue/30 relative overflow-hidden animate-pulse-subtle">
              <span className="font-black text-lg">M</span>
              {/* Gold overlay badge representing the Hajj Luxury layer */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-masari-gold rounded-tl-md" />
            </div>
            <div className="text-right" style={{ direction: 'rtl' }}>
              <h1 className="text-md md:text-lg font-black text-white font-arabic tracking-tight">
                منصة مساري الرقمية للسفريات والسياحة والحج والعمرة
              </h1>
              <p className="text-[10px] font-mono text-masari-cyan uppercase tracking-wider text-left">
                MASARI COMMERICAL TRAVEL PLATFORM &bull; FOUNDATION PHASE
              </p>
            </div>
          </div>

          {/* Center Header controls: View Mode Selectors (only visible on desktop md+) */}
          <div className="hidden lg:flex bg-slate-900 border border-slate-800 rounded-xl p-1.5 gap-1 text-xs">
            <button
              id="view-mode-both-btn"
              onClick={() => setViewMode('both')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'both' ? 'bg-masari-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass size={14} />
              <span>{lang === 'ar' ? 'عرض الواجهتين' : 'Interactive Split-View'}</span>
            </button>
            <button
              id="view-mode-sim-btn"
              onClick={() => setViewMode('simulator')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'simulator' ? 'bg-masari-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>{lang === 'ar' ? 'المحاكي الهاتفي فقط' : 'Simulator Only'}</span>
            </button>
            <button
              id="view-mode-specs-btn"
              onClick={() => setViewMode('specs')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'specs' ? 'bg-masari-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>{lang === 'ar' ? 'المخطط الهندسي فقط' : 'Architecture Spec Only'}</span>
            </button>
          </div>

          {/* Right Header Controls: Lang Switch & Currency selectors */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Lang dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs">
              <Globe size={13} className="text-masari-cyan" />
              <button
                id="header-lang-toggle"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="text-slate-300 hover:text-white font-bold cursor-pointer font-mono"
              >
                {lang === 'ar' ? 'ENGLISH' : 'العربية'}
              </button>
            </div>

            {/* Currency picker in header */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-[10px] font-mono font-bold">
              {['USD', 'SAR', 'YER'].map((curr) => (
                <button
                  id={`header-currency-${curr}`}
                  key={curr}
                  onClick={() => setCurrency(curr as Currency)}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    currency === curr ? 'bg-masari-blue text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Mobile-only view toggle buttons at the top */}
        <div className="lg:hidden flex bg-slate-950 border border-slate-800 p-1.5 rounded-xl gap-1 text-xs w-full mb-2">
          <button
            id="mobile-view-sim-btn"
            onClick={() => setViewMode('simulator')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'simulator' || viewMode === 'both' ? 'bg-masari-blue text-white' : 'text-slate-400'
            }`}
          >
            <Smartphone size={14} />
            <span>{lang === 'ar' ? 'محاكي التطبيق' : 'Mobile Experience'}</span>
          </button>
          <button
            id="mobile-view-specs-btn"
            onClick={() => setViewMode('specs')}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'specs' ? 'bg-masari-blue text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen size={14} />
            <span>{lang === 'ar' ? 'المخطط الهندسي' : 'Architecture Blueprint'}</span>
          </button>
        </div>

        {/* 1. Device Simulator Section */}
        {(viewMode === 'both' || viewMode === 'simulator') && (
          <div className="flex-1 lg:max-w-[420px] xl:max-w-[460px] flex flex-col h-[820px] shrink-0 mx-auto w-full">
            <DeviceSimulator 
              lang={lang} 
              setLang={setLang} 
              currency={currency} 
              setCurrency={setCurrency} 
            />
          </div>
        )}

        {/* 2. Systems Documentation Section */}
        {(viewMode === 'both' || viewMode === 'specs') && (
          <div className="flex-1 flex flex-col h-[820px] min-w-0">
            <TechHub lang={lang} />
          </div>
        )}

      </main>

      {/* Luxury Enterprise Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-4 text-center shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-masari-cyan" />
            <span className="font-mono">
              &copy; 2026 Masari Agency Platforms Ltd. All Core Architectures Registered.
            </span>
          </div>
          <div className="flex items-center gap-3 font-arabic" style={{ direction: 'rtl' }}>
            <span>الهاتف: +967 1 234 567</span>
            <span>&bull;</span>
            <span>المركز الرئيسي: شارع الجزائر، صنعاء، اليمن</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
