import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Claim } from '@/api/schemas';
import { Card } from '@/components/ui/Card';
import { DetailRow } from '@/components/ui/DetailRow';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme/tokens';
import { groupDigits } from '@/utils/format';

const STATUS_COPY = {
  pending: { title: 'Claim in progress', message: 'This usually takes up to 20 seconds.' },
  completed: { title: 'Claim completed', message: 'The payout has been sent.' },
  failed: { title: 'Claim failed', message: 'The amount is back in your available balance.' },
} as const;

export const ClaimStatusCard = ({ claim }: { claim: Claim }) => {
  const copy = STATUS_COPY[claim.status];
  const format = (value: string) => `${groupDigits(value)} ${claim.asset}`;

  return (
    <Card>
      <View style={styles.header}>
        <View style={[styles.indicator, styles[claim.status]]}>
          {claim.status === 'pending' ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.indicatorText}>{claim.status === 'completed' ? '✓' : '✕'}</Text>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.message}>{copy.message}</Text>
        </View>
      </View>
      {claim.failureReason ? <Text style={styles.failure}>Reason: {claim.failureReason}</Text> : null}
      <View style={styles.rows}>
        <DetailRow label="Claimed" value={format(claim.amount)} />
        <DetailRow label="Fee" value={`− ${format(claim.fee)}`} />
        <DetailRow label="You receive" value={format(claim.receiveAmount)} emphasized />
        <DetailRow label="Claim ID" value={claim.id} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  indicator: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    backgroundColor: colors.primarySoft,
  },
  completed: {
    backgroundColor: colors.primary,
  },
  failed: {
    backgroundColor: colors.danger,
  },
  indicatorText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  failure: {
    fontSize: fontSize.sm,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  rows: {
    gap: spacing.sm,
  },
});
