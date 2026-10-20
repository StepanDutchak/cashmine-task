const CENTS_PER_DOLLAR = 100n;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const JUST_NOW_SECONDS = 5;

// Adds thousands separators to the whole part of a decimal string, keeping every digit.
export const groupDigits = (value: string): string => {
  const isNegative = value.startsWith('-');
  const [whole, fraction] = (isNegative ? value.slice(1) : value).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = fraction === undefined ? grouped : `${grouped}.${fraction}`;
  return isNegative ? `-${body}` : body;
};

export const formatUsdCents = (cents: bigint): string => {
  const dollars = (cents / CENTS_PER_DOLLAR).toString();
  const remainder = (cents % CENTS_PER_DOLLAR).toString().padStart(2, '0');
  return `$${groupDigits(dollars)}.${remainder}`;
};

export const secondsSince = (isoTimestamp: string, nowMs: number): number =>
  Math.max(0, Math.floor((nowMs - Date.parse(isoTimestamp)) / MS_PER_SECOND));

export const formatAge = (isoTimestamp: string, nowMs: number): string => {
  const seconds = secondsSince(isoTimestamp, nowMs);
  if (seconds < JUST_NOW_SECONDS) return 'just now';
  if (seconds < SECONDS_PER_MINUTE) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  if (minutes < MINUTES_PER_HOUR) return `${minutes} min ago`;
  return `${Math.floor(minutes / MINUTES_PER_HOUR)} h ago`;
};
