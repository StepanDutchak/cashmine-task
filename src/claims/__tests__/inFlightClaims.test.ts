import { describe, expect, it } from '@jest/globals';

import { Claim } from '@/api/schemas';
import { toUnits } from '@/money/amount';
import { AssetBalance } from '@/money/balances';

import { applyInFlightClaims, claimBadgeFor } from '../inFlightClaims';

const SNAPSHOT_AT = '2026-10-20T13:00:00.000Z';
const BEFORE = '2026-10-20T12:59:50.000Z';
const AFTER = '2026-10-20T13:00:05.000Z';
const LATER = '2026-10-20T13:00:20.000Z';

const ETH: AssetBalance = {
  asset: 'ETH',
  decimals: 18,
  usdPrice: '2461.08',
  available: toUnits('2', 18),
  pending: 0n,
  claiming: 0n,
};

const claim = (overrides: Partial<Claim>): Claim => ({
  id: 'clm_1',
  asset: 'ETH',
  amount: '0.5',
  fee: '0.0012',
  receiveAmount: '0.4988',
  destinationId: 'dest_wallet',
  status: 'pending',
  failureReason: null,
  createdAt: AFTER,
  updatedAt: AFTER,
  ...overrides,
});

const apply = (balance: AssetBalance, claims: Claim[]) => applyInFlightClaims(SNAPSHOT_AT, [balance], claims)[0];

describe('applyInFlightClaims', () => {
  it('moves a new pending claim from available to claiming before the snapshot catches up', () => {
    const result = apply(ETH, [claim({})]);
    expect(result.available).toBe(toUnits('1.5', 18));
    expect(result.claiming).toBe(toUnits('0.5', 18));
  });

  it('leaves the snapshot alone once it already counts the claim', () => {
    const counted = { ...ETH, available: toUnits('1.5', 18), claiming: toUnits('0.5', 18) };
    expect(apply(counted, [claim({ createdAt: BEFORE, updatedAt: BEFORE })])).toEqual(counted);
  });

  it('shows the same numbers before and after the snapshot catches up (no jump back)', () => {
    const beforeCatchUp = apply(ETH, [claim({})]);
    const caughtUpSnapshot = { ...ETH, available: toUnits('1.5', 18), claiming: toUnits('0.5', 18) };
    const afterCatchUp = applyInFlightClaims(LATER, [caughtUpSnapshot], [claim({})])[0];
    expect(afterCatchUp).toEqual(beforeCatchUp);
  });

  it('ignores a claim that failed before the snapshot saw it', () => {
    expect(apply(ETH, [claim({ status: 'failed', updatedAt: LATER })])).toEqual(ETH);
  });

  it('subtracts a completed claim the snapshot has not seen', () => {
    const result = apply(ETH, [claim({ status: 'completed', updatedAt: LATER })]);
    expect(result.available).toBe(toUnits('1.5', 18));
    expect(result.claiming).toBe(0n);
  });

  it('returns the amount when a claim the snapshot counted fails afterwards', () => {
    const counted = { ...ETH, available: toUnits('1.5', 18), claiming: toUnits('0.5', 18) };
    const result = apply(counted, [claim({ createdAt: BEFORE, status: 'failed', updatedAt: AFTER })]);
    expect(result.available).toBe(toUnits('2', 18));
    expect(result.claiming).toBe(0n);
  });

  it('clears claiming when a counted claim completes afterwards', () => {
    const counted = { ...ETH, available: toUnits('1.5', 18), claiming: toUnits('0.5', 18) };
    const result = apply(counted, [claim({ createdAt: BEFORE, status: 'completed', updatedAt: AFTER })]);
    expect(result.available).toBe(toUnits('1.5', 18));
    expect(result.claiming).toBe(0n);
  });

  it('only touches the claimed asset', () => {
    const usdt = { ...ETH, asset: 'USDT', decimals: 6, available: toUnits('100', 6) };
    const [, untouched] = applyInFlightClaims(SNAPSHOT_AT, [ETH, usdt], [claim({})]);
    expect(untouched).toEqual(usdt);
  });
});

describe('claimBadgeFor', () => {
  it('shows in progress while a tracked claim is pending', () => {
    expect(claimBadgeFor(ETH, [claim({})])).toBe('inProgress');
  });

  it('shows in progress when the server reports a claiming amount', () => {
    expect(claimBadgeFor({ ...ETH, claiming: 1n }, [])).toBe('inProgress');
  });

  it('shows failed when the latest claim failed', () => {
    expect(claimBadgeFor(ETH, [claim({ status: 'failed' })])).toBe('failed');
  });

  it('shows nothing after a completed claim', () => {
    expect(claimBadgeFor(ETH, [claim({ status: 'completed' })])).toBeNull();
  });
});
