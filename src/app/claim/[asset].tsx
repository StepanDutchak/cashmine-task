import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { describeApiError } from '@/api/errors';
import { ClaimFlow } from '@/components/claim/ClaimFlow';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { useClaimSetup } from '@/hooks/useClaimSetup';
import { spacing } from '@/theme/tokens';

const ClaimSkeleton = () => (
  <Card>
    <Skeleton width={100} height={14} />
    <Skeleton height={52} />
    <View style={styles.skeletonRows}>
      <Skeleton width="70%" height={14} />
      <Skeleton width="50%" height={14} />
    </View>
  </Card>
);

const ClaimScreen = () => {
  const { asset } = useLocalSearchParams<{ asset: string }>();
  const state = useClaimSetup(asset);

  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return <ClaimSkeleton />;
      case 'error':
        return (
          <StateMessage
            tone="danger"
            icon="!"
            title="Couldn't load claim details"
            message={describeApiError(state.error)}
            actionLabel="Try again"
            onAction={state.retry}
            actionLoading={state.isRetrying}
          />
        );
      case 'unknownAsset':
        return <StateMessage icon="?" title={`No ${asset} balance`} message="This asset isn't in your balances." />;
      case 'ready':
        return <ClaimFlow asset={asset} setup={state.setup} />;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Claim ${asset}` }} />
      <Screen>{renderContent()}</Screen>
    </>
  );
};

const styles = StyleSheet.create({
  skeletonRows: {
    gap: spacing.sm,
  },
});

export default ClaimScreen;
