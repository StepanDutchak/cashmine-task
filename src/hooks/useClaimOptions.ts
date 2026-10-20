import { useQuery } from '@tanstack/react-query';

import { fetchClaimOptions } from '@/api/endpoints';
import { useToken } from '@/auth/TokenProvider';

export const useClaimOptions = (asset: string) => {
  const token = useToken();
  return useQuery({
    queryKey: ['claimOptions', asset],
    queryFn: () => fetchClaimOptions(token, asset),
  });
};
