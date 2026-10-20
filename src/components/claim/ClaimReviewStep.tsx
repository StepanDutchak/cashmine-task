import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ClaimAttempt } from '@/claims/claimAttempt';
import { SubmissionState } from '@/claims/submissionState';
import { Amount } from '@/components/ui/Amount';
import { AppButton } from '@/components/ui/AppButton';
import { DetailRow } from '@/components/ui/DetailRow';
import { Perforation } from '@/components/ui/Perforation';
import { Screen } from '@/components/ui/Screen';
import { formatUnits } from '@/money/amount';
import { ClaimQuote } from '@/money/claimAmount';
import { colors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

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

  const footer = (
    <>
      <AppButton label={isUnknown ? 'Check again' : 'Confirm claim'} onPress={onConfirm} loading={isBusy} />
      {isUnknown ? (
        <AppButton label="Back to balances" variant="ghost" onPress={onLeave} />
      ) : (
        <AppButton label="Edit" variant="ghost" onPress={onEdit} disabled={isBusy} />
      )}
    </>
  );

  return (
    <Screen footer={footer}>
      <View style={styles.receipt}>
        <Text style={styles.eyebrow}>You're claiming</Text>
        <Amount value={formatUnits(quote.amount, decimals)} asset={asset} size="xl" />
        <Perforation />
        <DetailRow label="Fee" value={<Amount value={`−${formatUnits(quote.fee, decimals)}`} asset={asset} size="sm" />} />
        <DetailRow label="To" value={destinationLabel} />
        <Perforation />
        <Text style={styles.eyebrow}>You receive</Text>
        <Amount value={formatUnits(quote.receive, decimals)} asset={asset} size="xl" tone="positive" />
      </View>

      {submission.kind === 'checking' ? (
        <View style={[styles.banner, styles.warning]}>
          <Ionicons name="hourglass-outline" size={18} color={colors.warning} />
          <Text style={[styles.bannerText, styles.warningText]}>
            No answer yet. Checking whether your claim went through…
          </Text>
        </View>
      ) : null}
      {isUnknown ? (
        <View style={[styles.banner, styles.warning]}>
          <Ionicons name="help-circle-outline" size={18} color={colors.warning} />
          <View style={styles.bannerBody}>
            <Text style={[styles.bannerTitle, styles.warningText]}>We couldn&apos;t confirm your claim</Text>
            <Text style={[styles.bannerText, styles.warningText]}>{UNKNOWN_EXPLANATION}</Text>
          </View>
        </View>
      ) : null}
      {submission.kind === 'rejected' ? (
        <View style={[styles.banner, styles.danger]}>
          <Ionicons name="close-circle-outline" size={18} color={colors.danger} />
          <Text style={[styles.bannerText, styles.dangerText]}>Claim not created: {submission.message}</Text>
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  receipt: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  eyebrow: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  banner: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  bannerBody: {
    flex: 1,
    gap: spacing.xs,
  },
  warning: {
    backgroundColor: colors.warningSoft,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  bannerTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: fontSize.sm,
  },
  bannerText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  warningText: {
    color: colors.warning,
  },
  dangerText: {
    color: colors.danger,
  },
});
