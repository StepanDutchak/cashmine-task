import { AmountParseError, formatUnits, normalizeAmountInput, parseAmount } from './amount';

export type ClaimRules = {
  decimals: number;
  minAmount: bigint;
  fee: bigint;
  available: bigint;
};

export type ClaimQuote = {
  amount: bigint;
  fee: bigint;
  receive: bigint;
};

export type ClaimAmountError =
  | AmountParseError
  | 'BELOW_MIN'
  | 'ABOVE_AVAILABLE'
  | 'NOTHING_TO_RECEIVE';

export type ClaimAmountResult =
  | { ok: true; quote: ClaimQuote; amountText: string }
  | { ok: false; error: ClaimAmountError };

// The fee is taken from the claimed amount: the user receives amount minus fee.
export const quoteClaim = (amount: bigint, fee: bigint): ClaimQuote => ({
  amount,
  fee,
  receive: amount - fee,
});

export const validateClaimAmount = (rawInput: string, rules: ClaimRules): ClaimAmountResult => {
  const parsed = parseAmount(normalizeAmountInput(rawInput), rules.decimals);
  if (!parsed.ok) return parsed;

  const amount = parsed.units;
  if (amount < rules.minAmount) return { ok: false, error: 'BELOW_MIN' };
  if (amount > rules.available) return { ok: false, error: 'ABOVE_AVAILABLE' };

  const quote = quoteClaim(amount, rules.fee);
  if (quote.receive <= 0n) return { ok: false, error: 'NOTHING_TO_RECEIVE' };

  return { ok: true, quote, amountText: formatUnits(amount, rules.decimals) };
};

export const canClaimAnything = (rules: ClaimRules): boolean =>
  rules.available >= rules.minAmount && rules.available > rules.fee;

export const describeClaimAmountError = (
  error: ClaimAmountError,
  rules: ClaimRules,
  asset: string,
): string => {
  switch (error) {
    case 'EMPTY':
      return 'Enter an amount.';
    case 'FORMAT':
      return 'Use digits and one dot, like 0.5.';
    case 'TOO_MANY_DECIMALS':
      return `${asset} allows at most ${rules.decimals} decimal places.`;
    case 'BELOW_MIN':
      return `The minimum claim is ${formatUnits(rules.minAmount, rules.decimals)} ${asset}.`;
    case 'ABOVE_AVAILABLE':
      return `You have ${formatUnits(rules.available, rules.decimals)} ${asset} available.`;
    case 'NOTHING_TO_RECEIVE':
      return `The amount must be more than the ${formatUnits(rules.fee, rules.decimals)} ${asset} fee.`;
  }
};
