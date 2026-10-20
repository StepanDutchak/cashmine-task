import { StyleSheet, Text, View } from 'react-native';

import { Amount } from '@/components/ui/Amount';
import { AssetAvatar } from '@/components/ui/AssetAvatar';
import { formatUnits } from '@/money/amount';
import { AssetBalance, usdCentsOf } from '@/money/balances';
import { colors, fontSize, spacing } from '@/theme/tokens';
import { formatUsdCents } from '@/utils/format';

export const AssetHeader = ({ balance }: { balance: AssetBalance }) => (
  <View style={styles.row}>
    <AssetAvatar asset={balance.asset} />
    <View style={styles.body}>
      <Text style={styles.label}>Available to claim</Text>
      <Amount value={formatUnits(balance.available, balance.decimals)} asset={balance.asset} size="md" />
      <Text style={styles.usd}>≈ {formatUsdCents(usdCentsOf(balance, balance.available))}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  usd: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
