import { StyleSheet, View } from 'react-native';

import { DetailRow } from '@/components/ui/DetailRow';
import { formatUnits } from '@/money/amount';
import { ClaimQuote } from '@/money/claimAmount';
import { spacing } from '@/theme/tokens';
import { groupDigits } from '@/utils/format';

type QuoteRowsProps = {
  quote: ClaimQuote;
  decimals: number;
  asset: string;
  showAmount?: boolean;
};

export const QuoteRows = ({ quote, decimals, asset, showAmount = false }: QuoteRowsProps) => {
  const format = (units: bigint) => `${groupDigits(formatUnits(units, decimals))} ${asset}`;
  return (
    <View style={styles.container}>
      {showAmount ? <DetailRow label="You claim" value={format(quote.amount)} /> : null}
      <DetailRow label="Fee" value={`− ${format(quote.fee)}`} />
      <DetailRow label="You receive" value={format(quote.receive)} emphasized />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});
