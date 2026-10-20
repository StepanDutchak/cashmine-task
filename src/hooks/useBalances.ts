import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetchBalances } from '@/api/endpoints';
import { queryKeys } from '@/api/queryKeys';
import { BalancesResponse } from '@/api/schemas';
import { useToken } from '@/auth/TokenProvider';
import { useClaimTracker } from '@/claims/ClaimTrackerProvider';
import { applyInFlightClaims } from '@/claims/inFlightClaims';
import { AssetBalance, toAssetBalance } from '@/money/balances';

// The server recomputes snapshots every 15 s; polling faster would only repeat the same data.
const SNAPSHOT_INTERVAL_MS = 15_000;

export type BalancesSnapshot = {
  asOf: string;
  balances: AssetBalance[];
};

// Balances as the user should see them: the server snapshot plus our claims it hasn't counted yet.
// Converting inside `select` also turns a malformed server amount into a query error, not a crash.
export const useBalances = () => {
  const token = useToken();
  const { claims } = useClaimTracker();

  const select = useCallback(
    (response: BalancesResponse): BalancesSnapshot => ({
      asOf: response.asOf,
      balances: applyInFlightClaims(response.asOf, response.items.map(toAssetBalance), claims),
    }),
    [claims],
  );

  return useQuery({
    queryKey: queryKeys.balances,
    queryFn: () => fetchBalances(token),
    select,
    refetchInterval: SNAPSHOT_INTERVAL_MS,
  });
};
