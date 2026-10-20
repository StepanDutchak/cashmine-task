import { describe, expect, it } from '@jest/globals';
import { toUnits } from '../amount';
import { ClaimRules, canClaimAnything, validateClaimAmount } from '../claimAmount';

const ETH_RULES: ClaimRules = {
  decimals: 18,
  minAmount: toUnits('0.01', 18),
  fee: toUnits('0.0012', 18),
  available: toUnits('0.75', 18),
};

describe('validateClaimAmount', () => {
  it('returns fee and receive amount for a valid claim', () => {
    const result = validateClaimAmount('0.5', ETH_RULES);
    expect(result).toEqual({
      ok: true,
      amountText: '0.5',
      quote: {
        amount: toUnits('0.5', 18),
        fee: toUnits('0.0012', 18),
        receive: toUnits('0.4988', 18),
      },
    });
  });

  it('accepts exactly the minimum and exactly the available amount', () => {
    expect(validateClaimAmount('0.01', ETH_RULES).ok).toBe(true);
    expect(validateClaimAmount('0.75', ETH_RULES).ok).toBe(true);
  });

  it('normalizes the input it sends', () => {
    const result = validateClaimAmount(' 0,50 ', ETH_RULES);
    expect(result.ok && result.amountText).toBe('0.5');
  });

  it.each([
    ['', 'EMPTY'],
    ['.5', 'FORMAT'],
    ['0.0000000000000000001', 'TOO_MANY_DECIMALS'],
    ['0.009', 'BELOW_MIN'],
    ['0.750000000000000001', 'ABOVE_AVAILABLE'],
  ])('rejects %p with %s', (input, error) => {
    expect(validateClaimAmount(input, ETH_RULES)).toEqual({ ok: false, error });
  });

  it('rejects an amount that does not cover the fee', () => {
    const rules = { ...ETH_RULES, minAmount: toUnits('0.001', 18) };
    expect(validateClaimAmount('0.0012', rules)).toEqual({ ok: false, error: 'NOTHING_TO_RECEIVE' });
  });
});

describe('canClaimAnything', () => {
  it('is false when available is below the minimum', () => {
    expect(canClaimAnything({ ...ETH_RULES, available: toUnits('0.005', 18) })).toBe(false);
  });

  it('is true when available covers minimum and fee', () => {
    expect(canClaimAnything(ETH_RULES)).toBe(true);
  });
});
