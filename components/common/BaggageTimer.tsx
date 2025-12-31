
import React, { useState, useEffect } from 'react';

interface BaggageTimerProps {
  startTime: string; // ISO String
  limitHours?: number;
}

const BaggageTimer: React.FC<BaggageTimerProps> = ({ startTime, limitHours = 24 }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    const calculate = () => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    };

    calculate();
    const interval = setInterval(calculate, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  
  const isExpired = hours >= limitHours;
  const isWarning = hours >= limitHours * 0.75; // 18 ساعة في حال كانت المهلة 24

  let colorClass = "bg-green-500/10 text-green-400 border-green-500/20";
  let statusText = "مدة البقاء: ";

  if (isExpired) {
    colorClass = "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]";
    statusText = "تجاوزت المهلة (SLA Breach): ";
  } else if (isWarning) {
    colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/40 animate-bounce shadow-[0_0_10px_rgba(234,179,8,0.2)]";
    statusText = "إنذار مبكر (خطر شكوى): ";
  }

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-tighter transition-all duration-500 ${colorClass}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 ${isWarning || isExpired ? 'animate-spin-slow' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {statusText}
        {hours}س {minutes}د
      </span>
    </div>
  );
};

export default BaggageTimer;
