import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useMemo } from 'react';

import { createQueryClient } from '@/api/queryClient';
import { TokenProvider, useTokenContext } from '@/auth/TokenProvider';
import { TokenForm } from '@/components/TokenForm';
import { colors, fontWeight } from '@/theme/tokens';

const TOKEN_REJECTED_MESSAGE = 'Your token was rejected or has expired. Enter a valid token.';

const AuthenticatedApp = ({ token }: { token: string }) => {
  const { clearToken } = useTokenContext();
  // A fresh cache per token, so one token's data is never shown under another.
  const queryClient = useMemo(
    () => createQueryClient(() => clearToken(TOKEN_REJECTED_MESSAGE)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, clearToken],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontWeight: fontWeight.semibold, color: colors.text },
          headerTintColor: colors.primary,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </QueryClientProvider>
  );
};

const TokenGate = () => {
  const { token } = useTokenContext();
  return token ? <AuthenticatedApp token={token} /> : <TokenForm />;
};

const RootLayout = () => (
  <TokenProvider>
    <TokenGate />
  </TokenProvider>
);

export default RootLayout;
