import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchActivity } from '@/api/endpoints';
import { queryKeys } from '@/api/queryKeys';
import { useToken } from '@/auth/TokenProvider';

export const useActivity = () => {
  const token = useToken();
  return useInfiniteQuery({
    queryKey: queryKeys.activity,
    queryFn: ({ pageParam }) => fetchActivity(token, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // Ids are unique, but a page boundary can shift while new items arrive: dedupe on read.
    select: (data) => {
      const seen = new Set<string>();
      return data.pages
        .flatMap((page) => page.items)
        .filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)));
    },
  });
};
