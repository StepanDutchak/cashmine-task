import { StyleSheet, Text, View } from 'react-native';

import { Amount } from '@/components/ui/Amount';
import { DetailRow } from '@/components/ui/DetailRow';
import { formatUnits } from '@/money/amount';
import { ClaimQuote } from '@/money/claimAmount';
import { colors, fontSize, fonts, spacing } from '@/theme/tokens';

type QuoteRowsProps = {
  quote: ClaimQuote;
  decimals: number;
  asset: string;
};

export const QuoteRows = ({ quote, decimals, asset }: QuoteRowsProps) => (
  <View style={styles.container}>
    <DetailRow label="Fee" value={<Amount value={`−${formatUnits(quote.fee, decimals)}`} asset={asset} size="sm" />} />
    <View style={styles.receive}>
      <Text style={styles.receiveLabel}>You receive</Text>
      <Amount value={formatUnits(quote.receive, decimals)} asset={asset} size="lg" tone="positive" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  receive: {
    gap: spacing.xs,
  },
  receiveLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
