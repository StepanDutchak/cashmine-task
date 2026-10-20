// The token lives only in this browser's localStorage, never in code or the build.
const STORAGE_KEY = 'cashmine.apiToken';

export const loadToken = (): string | null => {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
};

export const saveToken = (token: string): void => {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, token);
  } catch {
    // Storage blocked (private mode): the token still works for this session.
  }
};

export const removeToken = (): void => {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to remove.
  }
};
