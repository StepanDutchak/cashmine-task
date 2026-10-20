import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { isRetryable, isUnauthorized } from './errors';
import { ApiError } from './errors';

const MAX_QUERY_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 8000;
const DEFAULT_STALE_TIME_MS = 10_000;

export const retryDelayFor = (attempt: number, error: unknown): number => {
  if (error instanceof ApiError && error.retryAfterMs !== null) return error.retryAfterMs;
  return Math.min(BASE_RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
};

export const createQueryClient = (onUnauthorized: () => void): QueryClient => {
  const handleError = (error: unknown) => {
    if (isUnauthorized(error)) onUnauthorized();
  };
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        retry: (failureCount, error) => isRetryable(error) && failureCount < MAX_QUERY_RETRIES,
        retryDelay: retryDelayFor,
      },
    },
  });
};
