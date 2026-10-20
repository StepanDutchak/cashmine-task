import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClaimOptions } from '@/api/schemas';
import { colors, fontSize, fonts, layout, radius, spacing } from '@/theme/tokens';

type DestinationPickerProps = {
  destinations: ClaimOptions['destinations'];
  selectedId: string | null;
  onSelect: (destinationId: string) => void;
  error: string | null;
};

const iconFor = (destinationId: string) => (destinationId.includes('wallet') ? 'wallet-outline' : 'business-outline');

export const DestinationPicker = ({ destinations, selectedId, onSelect, error }: DestinationPickerProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Send to</Text>
    {destinations.map((destination) => {
      const isSelected = destination.id === selectedId;
      return (
        <Pressable
          key={destination.id}
          role="radio"
          aria-checked={isSelected}
          onPress={() => onSelect(destination.id)}
          style={({ pressed }) => [styles.option, isSelected && styles.selected, pressed && styles.pressed]}
        >
          <View style={[styles.icon, isSelected && styles.iconSelected]}>
            <Ionicons
              name={iconFor(destination.id)}
              size={18}
              color={isSelected ? colors.onPrimary : colors.textMuted}
            />
          </View>
          <Text style={styles.label}>{destination.label}</Text>
          <Ionicons
            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={isSelected ? colors.primary : colors.border}
          />
        </Pressable>
      );
    })}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: layout.minTouchTarget + spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
});
