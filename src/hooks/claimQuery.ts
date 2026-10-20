import { QueryClient, queryOptions } from '@tanstack/react-query';

import { fetchClaim } from '@/api/endpoints';
import { queryKeys } from '@/api/queryKeys';

const POLL_INTERVAL_MS = 2000;

// Polls a claim until it settles; settling changes balances and activity, so refresh both.
export const claimQueryOptions = (token: string, queryClient: QueryClient, claimId: string) =>
  queryOptions({
    queryKey: queryKeys.claim(claimId),
    queryFn: async () => {
      const claim = await fetchClaim(token, claimId);
      if (claim.status !== 'pending') {
        queryClient.invalidateQueries({ queryKey: queryKeys.balances });
        queryClient.invalidateQueries({ queryKey: queryKeys.activity });
      }
      return claim;
    },
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? POLL_INTERVAL_MS : false),
    staleTime: 0,
  });
