import { randomUUID } from 'expo-crypto';

import { CreateClaimBody } from '@/api/endpoints';

// One attempt = one Idempotency-Key bound to one exact body. Resending the same attempt
// can never create a second claim; a changed body always gets a new key.
export type ClaimAttempt = {
  idempotencyKey: string;
  body: CreateClaimBody;
};

const STORAGE_PREFIX = 'cashmine.unresolvedClaim.';

export const createClaimAttempt = (body: CreateClaimBody): ClaimAttempt => ({
  idempotencyKey: randomUUID(),
  body,
});

const storageKey = (asset: string): string => `${STORAGE_PREFIX}${asset}`;

const isClaimAttempt = (value: unknown): value is ClaimAttempt => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ClaimAttempt>;
  return (
    typeof candidate.idempotencyKey === 'string' &&
    typeof candidate.body?.asset === 'string' &&
    typeof candidate.body?.amount === 'string' &&
    typeof candidate.body?.destinationId === 'string'
  );
};

// Saved before sending, removed once the outcome is known, so an unknown outcome
// survives navigation and reloads and is re-checked with the same key.
export const saveUnresolvedAttempt = (attempt: ClaimAttempt): void => {
  try {
    globalThis.localStorage?.setItem(storageKey(attempt.body.asset), JSON.stringify(attempt));
  } catch {
    // Storage blocked: the attempt still lives in memory for this screen.
  }
};

export const loadUnresolvedAttempt = (asset: string): ClaimAttempt | null => {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(asset));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isClaimAttempt(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const clearUnresolvedAttempt = (asset: string): void => {
  try {
    globalThis.localStorage?.removeItem(storageKey(asset));
  } catch {
    // Nothing to clear.
  }
};

export const clearAllUnresolvedAttempts = (): void => {
  try {
    const storage = globalThis.localStorage;
    if (!storage) return;
    Object.keys(storage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => storage.removeItem(key));
  } catch {
    // Nothing to clear.
  }
};
