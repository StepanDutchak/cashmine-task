import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

import { AppButton } from './AppButton';

type Tone = 'neutral' | 'danger';

type StateMessageProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
};

// Shared layout for empty and error states: icon + message + action.
export const StateMessage = ({
  icon,
  title,
  message,
  tone = 'neutral',
  actionLabel,
  onAction,
  actionLoading = false,
}: StateMessageProps) => (
  <View style={styles.container}>
    <View style={[styles.iconBadge, tone === 'danger' && styles.iconBadgeDanger]}>
      <Ionicons name={icon} size={26} color={tone === 'danger' ? colors.danger : colors.primary} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction ? (
      <View style={styles.action}>
        <AppButton label={actionLabel} onPress={onAction} variant="secondary" loading={actionLoading} />
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl + spacing.sm,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconBadgeDanger: {
    backgroundColor: colors.dangerSoft,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});
