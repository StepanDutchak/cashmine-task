import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { useNow } from '@/hooks/useNow';
import { BalanceTotals } from '@/money/balances';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme/tokens';
import { formatAge, formatUsdCents, secondsSince } from '@/utils/format';

const STALE_AFTER_SECONDS = 60;

type BalanceSummaryProps = {
  totals: BalanceTotals;
  asOf: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export const BalanceSummary = ({ totals, asOf, isRefreshing, onRefresh }: BalanceSummaryProps) => {
  const now = useNow();
  const isStale = secondsSince(asOf, now) > STALE_AFTER_SECONDS;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Available to claim</Text>
      <Text style={styles.total}>{formatUsdCents(totals.availableUsdCents)}</Text>
      <View style={styles.breakdown}>
        <Text style={styles.breakdownText}>Pending {formatUsdCents(totals.pendingUsdCents)}</Text>
        <Text style={styles.breakdownText}>Claiming {formatUsdCents(totals.claimingUsdCents)}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.freshness, isStale && styles.stale]}>
          {isStale ? 'May be out of date · ' : ''}Updated {formatAge(asOf, now)}
        </Text>
        <View style={styles.refresh}>
          <AppButton label="Refresh" variant="secondary" onPress={onRefresh} loading={isRefreshing} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  total: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  breakdown: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  breakdownText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  freshness: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  stale: {
    color: colors.warning,
  },
  refresh: {
    minWidth: 112,
  },
});
