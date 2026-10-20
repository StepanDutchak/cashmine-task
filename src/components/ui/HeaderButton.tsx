import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontSize, fontWeight, layout, spacing } from '@/theme/tokens';

type HeaderButtonProps = {
  label: string;
  onPress: () => void;
};

export const HeaderButton = ({ label, onPress }: HeaderButtonProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.button, pressed && styles.pressed]}
  >
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: layout.minTouchTarget,
    minWidth: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
});
