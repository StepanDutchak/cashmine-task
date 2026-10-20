import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchClaim } from '@/api/endpoints';
import { useToken } from '@/auth/TokenProvider';

import { balancesQueryKey } from './useBalances';
import { claimQueryKey } from './useSubmitClaim';

const POLL_INTERVAL_MS = 2000;

export const useClaim = (claimId: string) => {
  const token = useToken();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: claimQueryKey(claimId),
    queryFn: async () => {
      const claim = await fetchClaim(token, claimId);
      if (claim.status !== 'pending') queryClient.invalidateQueries({ queryKey: balancesQueryKey });
      return claim;
    },
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? POLL_INTERVAL_MS : false),
    staleTime: 0,
  });
};
