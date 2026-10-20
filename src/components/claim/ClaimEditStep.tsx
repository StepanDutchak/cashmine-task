import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { ClaimSetup } from '@/hooks/useClaimSetup';
import { formatUnits } from '@/money/amount';
import { describeClaimAmountError, validateClaimAmount } from '@/money/claimAmount';
import { colors, fontSize, fonts, layout, radius, spacing } from '@/theme/tokens';

import { AssetHeader } from './AssetHeader';
import { DestinationPicker } from './DestinationPicker';
import { QuickAmounts } from './QuickAmounts';
import { QuoteRows } from './QuoteRows';

type ClaimEditStepProps = {
  asset: string;
  setup: ClaimSetup;
  amountInput: string;
  onAmountChange: (value: string) => void;
  destinationId: string | null;
  onDestinationChange: (destinationId: string) => void;
  showErrors: boolean;
  onReview: () => void;
};

export const ClaimEditStep = ({
  asset,
  setup,
  amountInput,
  onAmountChange,
  destinationId,
  onDestinationChange,
  showErrors,
  onReview,
}: ClaimEditStepProps) => {
  const { rules, destinations, balance } = setup;
  const result = validateClaimAmount(amountInput, rules);
  const errorMessage =
    !result.ok && (showErrors || amountInput !== '') ? describeClaimAmountError(result.error, rules, asset) : null;
  const destinationError = showErrors && !destinationId ? 'Choose where to send your claim.' : null;

  return (
    <Screen footer={<AppButton label="Review claim" onPress={onReview} />}>
      <AssetHeader balance={balance} />
      <Card>
        <Text style={styles.label}>Amount to claim</Text>
        <View style={[styles.inputRow, errorMessage && styles.inputRowError]}>
          <TextInput
            value={amountInput}
            onChangeText={onAmountChange}
            placeholder="0"
            placeholderTextColor={colors.textFaint}
            keyboardType="decimal-pad"
            inputMode="decimal"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel={`Amount in ${asset}`}
          />
          <Text style={styles.ticker}>{asset}</Text>
        </View>
        <QuickAmounts rules={rules} currentInput={amountInput} onSelect={onAmountChange} />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Text style={styles.hint}>
          Minimum {formatUnits(rules.minAmount, rules.decimals)} {asset} · fee {formatUnits(rules.fee, rules.decimals)}{' '}
          {asset}, taken from the amount
        </Text>
        {result.ok ? (
          <View style={styles.quote}>
            <QuoteRows quote={result.quote} decimals={rules.decimals} asset={asset} />
          </View>
        ) : null}
      </Card>
      {destinations.length > 1 ? (
        <Card>
          <DestinationPicker
            destinations={destinations}
            selectedId={destinationId}
            onSelect={onDestinationChange}
            error={destinationError}
          />
        </Card>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.minTouchTarget + spacing.xl,
    fontFamily: fonts.mono,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  ticker: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  hint: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    color: colors.textMuted,
  },
  quote: {
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
