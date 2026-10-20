import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClaimOptions } from '@/api/schemas';
import { colors, fontSize, fontWeight, layout, radius, spacing } from '@/theme/tokens';

type DestinationPickerProps = {
  destinations: ClaimOptions['destinations'];
  selectedId: string;
  onSelect: (destinationId: string) => void;
};

export const DestinationPicker = ({ destinations, selectedId, onSelect }: DestinationPickerProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Send to</Text>
    {destinations.map((destination) => {
      const isSelected = destination.id === selectedId;
      return (
        <Pressable
          key={destination.id}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected }}
          onPress={() => onSelect(destination.id)}
          style={({ pressed }) => [styles.option, isSelected && styles.selected, pressed && styles.pressed]}
        >
          <View style={[styles.radio, isSelected && styles.radioSelected]} />
          <Text style={styles.label}>{destination.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    borderColor: colors.primary,
    borderWidth: 6,
  },
  label: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
});
