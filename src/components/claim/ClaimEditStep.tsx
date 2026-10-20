import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ClaimSetup } from '@/hooks/useClaimSetup';
import { formatUnits } from '@/money/amount';
import { describeClaimAmountError, validateClaimAmount } from '@/money/claimAmount';
import { colors, fontSize, fontWeight, layout, radius, spacing } from '@/theme/tokens';
import { groupDigits } from '@/utils/format';

import { DestinationPicker } from './DestinationPicker';
import { QuoteRows } from './QuoteRows';

type ClaimEditStepProps = {
  asset: string;
  setup: ClaimSetup;
  amountInput: string;
  onAmountChange: (value: string) => void;
  destinationId: string;
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
  const { rules, destinations } = setup;
  const result = validateClaimAmount(amountInput, rules);
  const errorMessage =
    !result.ok && (showErrors || amountInput !== '') ? describeClaimAmountError(result.error, rules, asset) : null;
  const format = (units: bigint) => `${groupDigits(formatUnits(units, rules.decimals))} ${asset}`;

  return (
    <>
      <Card>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.available}>Available {format(rules.available)}</Text>
        </View>
        <View style={[styles.inputRow, errorMessage && styles.inputRowError]}>
          <TextInput
            value={amountInput}
            onChangeText={onAmountChange}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            inputMode="decimal"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel={`Amount in ${asset}`}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => onAmountChange(formatUnits(rules.available, rules.decimals))}
            style={({ pressed }) => [styles.max, pressed && styles.pressed]}
          >
            <Text style={styles.maxLabel}>Max</Text>
          </Pressable>
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Text style={styles.hint}>
          Minimum {format(rules.minAmount)} · Fee {format(rules.fee)}
        </Text>
        {result.ok ? <QuoteRows quote={result.quote} decimals={rules.decimals} asset={asset} /> : null}
      </Card>
      {destinations.length > 1 ? (
        <Card>
          <DestinationPicker destinations={destinations} selectedId={destinationId} onSelect={onDestinationChange} />
        </Card>
      ) : null}
      <AppButton label="Review claim" onPress={onReview} />
    </>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  available: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: layout.minTouchTarget + spacing.sm,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  max: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  maxLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
