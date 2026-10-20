import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useNow } from '@/hooks/useNow';
import { AssetBalance, BalanceTotals, availableComposition } from '@/money/balances';
import { colors, fontSize, fonts, layout, radius, spacing } from '@/theme/tokens';
import { formatAge, formatUsdCents, secondsSince } from '@/utils/format';

import { CompositionBar } from './CompositionBar';

const STALE_AFTER_SECONDS = 60;
const STALE_DOT_COLOR = '#F5B544';

type BalanceSummaryProps = {
  totals: BalanceTotals;
  balances: AssetBalance[];
  asOf: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export const BalanceSummary = ({ totals, balances, asOf, isRefreshing, onRefresh }: BalanceSummaryProps) => {
  const now = useNow();
  const isStale = secondsSince(asOf, now) > STALE_AFTER_SECONDS;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>Ready to claim</Text>
        <View style={styles.freshness}>
          <View style={[styles.dot, { backgroundColor: isStale ? STALE_DOT_COLOR : colors.heroAccent }]} />
          <Text style={styles.freshnessText}>
            {isStale ? 'May be out of date · ' : ''}Updated {formatAge(asOf, now)}
          </Text>
        </View>
      </View>
      <Text style={styles.total} accessibilityRole="header">
        {formatUsdCents(totals.availableUsdCents)}
      </Text>
      <CompositionBar shares={availableComposition(balances)} totalUsdCents={totals.availableUsdCents} />
      <View style={styles.divider} />
      <View style={styles.bottomRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{formatUsdCents(totals.pendingUsdCents)}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Claiming</Text>
          <Text style={styles.statValue}>{formatUsdCents(totals.claimingUsdCents)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh balances"
          disabled={isRefreshing}
          onPress={onRefresh}
          style={({ pressed }) => [styles.refresh, pressed && styles.refreshPressed]}
        >
          {isRefreshing ? (
            <ActivityIndicator color={colors.heroText} />
          ) : (
            <Ionicons name="refresh" size={20} color={colors.heroText} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.hero,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eyebrow: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.heroMuted,
  },
  freshness: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  freshnessText: {
    fontSize: fontSize.xs,
    color: colors.heroMuted,
    flexShrink: 1,
  },
  total: {
    fontFamily: fonts.display,
    fontSize: fontSize.hero,
    letterSpacing: -0.5,
    color: colors.heroText,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.heroTrack,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  stat: {
    gap: 2,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.heroMuted,
  },
  statValue: {
    fontFamily: fonts.mono,
    fontSize: fontSize.md,
    color: colors.heroText,
  },
  refresh: {
    marginLeft: 'auto',
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: radius.pill,
    backgroundColor: colors.heroTrack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshPressed: {
    opacity: 0.7,
  },
});
