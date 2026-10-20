import { StyleSheet, Text, View } from 'react-native';

import { ActivityItem } from '@/api/schemas';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme/tokens';
import { groupDigits } from '@/utils/format';

const TYPE_LABEL: Record<ActivityItem['type'], string> = {
  accrual: 'Payback',
  reversal: 'Reversal',
  claim: 'Claim',
};

const STATUS_TONE: Record<ActivityItem['status'], 'neutral' | 'warning' | 'danger'> = {
  pending: 'warning',
  confirmed: 'neutral',
  completed: 'neutral',
  failed: 'danger',
};

// Fixed locale so dates match the English UI copy.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const ActivityRow = ({ item }: { item: ActivityItem }) => {
  const isNegative = item.amount.startsWith('-');
  const tone = STATUS_TONE[item.status];
  const subtitle = [item.exchange, dateFormatter.format(new Date(item.createdAt))].filter(Boolean).join(' · ');

  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <Text style={styles.title}>{TYPE_LABEL[item.type]}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.trailing}>
        <Text style={[styles.amount, isNegative ? styles.negative : styles.positive]} numberOfLines={1}>
          {isNegative ? '' : '+'}
          {groupDigits(item.amount)} {item.asset}
        </Text>
        <Text style={[styles.status, tone === 'warning' && styles.warning, tone === 'danger' && styles.danger]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  trailing: {
    flexShrink: 1,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  amount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  positive: {
    color: colors.primary,
  },
  negative: {
    color: colors.text,
  },
  status: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  warning: {
    color: colors.warning,
  },
  danger: {
    color: colors.danger,
  },
});
