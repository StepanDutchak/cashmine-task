import { IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import {
  SchibstedGrotesk_600SemiBold,
  SchibstedGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/schibsted-grotesk';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { createQueryClient } from '@/api/queryClient';
import { TokenProvider, useTokenContext } from '@/auth/TokenProvider';
import { ClaimTrackerProvider } from '@/claims/ClaimTrackerProvider';
import { TokenForm } from '@/components/TokenForm';
import { colors, fontSize, fonts } from '@/theme/tokens';

const TOKEN_REJECTED_MESSAGE = 'Your token was rejected or has expired. Enter a valid token.';

const AuthenticatedApp = () => {
  const { clearToken } = useTokenContext();
  const [queryClient] = useState(() => createQueryClient(() => clearToken(TOKEN_REJECTED_MESSAGE)));

  return (
    <QueryClientProvider client={queryClient}>
      <ClaimTrackerProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: fonts.display, fontSize: fontSize.lg, color: colors.text },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </ClaimTrackerProvider>
    </QueryClientProvider>
  );
};

const TokenGate = () => {
  const { token } = useTokenContext();
  // Keyed by token: a new token remounts the app with a fresh cache, so data never leaks between tokens.
  return token ? <AuthenticatedApp key={token} /> : <TokenForm />;
};

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });
  // If fonts fail to load we still render with system fonts rather than block the app.
  if (!fontsLoaded && !fontError) return null;

  return (
    <TokenProvider>
      <TokenGate />
    </TokenProvider>
  );
};

export default RootLayout;
