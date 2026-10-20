import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Claim } from '@/api/schemas';
import { colors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

type StepState = 'done' | 'active' | 'upcoming' | 'failed';

type Step = { title: string; detail: string | null; state: StepState };

const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const stepsFor = (claim: Claim): Step[] => {
  const settledAt = claim.status === 'pending' ? null : timeFormatter.format(new Date(claim.updatedAt));
  return [
    { title: 'Submitted', detail: timeFormatter.format(new Date(claim.createdAt)), state: 'done' },
    {
      title: 'Processing',
      detail: claim.status === 'pending' ? 'Usually up to 20 seconds' : null,
      state: claim.status === 'pending' ? 'active' : 'done',
    },
    claim.status === 'failed'
      ? { title: 'Failed', detail: settledAt, state: 'failed' }
      : { title: 'Completed', detail: settledAt, state: claim.status === 'completed' ? 'done' : 'upcoming' },
  ];
};

const StepMarker = ({ state }: { state: StepState }) => {
  if (state === 'active') return <ActivityIndicator size="small" color={colors.primary} />;
  if (state === 'upcoming') return <View style={styles.upcomingDot} />;
  return (
    <Ionicons
      name={state === 'failed' ? 'close-circle' : 'checkmark-circle'}
      size={22}
      color={state === 'failed' ? colors.danger : colors.primary}
    />
  );
};

export const ClaimTimeline = ({ claim }: { claim: Claim }) => {
  const steps = stepsFor(claim);
  return (
    <View>
      {steps.map((step, index) => (
        <View key={step.title} style={styles.step}>
          <View style={styles.markerColumn}>
            <View style={styles.marker}>
              <StepMarker state={step.state} />
            </View>
            {index < steps.length - 1 ? (
              <View style={[styles.connector, step.state === 'done' && styles.connectorDone]} />
            ) : null}
          </View>
          <View style={styles.text}>
            <Text style={[styles.title, step.state === 'upcoming' && styles.titleUpcoming]}>{step.title}</Text>
            {step.detail ? <Text style={styles.detail}>{step.detail}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
};

const MARKER_SIZE = 24;

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  markerColumn: {
    alignItems: 'center',
    width: MARKER_SIZE,
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
  },
  connector: {
    flex: 1,
    width: 2,
    minHeight: spacing.lg,
    backgroundColor: colors.border,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
  text: {
    flex: 1,
    paddingBottom: spacing.lg,
    gap: 2,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.md,
    color: colors.text,
  },
  titleUpcoming: {
    color: colors.textFaint,
  },
  detail: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
