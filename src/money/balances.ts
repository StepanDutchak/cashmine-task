import { Balance } from '@/api/schemas';

import { toUnits, toUsdCents } from './amount';

export type AssetBalance = {
  asset: string;
  decimals: number;
  usdPrice: string;
  available: bigint;
  pending: bigint;
  claiming: bigint;
};

export type BalanceTotals = {
  availableUsdCents: bigint;
  pendingUsdCents: bigint;
  claimingUsdCents: bigint;
};

export const toAssetBalance = (balance: Balance): AssetBalance => ({
  asset: balance.asset,
  decimals: balance.decimals,
  usdPrice: balance.usdPrice,
  available: toUnits(balance.available, balance.decimals),
  pending: toUnits(balance.pending, balance.decimals),
  claiming: toUnits(balance.claiming, balance.decimals),
});

export const usdCentsOf = (balance: AssetBalance, units: bigint): bigint =>
  toUsdCents(units, balance.decimals, balance.usdPrice);

export type AssetShare = { asset: string; usdCents: bigint };

// How the available USD total splits across assets, largest first; empty assets are left out.
export const availableComposition = (balances: AssetBalance[]): AssetShare[] =>
  balances
    .map((balance) => ({ asset: balance.asset, usdCents: usdCentsOf(balance, balance.available) }))
    .filter((share) => share.usdCents > 0n)
    .sort((left, right) => (right.usdCents > left.usdCents ? 1 : right.usdCents < left.usdCents ? -1 : 0));

// Totals are the sum of each row's rounded cents, so the visible rows add up to the total.
export const summarizeBalances = (balances: AssetBalance[]): BalanceTotals =>
  balances.reduce<BalanceTotals>(
    (totals, balance) => ({
      availableUsdCents: totals.availableUsdCents + usdCentsOf(balance, balance.available),
      pendingUsdCents: totals.pendingUsdCents + usdCentsOf(balance, balance.pending),
      claimingUsdCents: totals.claimingUsdCents + usdCentsOf(balance, balance.claiming),
    }),
    { availableUsdCents: 0n, pendingUsdCents: 0n, claimingUsdCents: 0n },
  );
