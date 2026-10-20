import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '@/theme/tokens';

type DetailRowProps = {
  label: string;
  value: ReactNode;
};

export const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.value}>
      {typeof value === 'string' ? <Text style={styles.valueText}>{value}</Text> : value}
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  value: {
    flexShrink: 1,
    alignItems: 'flex-end',
  },
  valueText: {
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.text,
  },
});
