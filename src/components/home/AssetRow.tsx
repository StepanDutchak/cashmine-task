import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClaimBadge } from '@/claims/inFlightClaims';
import { Amount } from '@/components/ui/Amount';
import { AssetAvatar } from '@/components/ui/AssetAvatar';
import { formatUnits } from '@/money/amount';
import { AssetBalance, usdCentsOf } from '@/money/balances';
import { colors, fontSize, fontWeight, fonts, layout, radius, spacing } from '@/theme/tokens';
import { formatUsdCents } from '@/utils/format';

type AssetRowProps = {
  balance: AssetBalance;
  badge: ClaimBadge;
  onPress: () => void;
};

const BADGE_LABEL: Record<NonNullable<ClaimBadge>, string> = {
  inProgress: 'Claim in progress',
  failed: 'Last claim failed · amount returned',
};

export const AssetRow = ({ balance, badge, onPress }: AssetRowProps) => {
  const { asset, decimals, available, pending, claiming } = balance;
  const details = [
    pending > 0n ? `Pending ${formatUnits(pending, decimals)}` : null,
    claiming > 0n ? `Claiming ${formatUnits(claiming, decimals)}` : null,
  ].filter(Boolean);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Claim ${asset}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AssetAvatar asset={asset} />
      <View style={styles.body}>
        <View style={styles.line}>
          <Text style={styles.asset}>{asset}</Text>
          <Amount value={formatUnits(available, decimals)} size="sm" align="right" />
        </View>
        <View style={styles.line}>
          <Text style={styles.muted} numberOfLines={1}>
            {details.length > 0 ? details.join(' · ') : 'Available'}
          </Text>
          <Text style={styles.usd}>{formatUsdCents(usdCentsOf(balance, available))}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, badge === 'failed' ? styles.badgeFailed : styles.badgeInProgress]}>
            <Ionicons
              name={badge === 'failed' ? 'alert-circle' : 'time'}
              size={14}
              color={badge === 'failed' ? colors.danger : colors.warning}
            />
            <Text style={[styles.badgeText, { color: badge === 'failed' ? colors.danger : colors.warning }]}>
              {BADGE_LABEL[badge]}
            </Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget + spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  body: {
    flex: 1,
    gap: 2,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  asset: {
    fontFamily: fonts.display,
    fontSize: fontSize.md,
    color: colors.text,
  },
  muted: {
    flexShrink: 1,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  usd: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeInProgress: {
    backgroundColor: colors.warningSoft,
  },
  badgeFailed: {
    backgroundColor: colors.dangerSoft,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
