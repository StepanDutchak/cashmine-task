import { useEffect, useState } from 'react';

const DEFAULT_TICK_MS = 1000;

export const useNow = (tickMs: number = DEFAULT_TICK_MS): number => {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(intervalId);
  }, [tickMs]);

  return now;
};
