import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { describeApiError } from '@/api/errors';
import { ClaimStatusCard } from '@/components/claim/ClaimStatusCard';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { useClaim } from '@/hooks/useClaim';
import { useManualRefresh } from '@/hooks/useManualRefresh';
import { colors, fontSize, radius, spacing } from '@/theme/tokens';

const ClaimStatusScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const claimQuery = useClaim(id);
  const { isRefreshing, refresh } = useManualRefresh(claimQuery.refetch);
  const claim = claimQuery.data;

  const renderContent = () => {
    if (claimQuery.isPending) {
      return (
        <Card>
          <Skeleton width={160} height={20} />
          <Skeleton height={14} />
          <Skeleton width="60%" height={14} />
        </Card>
      );
    }
    if (!claim) {
      return (
        <StateMessage
          tone="danger"
          icon="!"
          title="Couldn't load this claim"
          message={describeApiError(claimQuery.error)}
          actionLabel="Try again"
          onAction={refresh}
          actionLoading={isRefreshing}
        />
      );
    }
    return (
      <>
        <ClaimStatusCard claim={claim} />
        {claimQuery.isRefetchError && claim.status === 'pending' ? (
          <Text style={styles.warning}>Couldn&apos;t update the status. Retrying automatically…</Text>
        ) : null}
        <AppButton label="Back to balances" onPress={() => router.dismissTo('/')} />
      </>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Claim status' }} />
      <Screen>{renderContent()}</Screen>
    </>
  );
};

const styles = StyleSheet.create({
  warning: {
    fontSize: fontSize.sm,
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
});

export default ClaimStatusScreen;
