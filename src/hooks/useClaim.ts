import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useToken } from '@/auth/TokenProvider';

import { claimQueryOptions } from './claimQuery';

export const useClaim = (claimId: string) => {
  const token = useToken();
  const queryClient = useQueryClient();
  return useQuery(claimQueryOptions(token, queryClient, claimId));
};
