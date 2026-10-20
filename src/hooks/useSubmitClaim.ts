import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createClaim } from '@/api/endpoints';
import { isOutcomeUnknown, isRetryable } from '@/api/errors';
import { queryKeys } from '@/api/queryKeys';
import { retryDelayFor } from '@/api/queryClient';
import { Claim } from '@/api/schemas';
import { useToken } from '@/auth/TokenProvider';
import { ClaimAttempt, clearUnresolvedAttempt, saveUnresolvedAttempt } from '@/claims/claimAttempt';
import { useClaimTracker } from '@/claims/ClaimTrackerProvider';

const MAX_AUTOMATIC_RETRIES = 4;

// Retries reuse the same attempt (same Idempotency-Key + body), so they are safe:
// the server replays the original claim instead of creating a second one.
export const useSubmitClaim = (onSubmitted: (claim: Claim) => void) => {
  const token = useToken();
  const queryClient = useQueryClient();
  const { track } = useClaimTracker();

  return useMutation({
    mutationFn: (attempt: ClaimAttempt) => {
      saveUnresolvedAttempt(attempt);
      return createClaim(token, attempt.body, attempt.idempotencyKey);
    },
    retry: (failureCount, error) => isRetryable(error) && failureCount < MAX_AUTOMATIC_RETRIES,
    retryDelay: retryDelayFor,
    onSuccess: (claim, attempt) => {
      clearUnresolvedAttempt(attempt.body.asset);
      queryClient.setQueryData(queryKeys.claim(claim.id), claim);
      track(claim);
      queryClient.invalidateQueries({ queryKey: queryKeys.activity });
      onSubmitted(claim);
    },
    onError: (error, attempt) => {
      // Keep the attempt while the outcome is unknown; otherwise the claim was definitely not created.
      if (isOutcomeUnknown(error)) return;
      clearUnresolvedAttempt(attempt.body.asset);
      // A rejection (e.g. amount above the live available) usually means our snapshot is behind.
      queryClient.invalidateQueries({ queryKey: queryKeys.balances });
    },
  });
};
