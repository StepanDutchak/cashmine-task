import { describeApiError, mayHaveCreatedClaim } from '@/api/errors';

export type SubmissionState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'checking' }
  | { kind: 'unknown' }
  | { kind: 'rejected'; message: string };

type MutationSnapshot = {
  isPending: boolean;
  isError: boolean;
  failureCount: number;
  error: unknown;
};

// "checking" = the first try got no clear answer and we are resending the same attempt.
export const toSubmissionState = (mutation: MutationSnapshot): SubmissionState => {
  if (mutation.isPending) return mutation.failureCount > 0 ? { kind: 'checking' } : { kind: 'submitting' };
  if (!mutation.isError) return { kind: 'idle' };
  if (mayHaveCreatedClaim(mutation.error)) return { kind: 'unknown' };
  return { kind: 'rejected', message: describeApiError(mutation.error) };
};
