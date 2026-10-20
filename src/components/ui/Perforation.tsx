import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/tokens';

// The tear line of a receipt: separates what you claim from what you receive.
export const Perforation = () => <View style={styles.line} />;

const styles = StyleSheet.create({
  line: {
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
});
