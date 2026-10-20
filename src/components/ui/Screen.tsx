import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme/tokens';

type ScreenProps = {
  children: ReactNode;
  // Pinned to the bottom, within thumb reach: the screen's primary action.
  footer?: ReactNode;
};

export const Screen = ({ children, footer }: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = spacing.lg + insets.bottom;
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[screenColumn, { paddingBottom: footer ? spacing.lg : bottomPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
          <View style={styles.footerColumn}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  column: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  footer: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerColumn: {
    width: '100%',
    maxWidth: layout.maxContentWidth - spacing.lg * 2,
    alignSelf: 'center',
    gap: spacing.sm,
  },
});

// Exported so list screens (FlatList) can use the same centered column.
export const screenColumn = styles.column;
