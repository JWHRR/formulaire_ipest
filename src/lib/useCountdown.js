import { useEffect, useState } from 'react';
import { timeRemaining } from './countdown.js';

/** Compte à rebours mis à jour chaque seconde jusqu'à `deadlineIso`. */
export function useCountdown(deadlineIso) {
  const deadline = new Date(deadlineIso).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (now >= deadline) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline, now >= deadline]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = timeRemaining(deadline, now);
  return { ...remaining, closed: remaining.total === 0 };
}
