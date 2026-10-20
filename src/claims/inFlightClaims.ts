import { Claim } from '@/api/schemas';
import { toUnits } from '@/money/amount';
import { AssetBalance } from '@/money/balances';

// Balance after a claim: the server snapshot (recomputed every 15 s) plus the claims we
// submitted that the snapshot has not caught up with yet. The number moves once, when the
// claim is made, and never jumps back when a stale snapshot arrives. All comparisons use
// server timestamps (asOf, createdAt, updatedAt), so the device clock never matters.

type Delta = { available: bigint; claiming: bigint };

const NO_CHANGE: Delta = { available: 0n, claiming: 0n };

export const claimDelta = (claim: Claim, asOf: string, units: bigint): Delta => {
  const snapshotTime = Date.parse(asOf);
  const isCountedBySnapshot = Date.parse(claim.createdAt) <= snapshotTime;

  if (!isCountedBySnapshot) {
    if (claim.status === 'pending') return { available: -units, claiming: units };
    if (claim.status === 'completed') return { available: -units, claiming: 0n };
    return NO_CHANGE; // Failed before the snapshot saw it: the amount is back, net zero.
  }

  const settledAfterSnapshot = claim.status !== 'pending' && Date.parse(claim.updatedAt) > snapshotTime;
  if (!settledAfterSnapshot) return NO_CHANGE;

  // The snapshot still shows it as claiming.
  return claim.status === 'failed' ? { available: units, claiming: -units } : { available: 0n, claiming: -units };
};

const clampToZero = (value: bigint): bigint => (value < 0n ? 0n : value);

export const applyInFlightClaims = (asOf: string, balances: AssetBalance[], claims: Claim[]): AssetBalance[] =>
  balances.map((balance) => {
    const delta = claims
      .filter((claim) => claim.asset === balance.asset)
      .map((claim) => claimDelta(claim, asOf, toUnits(claim.amount, balance.decimals)))
      .reduce(
        (sum, next) => ({ available: sum.available + next.available, claiming: sum.claiming + next.claiming }),
        NO_CHANGE,
      );
    if (delta === NO_CHANGE) return balance;
    return {
      ...balance,
      available: clampToZero(balance.available + delta.available),
      claiming: clampToZero(balance.claiming + delta.claiming),
    };
  });

export type ClaimBadge = 'inProgress' | 'failed' | null;

export const claimBadgeFor = (balance: AssetBalance, claims: Claim[]): ClaimBadge => {
  const ownClaims = claims.filter((claim) => claim.asset === balance.asset);
  if (balance.claiming > 0n || ownClaims.some((claim) => claim.status === 'pending')) return 'inProgress';
  const latest = ownClaims.reduce<Claim | null>(
    (newest, claim) => (!newest || Date.parse(claim.createdAt) > Date.parse(newest.createdAt) ? claim : newest),
    null,
  );
  return latest?.status === 'failed' ? 'failed' : null;
};
