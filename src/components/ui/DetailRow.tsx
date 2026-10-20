import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, spacing } from '@/theme/tokens';

type DetailRowProps = {
  label: string;
  value: string;
  emphasized?: boolean;
};

export const DetailRow = ({ label, value, emphasized = false }: DetailRowProps) => (
  <View style={styles.row}>
    <Text style={[styles.label, emphasized && styles.emphasized]}>{label}</Text>
    <Text style={[styles.value, emphasized && styles.emphasized]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  value: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.text,
  },
  emphasized: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
});
