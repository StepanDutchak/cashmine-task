import { StyleSheet, Text, View } from 'react-native';

import { ClaimAttempt } from '@/claims/claimAttempt';
import { SubmissionState } from '@/claims/submissionState';
import { AppButton } from '@/components/ui/AppButton';
import { Card } from '@/components/ui/Card';
import { ClaimQuote } from '@/money/claimAmount';
import { colors, fontSize, fontWeight, radius, spacing } from '@/theme/tokens';

import { QuoteRows } from './QuoteRows';

type ClaimReviewStepProps = {
  attempt: ClaimAttempt;
  quote: ClaimQuote;
  decimals: number;
  destinationLabel: string;
  submission: SubmissionState;
  onConfirm: () => void;
  onEdit: () => void;
  onLeave: () => void;
};

const UNKNOWN_EXPLANATION =
  "We didn't get an answer from the server, so the claim may or may not have been created. " +
  'Checking again is safe: it can never create a second claim.';

export const ClaimReviewStep = ({
  attempt,
  quote,
  decimals,
  destinationLabel,
  submission,
  onConfirm,
  onEdit,
  onLeave,
}: ClaimReviewStepProps) => {
  const isBusy = submission.kind === 'submitting' || submission.kind === 'checking';
  const isUnknown = submission.kind === 'unknown';
  const { asset } = attempt.body;

  return (
    <>
      <Card>
        <Text style={styles.title}>Review your claim</Text>
        <QuoteRows quote={quote} decimals={decimals} asset={asset} showAmount />
        <View style={styles.destination}>
          <Text style={styles.muted}>To</Text>
          <Text style={styles.destinationLabel}>{destinationLabel}</Text>
        </View>
      </Card>

      {submission.kind === 'checking' ? (
        <Text style={[styles.banner, styles.warning]}>
          No answer yet. Checking whether your claim went through…
        </Text>
      ) : null}
      {isUnknown ? (
        <View style={[styles.banner, styles.warning]}>
          <Text style={styles.bannerTitle}>We couldn&apos;t confirm your claim</Text>
          <Text style={styles.bannerText}>{UNKNOWN_EXPLANATION}</Text>
        </View>
      ) : null}
      {submission.kind === 'rejected' ? (
        <Text style={[styles.banner, styles.danger]}>Claim not created: {submission.message}</Text>
      ) : null}

      <AppButton label={isUnknown ? 'Check again' : 'Confirm claim'} onPress={onConfirm} loading={isBusy} />
      {isUnknown ? (
        <AppButton label="Back to balances" variant="secondary" onPress={onLeave} />
      ) : (
        <AppButton label="Edit" variant="secondary" onPress={onEdit} disabled={isBusy} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  destination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  muted: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  destinationLabel: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.text,
  },
  banner: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
    fontSize: fontSize.sm,
  },
  warning: {
    backgroundColor: colors.warningSoft,
    color: colors.warning,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
  },
  bannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.warning,
  },
  bannerText: {
    fontSize: fontSize.sm,
    color: colors.warning,
  },
});
