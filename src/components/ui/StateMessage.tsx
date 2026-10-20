import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/theme/tokens';

import { AppButton } from './AppButton';

type Tone = 'neutral' | 'danger';

type StateMessageProps = {
  icon: string;
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
  <View style={[styles.container, tone === 'danger' && styles.danger]}>
    <View style={[styles.iconBadge, tone === 'danger' && styles.iconBadgeDanger]}>
      <Text style={styles.icon}>{icon}</Text>
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
    padding: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeDanger: {
    backgroundColor: colors.dangerSoft,
  },
  icon: {
    fontSize: fontSize.lg,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  action: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
});
