import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { colors, radius, spacing } from '@/theme/tokens';

const PLACEHOLDER_ROWS = 3;

export const BalancesSkeleton = () => (
  <View style={styles.container} accessibilityLabel="Loading balances">
    <View style={styles.card}>
      <Skeleton width={120} height={14} />
      <Skeleton width={180} height={32} />
      <Skeleton width={220} height={14} />
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
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
