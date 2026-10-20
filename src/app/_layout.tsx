import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { createQueryClient } from '@/api/queryClient';
import { TokenProvider, useTokenContext } from '@/auth/TokenProvider';
import { TokenForm } from '@/components/TokenForm';
import { colors, fontWeight } from '@/theme/tokens';

const TOKEN_REJECTED_MESSAGE = 'Your token was rejected or has expired. Enter a valid token.';

const AuthenticatedApp = () => {
  const { clearToken } = useTokenContext();
  const [queryClient] = useState(() => createQueryClient(() => clearToken(TOKEN_REJECTED_MESSAGE)));

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
  // Keyed by token: a new token remounts the app with a fresh cache, so data never leaks between tokens.
  return token ? <AuthenticatedApp key={token} /> : <TokenForm />;
};

const RootLayout = () => (
  <TokenProvider>
    <TokenGate />
  </TokenProvider>
);

export default RootLayout;
