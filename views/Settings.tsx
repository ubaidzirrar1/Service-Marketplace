
import React, { useState, useEffect } from 'react';
import { SettingsService } from '../services/api';

const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1.0,
  'PKR': 278.5,
  'EUR': 0.92,
  'GBP': 0.78
};

const Settings: React.FC = () => {
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [lang, setLang] = useState('English');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const saved = SettingsService.get();
    setLang(saved.language);
    setCurrency(saved.currency);
  }, []);

  const handleUpdateSettings = (newLang: string, newCurrency: string) => {
    setLang(newLang);
    setCurrency(newCurrency);
    SettingsService.update({ language: newLang, currency: newCurrency });
  };

  const basePrice = 500;
  const convertedPrice = (basePrice * EXCHANGE_RATES[currency]).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative pb-24 md:pb-12">
      <header className="mb-14 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">Preferences</h1>
          <p className="text-slate-500 font-bold">Customize your GlobalServ experience.</p>
        </div>
        <button 
          onClick={() => setShowPwaPrompt(true)}
          className="bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-blue-100 transition shadow-sm"
        >
          System Info
        </button>
      </header>

      <div className="space-y-10">
        <div className="bg-white rounded-[56px] p-10 md:p-14 shadow-xl border border-slate-100">
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.837-5.54m.988-3.136a18.016 18.016 0 01-2.43 4.67M6.414 9H15M11 11.5a14.94 14.94 0 01-2.684 5.58m4.37-5.185a14.944 14.944 0 01-2.456 5.12M12 21l-3-3m3 3l3-3"/></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Regional Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Interface Language</label>
              <div className="grid grid-cols-2 gap-3">
                 {['English', 'Urdu', 'Spanish', 'French'].map(l => (
                   <button 
                    key={l}
                    onClick={() => handleUpdateSettings(l, currency)}
                    className={`px-6 py-4 rounded-[20px] font-black text-sm transition-all duration-500 ${lang === l ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Global Currency</label>
              <div className="grid grid-cols-2 gap-3 mb-8">
                 {Object.keys(EXCHANGE_RATES).map(c => (
                   <button 
                    key={c}
                    onClick={() => handleUpdateSettings(lang, c)}
                    className={`px-6 py-4 rounded-[20px] font-black text-sm transition-all duration-500 ${currency === c ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'}`}
                   >
                     {c}
                   </button>
                 ))}
              </div>
              <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-2xl">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Live Conversion Preview</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-500 font-black text-xl">{currency}</span>
                  <span className="text-4xl font-black tracking-tighter">{convertedPrice}</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold uppercase mt-4 tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Real-time rates applied
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[56px] p-10 md:p-14 shadow-xl border border-slate-100">
           <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Trust & Security</h2>
          </div>
          
          <div className="bg-emerald-50/30 p-10 rounded-[40px] border border-emerald-100 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center text-emerald-600 shadow-inner">
               <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            </div>
            <div className="text-center md:text-left flex-grow">
              <h4 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Identity Fully Verified</h4>
              <p className="text-slate-500 font-bold max-w-lg leading-relaxed">Your professional credentials and biometric data are verified. You have maximum visibility in the global marketplace.</p>
            </div>
            <button className="bg-white text-slate-800 px-8 py-4 rounded-[20px] font-black text-sm border-2 border-slate-100 shadow-sm hover:border-blue-200 transition active:scale-95">
              Review Documents
            </button>
          </div>
        </div>
      </div>

      {showPwaPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[3000] flex items-end">
          <div className="w-full bg-white rounded-t-[64px] p-10 md:p-16 animate-slide-up shadow-3xl">
            <div className="w-20 h-2 bg-slate-100 rounded-full mx-auto mb-16"></div>
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
              <div className="w-32 h-32 bg-blue-600 rounded-[40px] flex items-center justify-center text-white text-6xl font-black shadow-3xl shadow-blue-200 rotate-12 transition-transform hover:rotate-0 duration-500">S</div>
              <div className="text-center md:text-left">
                <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Install Local Marketplace</h3>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">Get real-time job notifications within 5km, faster load times, and professional-grade security by installing the app on your home screen.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <button 
                onClick={() => setShowPwaPrompt(false)}
                className="flex-grow py-8 bg-blue-600 text-white rounded-[32px] font-black text-2xl hover:bg-blue-700 transition-all duration-300 shadow-2xl shadow-blue-200 active:scale-95"
              >
                Launch App Instance
              </button>
              <button 
                onClick={() => setShowPwaPrompt(false)}
                className="flex-grow py-8 bg-slate-50 text-slate-400 rounded-[32px] font-black text-xl hover:bg-slate-100 transition-all active:scale-95"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
