import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatUnits, normalizeAmountInput } from '@/money/amount';
import { ClaimRules, validateClaimAmount } from '@/money/claimAmount';
import { colors, fontSize, fonts, layout, radius, spacing } from '@/theme/tokens';

const PERCENT_BASE = 100n;
const QUICK_SHARES = [
  { label: '25%', percent: 25n },
  { label: '50%', percent: 50n },
  { label: 'Max', percent: 100n },
] as const;

type QuickAmountsProps = {
  rules: ClaimRules;
  currentInput: string;
  onSelect: (amount: string) => void;
};

// Shares of the available balance, rounded down to the asset's smallest unit.
// A share that would fail validation (e.g. below the minimum) is disabled.
export const QuickAmounts = ({ rules, currentInput, onSelect }: QuickAmountsProps) => (
  <View style={styles.row}>
    {QUICK_SHARES.map(({ label, percent }) => {
      const amount = formatUnits((rules.available * percent) / PERCENT_BASE, rules.decimals);
      const isValid = validateClaimAmount(amount, rules).ok;
      const isSelected = normalizeAmountInput(currentInput) === amount;
      return (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={label === 'Max' ? 'Claim the maximum' : `Claim ${label} of available`}
          disabled={!isValid}
          onPress={() => onSelect(amount)}
          style={({ pressed }) => [
            styles.chip,
            isSelected && styles.selected,
            !isValid && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    minHeight: layout.minTouchTarget,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  labelSelected: {
    color: colors.onPrimary,
  },
});
