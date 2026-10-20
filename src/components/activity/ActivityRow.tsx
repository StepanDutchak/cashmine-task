import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActivityItem } from '@/api/schemas';
import { Amount } from '@/components/ui/Amount';
import { colors, fontSize, fontWeight, fonts, radius, spacing } from '@/theme/tokens';

type TypeStyle = { label: string; icon: ComponentProps<typeof Ionicons>['name']; ink: string; tint: string };

const TYPE_STYLE: Record<ActivityItem['type'], TypeStyle> = {
  accrual: { label: 'Payback', icon: 'arrow-down', ink: colors.primary, tint: colors.primarySoft },
  reversal: { label: 'Reversal', icon: 'arrow-undo', ink: colors.warning, tint: colors.warningSoft },
  claim: { label: 'Claim', icon: 'arrow-up', ink: colors.text, tint: colors.background },
};

const STATUS_COLOR: Record<ActivityItem['status'], string> = {
  pending: colors.warning,
  confirmed: colors.textMuted,
  completed: colors.textMuted,
  failed: colors.danger,
};

// Fixed locale so dates match the English UI copy.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const ActivityRow = ({ item }: { item: ActivityItem }) => {
  const type = TYPE_STYLE[item.type];
  const subtitle = [item.exchange, dateFormatter.format(new Date(item.createdAt))].filter(Boolean).join(' · ');
  const isIncoming = !item.amount.startsWith('-');

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: type.tint }]}>
        <Ionicons name={type.icon} size={18} color={type.ink} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{type.label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.trailing}>
        <Amount
          value={item.amount}
          asset={item.asset}
          size="sm"
          tone={isIncoming ? 'positive' : 'default'}
          showPlusSign
          align="right"
        />
        <Text style={[styles.status, { color: STATUS_COLOR[item.status] }]}>{item.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.md,
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  trailing: {
    flexShrink: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  status: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
