import { describe, expect, it } from '@jest/globals';

import { ApiError } from '@/api/errors';

import { toSubmissionState } from '../submissionState';

const failed = (error: unknown) => ({ isPending: false, isError: true, failureCount: 1, error });

describe('toSubmissionState', () => {
  it('reports submitting on the first try and checking while retrying', () => {
    expect(toSubmissionState({ isPending: true, isError: false, failureCount: 0, error: null })).toEqual({
      kind: 'submitting',
    });
    expect(toSubmissionState({ isPending: true, isError: false, failureCount: 2, error: null })).toEqual({
      kind: 'checking',
    });
  });

  it.each([
    ['a timeout', new ApiError({ kind: 'timeout', message: 'Request timed out' })],
    ['a network error', new ApiError({ kind: 'network', message: 'Network error' })],
    ['a 504', new ApiError({ kind: 'http', status: 504, code: 'TIMEOUT', message: 'Timed out' })],
    ['a final 429 after retries', new ApiError({ kind: 'http', status: 429, code: 'RATE_LIMITED', message: 'Slow down' })],
  ])('treats %s as unknown, so only a same-key re-check is offered', (_, error) => {
    expect(toSubmissionState(failed(error))).toEqual({ kind: 'unknown' });
  });

  it('treats a validation error as definitely not created', () => {
    const error = new ApiError({ kind: 'http', status: 400, code: 'VALIDATION', message: 'amount exceeds available' });
    expect(toSubmissionState(failed(error))).toEqual({ kind: 'rejected', message: 'amount exceeds available' });
  });
});
