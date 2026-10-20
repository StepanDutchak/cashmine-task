import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { clearAllUnresolvedAttempts } from '@/claims/claimAttempt';

import { loadToken, removeToken, saveToken } from './tokenStorage';

type TokenContextValue = {
  token: string | null;
  signOutReason: string | null;
  setToken: (token: string) => void;
  clearToken: (reason?: string) => void;
};

const TokenContext = createContext<TokenContextValue | null>(null);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(loadToken);
  const [signOutReason, setSignOutReason] = useState<string | null>(null);

  const setToken = useCallback((nextToken: string) => {
    saveToken(nextToken);
    setSignOutReason(null);
    setTokenState(nextToken);
  }, []);

  const clearToken = useCallback((reason?: string) => {
    removeToken();
    // Pending attempts belong to this token; replaying them under another token would create new claims.
    clearAllUnresolvedAttempts();
    setSignOutReason(reason ?? null);
    setTokenState(null);
  }, []);

  const value = useMemo(
    () => ({ token, signOutReason, setToken, clearToken }),
    [token, signOutReason, setToken, clearToken],
  );

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};

export const useTokenContext = (): TokenContextValue => {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useTokenContext must be used inside TokenProvider');
  return context;
};

// For screens behind the token gate, where a token is guaranteed.
export const useToken = (): string => {
  const { token } = useTokenContext();
  if (!token) throw new Error('useToken must be used behind the token gate');
  return token;
};
