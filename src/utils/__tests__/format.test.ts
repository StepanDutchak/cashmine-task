import { describe, expect, it } from '@jest/globals';

import { formatUsdCents, groupDigits, splitPrecisionDigits } from '../format';

describe('groupDigits', () => {
  it('groups the whole part and keeps every fraction digit', () => {
    expect(groupDigits('1234567.000001')).toBe('1,234,567.000001');
    expect(groupDigits('-1234.5')).toBe('-1,234.5');
  });
});

describe('splitPrecisionDigits', () => {
  it('splits after the visible decimals without losing digits', () => {
    expect(splitPrecisionDigits('12.345678901234591676', 6)).toEqual({ head: '12.345678', tail: '901234591676' });
  });

  it('leaves short amounts whole', () => {
    expect(splitPrecisionDigits('0.5', 6)).toEqual({ head: '0.5', tail: '' });
    expect(splitPrecisionDigits('1,000', 6)).toEqual({ head: '1,000', tail: '' });
  });
});

describe('formatUsdCents', () => {
  it('formats cents as dollars', () => {
    expect(formatUsdCents(3208543n)).toBe('$32,085.43');
    expect(formatUsdCents(5n)).toBe('$0.05');
  });
});
