'use client';

import { useEffect, useState } from 'react';

interface EventTimerProps {
  expiresAt: string; // ISO String (ex: "2026-08-25T23:59:59Z")
}

export function EventTimer({ expiresAt }: EventTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    function calculateTime() {
      const difference = +new Date(expiresAt) - +new Date();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Expired / Encerrado
      </span>
    );
  }

  // Se faltar menos de 24h, mostra alerta em tom vermelho/laranja
  const isUrgent = timeLeft.days === 0;

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
        isUrgent
          ? 'bg-amber-100 text-amber-800 animate-pulse dark:bg-amber-900/40 dark:text-amber-300'
          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
      }`}
    >
      <span>⏳</span>
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:
        {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
}