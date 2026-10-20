import { useCallback, useState } from 'react';

// Tracks only user-triggered refreshes, so background polling doesn't flash a spinner.
export const useManualRefresh = (refetch: () => Promise<unknown>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return { isRefreshing, refresh };
};
