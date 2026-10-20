// Amounts travel as decimal strings (API contract) and are computed as bigint
// counts of the asset's smallest unit, so no float ever touches money.

const DECIMAL_PATTERN = /^(0|[1-9]\d*)(\.\d+)?$/;
const CENTS_PER_DOLLAR = 100n;

export type AmountParseError = 'EMPTY' | 'FORMAT' | 'TOO_MANY_DECIMALS';

export type AmountParseResult =
  | { ok: true; units: bigint }
  | { ok: false; error: AmountParseError };

type ScaledDecimal = { digits: bigint; scale: number };

const pow10 = (exponent: number): bigint => 10n ** BigInt(exponent);

const parseDecimal = (value: string): ScaledDecimal | null => {
  if (!DECIMAL_PATTERN.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  return { digits: BigInt(whole + fraction), scale: fraction.length };
};

export const normalizeAmountInput = (raw: string): string => raw.trim().replace(',', '.');

export const parseAmount = (value: string, decimals: number): AmountParseResult => {
  if (value === '') return { ok: false, error: 'EMPTY' };
  const parsed = parseDecimal(value);
  if (!parsed) return { ok: false, error: 'FORMAT' };
  if (parsed.scale > decimals) return { ok: false, error: 'TOO_MANY_DECIMALS' };
  return { ok: true, units: parsed.digits * pow10(decimals - parsed.scale) };
};

// For amounts the server sends us: a malformed value is a contract violation, not user error.
export const toUnits = (value: string, decimals: number): bigint => {
  const result = parseAmount(value, decimals);
  if (!result.ok) throw new Error(`Invalid amount "${value}" for ${decimals} decimals`);
  return result.units;
};

export const formatUnits = (units: bigint, decimals: number): string => {
  const isNegative = units < 0n;
  const absolute = isNegative ? -units : units;
  const scale = pow10(decimals);
  const whole = (absolute / scale).toString();
  const fraction = (absolute % scale).toString().padStart(decimals, '0').replace(/0+$/, '');
  const body = fraction ? `${whole}.${fraction}` : whole;
  return isNegative ? `-${body}` : body;
};

// Rounds half up to whole cents.
export const toUsdCents = (units: bigint, decimals: number, usdPrice: string): bigint => {
  const price = parseDecimal(usdPrice);
  if (!price) throw new Error(`Invalid USD price "${usdPrice}"`);
  const divisor = pow10(decimals + price.scale);
  const scaledCents = units * price.digits * CENTS_PER_DOLLAR;
  return (scaledCents + divisor / 2n) / divisor;
};
