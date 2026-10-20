import { useQuery } from '@tanstack/react-query';

import { fetchBalances } from '@/api/endpoints';
import { BalancesResponse } from '@/api/schemas';
import { useToken } from '@/auth/TokenProvider';
import { AssetBalance, toAssetBalance } from '@/money/balances';

// The server recomputes snapshots every 15 s; polling faster would only repeat the same data.
const SNAPSHOT_INTERVAL_MS = 15_000;

export const balancesQueryKey = ['balances'] as const;

export type BalancesSnapshot = {
  asOf: string;
  balances: AssetBalance[];
};

// Converting inside `select` turns a malformed server amount into a query error, not a crash.
const toSnapshot = (response: BalancesResponse): BalancesSnapshot => ({
  asOf: response.asOf,
  balances: response.items.map(toAssetBalance),
});

export const useBalances = () => {
  const token = useToken();
  return useQuery({
    queryKey: balancesQueryKey,
    queryFn: () => fetchBalances(token),
    select: toSnapshot,
    refetchInterval: SNAPSHOT_INTERVAL_MS,
  });
};
