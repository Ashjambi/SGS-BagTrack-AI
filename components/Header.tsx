
import React, { useContext, useEffect, useState } from 'react';
import { View } from '../types';
import { VIEW } from '../constants';
import { SettingsContext } from '../contexts/SettingsContext';
import { isAiReady } from '../services/geminiService';

interface HeaderProps {
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentView }) => {
  const settingsContext = useContext(SettingsContext);
  const [aiStatus, setAiStatus] = useState<'connected' | 'checking'>('checking');

  useEffect(() => {
      const check = async () => {
          const ready = await isAiReady();
          setAiStatus(ready ? 'connected' : 'checking');
      };
      check();
      const interval = setInterval(check, 10000); // Re-check periodically
      return () => clearInterval(interval);
  }, []);

  const logoUrl = settingsContext?.logoUrl;

  return (
    <header className="bg-brand-dark/95 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-brand-green/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-24">
          <button
            onClick={() => setCurrentView(VIEW.PASSENGER)}
            className="flex items-center space-x-4 space-x-reverse text-start group transition-transform active:scale-95"
            aria-label="العودة للمبادرة"
          >
            <div className="relative">
                <div className={`flex items-center justify-center transition-all ${logoUrl ? 'w-auto h-16' : 'w-10 h-10'}`}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Company Logo" className="h-14 w-auto object-contain" />
                    ) : (
                        <div className="w-10 h-10"></div>
                    )}
                </div>
                {/* حالة الربط بالذكاء الاصطناعي - نقطة صغيرة فقط */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-brand-dark shadow-[0_0_8px_rgba(52,211,153,1)] ${aiStatus === 'connected' ? 'bg-brand-green animate-pulse' : 'bg-yellow-500 animate-bounce'}`}></div>
            </div>
            <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none">نظام تتبع الأمتعة</h1>
                <p className="text-[11px] font-bold text-brand-green mt-1 opacity-90">مقدمة من الشركة السعودية للخدمات الأرضية</p>
            </div>
          </button>
          
          <div className="flex items-center gap-8">
              <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-6 mr-6">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Operational Status</span>
                  <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${aiStatus === 'connected' ? 'bg-brand-green animate-pulse' : 'bg-yellow-500'}`}></span>
                      <span className={`text-xs font-bold ${aiStatus === 'connected' ? 'text-brand-green' : 'text-yellow-500'}`}>
                          {aiStatus === 'connected' ? 'Secure AI Engine Active' : 'Waiting for AI Link'}
                      </span>
                  </div>
              </div>
              
              <div className="flex gap-4">
                  <button 
                    onClick={() => setCurrentView(VIEW.PASSENGER)} 
                    className="px-5 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-green transition-colors"
                  >
                    Home
                  </button>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
