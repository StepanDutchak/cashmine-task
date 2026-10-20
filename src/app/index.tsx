import { Stack, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { describeApiError } from '@/api/errors';
import { useTokenContext } from '@/auth/TokenProvider';
import { useClaimTracker } from '@/claims/ClaimTrackerProvider';
import { claimBadgeFor } from '@/claims/inFlightClaims';
import { AssetRow } from '@/components/home/AssetRow';
import { BalanceSummary } from '@/components/home/BalanceSummary';
import { BalancesSkeleton } from '@/components/home/BalancesSkeleton';
import { AppButton } from '@/components/ui/AppButton';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { Screen } from '@/components/ui/Screen';
import { StateMessage } from '@/components/ui/StateMessage';
import { useBalances } from '@/hooks/useBalances';
import { useManualRefresh } from '@/hooks/useManualRefresh';
import { summarizeBalances } from '@/money/balances';
import { colors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

const HomeScreen = () => {
  const router = useRouter();
  const { clearToken } = useTokenContext();
  const balancesQuery = useBalances();
  const { claims } = useClaimTracker();
  const { isRefreshing, refresh } = useManualRefresh(balancesQuery.refetch);
  const snapshot = balancesQuery.data;
  const totals = useMemo(() => (snapshot ? summarizeBalances(snapshot.balances) : null), [snapshot]);

  const renderContent = () => {
    if (balancesQuery.isPending) return <BalancesSkeleton />;
    if (!snapshot || !totals) {
      return (
        <StateMessage
          tone="danger"
          icon="cloud-offline-outline"
          title="Couldn't load your balances"
          message={describeApiError(balancesQuery.error)}
          actionLabel="Try again"
          onAction={refresh}
          actionLoading={isRefreshing}
        />
      );
    }
    return (
      <>
        <BalanceSummary
          totals={totals}
          balances={snapshot.balances}
          asOf={snapshot.asOf}
          isRefreshing={isRefreshing}
          onRefresh={refresh}
        />
        {balancesQuery.isRefetchError ? (
          <Text style={styles.refreshError}>
            Couldn't refresh: {describeApiError(balancesQuery.error)} Showing the last known balances.
          </Text>
        ) : null}
        {snapshot.balances.length === 0 ? (
          <StateMessage
            icon="leaf-outline"
            title="No payback yet"
            message="When you trade on a connected exchange, your payback shows up here."
            actionLabel="Check again"
            onAction={refresh}
            actionLoading={isRefreshing}
          />
        ) : (
          <View style={styles.list}>
            <Text style={styles.sectionLabel}>Tap an asset to claim it</Text>
            {snapshot.balances.map((balance) => (
              <AssetRow
                key={balance.asset}
                balance={balance}
                badge={claimBadgeFor(balance, claims)}
                onPress={() => router.push({ pathname: '/claim/[asset]', params: { asset: balance.asset } })}
              />
            ))}
          </View>
        )}
        <AppButton label="View activity" variant="ghost" onPress={() => router.push('/activity')} />
      </>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Payback',
          headerRight: () => <HeaderButton label="Change token" onPress={() => clearToken()} />,
        }}
      />
      <Screen>{renderContent()}</Screen>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    marginBottom: spacing.xs,
  },
  refreshError: {
    fontSize: fontSize.sm,
    color: colors.warning,
    backgroundColor: colors.warningSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
});

export default HomeScreen;
