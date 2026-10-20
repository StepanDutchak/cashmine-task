import { describe, expect, it } from '@jest/globals';
import { formatUnits, normalizeAmountInput, parseAmount, toUnits, toUsdCents } from '../amount';

describe('parseAmount', () => {
  it.each([
    ['0.5', 18, 500000000000000000n],
    ['12', 6, 12000000n],
    ['0.000001', 6, 1n],
    ['820.413207', 6, 820413207n],
    ['0', 8, 0n],
    ['5', 0, 5n],
  ])('parses %s with %i decimals', (value, decimals, expected) => {
    expect(parseAmount(value, decimals)).toEqual({ ok: true, units: expected });
  });

  it.each(['.5', '1.', '05', '1e-3', '-1', '1.2.3', 'abc', ' 1', '1,5'])(
    'rejects malformed %s',
    (value) => {
      expect(parseAmount(value, 8)).toEqual({ ok: false, error: 'FORMAT' });
    },
  );

  it('rejects empty input', () => {
    expect(parseAmount('', 8)).toEqual({ ok: false, error: 'EMPTY' });
  });

  it('rejects more decimals than the asset allows', () => {
    expect(parseAmount('0.0000001', 6)).toEqual({ ok: false, error: 'TOO_MANY_DECIMALS' });
  });

  it('stays exact where floats would drift', () => {
    const sum = toUnits('0.1', 18) + toUnits('0.2', 18);
    expect(formatUnits(sum, 18)).toBe('0.3');
  });
});

describe('normalizeAmountInput', () => {
  it('trims and accepts a comma as decimal separator', () => {
    expect(normalizeAmountInput(' 0,5 ')).toBe('0.5');
  });
});

describe('toUnits', () => {
  it('throws on malformed server values', () => {
    expect(() => toUnits('1e-3', 8)).toThrow();
  });
});

describe('formatUnits', () => {
  it.each([
    [500000000000000000n, 18, '0.5'],
    [12000000n, 6, '12'],
    [1n, 6, '0.000001'],
    [0n, 6, '0'],
    [-50000000n, 8, '-0.5'],
    [7n, 0, '7'],
  ])('formats %s with %i decimals as %s', (units, decimals, expected) => {
    expect(formatUnits(units, decimals)).toBe(expected);
  });

  it('round-trips through parseAmount', () => {
    expect(formatUnits(toUnits('820.413207', 6), 6)).toBe('820.413207');
  });
});

describe('toUsdCents', () => {
  it('multiplies amount by price exactly', () => {
    expect(toUsdCents(toUnits('820.413207', 6), 6, '1.0002')).toBe(82058n);
  });

  it('rounds half up to cents', () => {
    expect(toUsdCents(toUnits('0.005', 6), 6, '1')).toBe(1n);
    expect(toUsdCents(toUnits('0.0049', 6), 6, '1')).toBe(0n);
  });

  it('handles high-decimal assets', () => {
    expect(toUsdCents(toUnits('0.5', 18), 18, '3120.55')).toBe(156028n);
  });
});
