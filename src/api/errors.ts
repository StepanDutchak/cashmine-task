export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'bad_response';

type ApiErrorInit = {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  field?: string;
  retryAfterMs?: number;
};

const HTTP_UNAUTHORIZED = 401;
const HTTP_RATE_LIMITED = 429;
const HTTP_SERVER_ERROR_MIN = 500;

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly code: string | null;
  readonly field: string | null;
  readonly retryAfterMs: number | null;

  constructor(init: ApiErrorInit) {
    super(init.message);
    this.name = 'ApiError';
    this.kind = init.kind;
    this.status = init.status ?? null;
    this.code = init.code ?? null;
    this.field = init.field ?? null;
    this.retryAfterMs = init.retryAfterMs ?? null;
  }
}

const isServerError = (error: ApiError): boolean =>
  error.status !== null && error.status >= HTTP_SERVER_ERROR_MIN;

export const isUnauthorized = (error: unknown): boolean =>
  error instanceof ApiError && error.status === HTTP_UNAUTHORIZED;

export const isRateLimited = (error: unknown): boolean =>
  error instanceof ApiError && error.status === HTTP_RATE_LIMITED;

// Worth retrying the same request: transient failures and rate limits.
export const isRetryable = (error: unknown): boolean =>
  error instanceof ApiError &&
  (error.kind === 'network' || error.kind === 'timeout' || isRateLimited(error) || isServerError(error));

// For a POST: did the server possibly act on it even though we got no answer?
export const isOutcomeUnknown = (error: unknown): boolean =>
  error instanceof ApiError &&
  (error.kind === 'network' || error.kind === 'timeout' || isServerError(error));

export const describeApiError = (error: unknown): string => {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';
  if (error.kind === 'network') return "Can't reach CashMine. Check your connection and try again.";
  if (error.kind === 'timeout') return 'The server took too long to respond. Please try again.';
  if (error.kind === 'bad_response') return 'The server sent data we did not expect. Please try again later.';
  if (isUnauthorized(error)) return 'Your token was rejected or has expired.';
  if (isRateLimited(error)) return 'Too many requests. Please wait a few seconds and try again.';
  if (isServerError(error)) return 'The server is having trouble right now. Please try again.';
  return error.message;
};
