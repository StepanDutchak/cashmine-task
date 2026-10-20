import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radius, spacing } from '@/theme/tokens';

const PLACEHOLDER_ROWS = 3;

export const BalancesSkeleton = () => (
  <View style={styles.container} accessibilityLabel="Loading balances">
    <View style={styles.card}>
      <Skeleton width={110} height={14} color={colors.heroTrack} />
      <Skeleton width={200} height={40} color={colors.heroTrack} />
      <Skeleton height={8} color={colors.heroTrack} />
      <Skeleton width={180} height={14} color={colors.heroTrack} />
    </View>
    {Array.from({ length: PLACEHOLDER_ROWS }, (_, index) => (
      <View key={index} style={styles.row}>
        <Skeleton width={40} height={40} />
        <View style={styles.rowBody}>
          <Skeleton height={16} />
          <Skeleton width="60%" height={14} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.hero,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  rowBody: {
    flex: 1,
    gap: spacing.sm,
  },
});
