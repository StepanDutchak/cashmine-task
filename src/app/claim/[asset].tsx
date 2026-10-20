import { Stack, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/ui/Screen';
import { StateMessage } from '@/components/ui/StateMessage';

const ClaimScreen = () => {
  const { asset } = useLocalSearchParams<{ asset: string }>();
  return (
    <>
      <Stack.Screen options={{ title: `Claim ${asset}` }} />
      <Screen>
        <StateMessage icon="…" title="Claim is coming next" message="This screen is being built." />
      </Screen>
    </>
  );
};

export default ClaimScreen;
