import { StyleSheet, Text, View } from 'react-native';

import { AssetShare } from '@/money/balances';
import { colors, compositionColors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

const PERMILLE = 1000n;

const percentOf = (part: bigint, total: bigint): string => `${(Number((part * PERMILLE) / total) / 10).toFixed(1)}%`;

type CompositionBarProps = {
  shares: AssetShare[];
  totalUsdCents: bigint;
};

// What the available total is made of, by USD value.
export const CompositionBar = ({ shares, totalUsdCents }: CompositionBarProps) => {
  if (shares.length === 0 || totalUsdCents === 0n) return null;
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {shares.map((share, index) => (
          <View
            key={share.asset}
            style={{ flex: Number(share.usdCents), backgroundColor: compositionColors[index % compositionColors.length] }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {shares.map((share, index) => (
          <View key={share.asset} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: compositionColors[index % compositionColors.length] }]} />
            <Text style={styles.legendText}>
              {share.asset} {percentOf(share.usdCents, totalUsdCents)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  track: {
    flexDirection: 'row',
    height: 8,
    gap: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.heroTrack,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  legendText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: colors.heroMuted,
  },
});
