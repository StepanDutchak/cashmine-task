import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fonts, radius } from '@/theme/tokens';

type AssetMark = { glyph: string; tint: string; ink: string };

// Recognisable marks for known assets; anything else falls back to its first letter.
const ASSET_MARKS: Record<string, AssetMark> = {
  BTC: { glyph: '₿', tint: 'rgba(247, 147, 26, 0.16)', ink: '#8F5300' },
  ETH: { glyph: 'Ξ', tint: 'rgba(98, 126, 234, 0.16)', ink: '#3A4FA3' },
  USDT: { glyph: '₮', tint: 'rgba(38, 161, 123, 0.16)', ink: '#17694F' },
};

const AVATAR_SIZE = 40;

export const AssetAvatar = ({ asset }: { asset: string }) => {
  const mark = ASSET_MARKS[asset] ?? { glyph: asset.slice(0, 1), tint: colors.primarySoft, ink: colors.primary };
  return (
    <View style={[styles.avatar, { backgroundColor: mark.tint }]}>
      <Text style={[styles.glyph, { color: mark.ink }]}>{mark.glyph}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
  },
});
