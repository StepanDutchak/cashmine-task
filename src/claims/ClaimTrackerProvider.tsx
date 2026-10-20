import { QueryObserverResult, useQueries, useQueryClient } from '@tanstack/react-query';
import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { Claim } from '@/api/schemas';
import { useToken } from '@/auth/TokenProvider';
import { claimQueryOptions } from '@/hooks/claimQuery';

type ClaimTrackerValue = {
  claims: Claim[];
  track: (claim: Claim) => void;
};

const ClaimTrackerContext = createContext<ClaimTrackerValue | null>(null);

const latestClaims = (results: QueryObserverResult<Claim>[]): Claim[] =>
  results.flatMap((result) => (result.data ? [result.data] : []));

// Claims submitted in this session, kept fresh on every screen until they settle,
// so balances can reflect them before the next server snapshot.
export const ClaimTrackerProvider = ({ children }: { children: ReactNode }) => {
  const token = useToken();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState<Claim[]>([]);

  const track = useCallback((claim: Claim) => {
    setSubmitted((current) => (current.some((item) => item.id === claim.id) ? current : [...current, claim]));
  }, []);

  const claims = useQueries({
    queries: submitted.map((claim) => ({
      ...claimQueryOptions(token, queryClient, claim.id),
      initialData: claim,
    })),
    combine: latestClaims,
  });

  const value = useMemo(() => ({ claims, track }), [claims, track]);
  return <ClaimTrackerContext.Provider value={value}>{children}</ClaimTrackerContext.Provider>;
};

export const useClaimTracker = (): ClaimTrackerValue => {
  const context = useContext(ClaimTrackerContext);
  if (!context) throw new Error('useClaimTracker must be used inside ClaimTrackerProvider');
  return context;
};
