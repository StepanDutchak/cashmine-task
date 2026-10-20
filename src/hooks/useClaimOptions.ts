import { useQuery } from '@tanstack/react-query';

import { fetchClaimOptions } from '@/api/endpoints';
import { queryKeys } from '@/api/queryKeys';
import { useToken } from '@/auth/TokenProvider';

export const useClaimOptions = (asset: string) => {
  const token = useToken();
  return useQuery({
    queryKey: queryKeys.claimOptions(asset),
    queryFn: () => fetchClaimOptions(token, asset),
  });
};
