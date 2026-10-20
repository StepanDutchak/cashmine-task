import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClaimBadge } from '@/claims/inFlightClaims';
import { formatUnits } from '@/money/amount';
import { AssetBalance, usdCentsOf } from '@/money/balances';
import { colors, fontSize, fontWeight, layout, radius, spacing } from '@/theme/tokens';
import { formatUsdCents, groupDigits } from '@/utils/format';

type AssetRowProps = {
  balance: AssetBalance;
  badge: ClaimBadge;
  onPress: () => void;
};

const BADGE_LABEL: Record<NonNullable<ClaimBadge>, string> = {
  inProgress: 'Claim in progress',
  failed: 'Last claim failed · amount returned',
};

const formatAmount = (units: bigint, decimals: number): string => groupDigits(formatUnits(units, decimals));

export const AssetRow = ({ balance, badge, onPress }: AssetRowProps) => {
  const { asset, decimals, available, pending, claiming } = balance;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Claim ${asset}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{asset.slice(0, 1)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.line}>
          <Text style={styles.asset}>{asset}</Text>
          <Text style={styles.amount} numberOfLines={1}>
            {formatAmount(available, decimals)}
          </Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.muted}>Available</Text>
          <Text style={styles.muted}>{formatUsdCents(usdCentsOf(balance, available))}</Text>
        </View>
        {pending > 0n || claiming > 0n ? (
          <Text style={styles.secondary}>
            Pending {formatAmount(pending, decimals)} · Claiming {formatAmount(claiming, decimals)}
          </Text>
        ) : null}
        {badge ? (
          <Text style={[styles.badgeChip, badge === 'failed' ? styles.badgeFailed : styles.badgeInProgress]}>
            {BADGE_LABEL[badge]}
          </Text>
        ) : null}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  asset: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  amount: {
    flexShrink: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  muted: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  secondary: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  badgeChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    overflow: 'hidden',
  },
  badgeInProgress: {
    color: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  badgeFailed: {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  chevron: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
});
