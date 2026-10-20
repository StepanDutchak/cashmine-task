import { describe, expect, it } from '@jest/globals';

import { toUnits } from '../amount';
import { AssetBalance, availableComposition, summarizeBalances } from '../balances';

const balance = (asset: string, decimals: number, usdPrice: string, available: string, pending = '0', claiming = '0') =>
  ({
    asset,
    decimals,
    usdPrice,
    available: toUnits(available, decimals),
    pending: toUnits(pending, decimals),
    claiming: toUnits(claiming, decimals),
  }) satisfies AssetBalance;

// Values from the live API during the task.
const USDT = balance('USDT', 6, '1.0002', '870.533207', '4.75');
const BTC = balance('BTC', 8, '67312.45', '0.01234567', '0.00012');
const ETH = balance('ETH', 18, '2461.08', '12.345678901234591676', '0.02', '0.5');

describe('summarizeBalances', () => {
  it('sums each row rounded to cents, so the rows add up to the total', () => {
    expect(summarizeBalances([USDT, BTC, ETH])).toEqual({
      availableUsdCents: 87071n + 83102n + 3038370n,
      pendingUsdCents: 475n + 808n + 4922n,
      claimingUsdCents: 123054n,
    });
  });

  it('is zero for no balances', () => {
    expect(summarizeBalances([])).toEqual({ availableUsdCents: 0n, pendingUsdCents: 0n, claimingUsdCents: 0n });
  });
});

describe('availableComposition', () => {
  it('orders assets by available USD and drops empty ones', () => {
    const empty = balance('SOL', 9, '150', '0');
    expect(availableComposition([USDT, empty, BTC, ETH]).map((share) => share.asset)).toEqual(['ETH', 'USDT', 'BTC']);
  });
});
