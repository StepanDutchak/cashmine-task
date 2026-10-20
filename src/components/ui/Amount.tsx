import { StyleSheet, Text, TextStyle } from 'react-native';

import { colors, fontSize, fonts } from '@/theme/tokens';
import { groupDigits, splitPrecisionDigits } from '@/utils/format';

const VISIBLE_DECIMALS = 8;

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Tone = 'default' | 'positive';

type AmountProps = {
  value: string;
  asset?: string;
  size?: Size;
  tone?: Tone;
  showPlusSign?: boolean;
  align?: TextStyle['textAlign'];
};

// Every amount is shown exactly; digits past the 8th decimal are dimmed so it still reads at a glance.
export const Amount = ({ value, asset, size = 'md', tone = 'default', showPlusSign = false, align }: AmountProps) => {
  const { head, tail } = splitPrecisionDigits(groupDigits(value), VISIBLE_DECIMALS);
  const sign = showPlusSign && !value.startsWith('-') ? '+' : '';
  return (
    <Text style={[styles.base, styles[size], styles[tone], align ? { textAlign: align } : null]}>
      {sign}
      {head}
      {tail ? <Text style={styles.tail}>{tail}</Text> : null}
      {asset ? <Text style={styles.ticker}> {asset}</Text> : null}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.mono,
    fontVariant: ['tabular-nums'],
    color: colors.text,
    flexShrink: 1,
  },
  sm: { fontSize: fontSize.sm },
  md: { fontSize: fontSize.md },
  lg: { fontSize: fontSize.lg },
  xl: { fontSize: fontSize.xl, fontFamily: fonts.monoStrong },
  default: { color: colors.text },
  positive: { color: colors.primary },
  tail: { color: colors.textFaint },
  ticker: { color: colors.textMuted },
});
