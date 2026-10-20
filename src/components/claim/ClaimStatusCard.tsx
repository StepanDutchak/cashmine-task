import { StyleSheet, Text, View } from 'react-native';

import { Claim } from '@/api/schemas';
import { Amount } from '@/components/ui/Amount';
import { Card } from '@/components/ui/Card';
import { DetailRow } from '@/components/ui/DetailRow';
import { colors, fontSize, fonts, radius, spacing } from '@/theme/tokens';

import { ClaimTimeline } from './ClaimTimeline';

const HEADLINE = {
  pending: 'Your claim is on its way',
  completed: 'Claim completed',
  failed: 'Claim failed',
} as const;

const SUBLINE = {
  pending: "You can leave this screen. We'll keep checking.",
  completed: 'The payout has been sent.',
  failed: 'The amount is back in your available balance.',
} as const;

export const ClaimStatusCard = ({ claim }: { claim: Claim }) => {
  const isFailed = claim.status === 'failed';
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headline}>{HEADLINE[claim.status]}</Text>
        <Text style={styles.subline}>{SUBLINE[claim.status]}</Text>
      </View>
      <Card>
        <ClaimTimeline claim={claim} />
        {claim.failureReason ? <Text style={styles.failure}>{claim.failureReason}</Text> : null}
      </Card>
      <Card>
        <DetailRow label="Claimed" value={<Amount value={claim.amount} asset={claim.asset} size="sm" />} />
        <DetailRow label="Fee" value={<Amount value={`−${claim.fee}`} asset={claim.asset} size="sm" />} />
        <DetailRow
          label={isFailed ? 'Not received' : 'You receive'}
          value={
            <Amount value={claim.receiveAmount} asset={claim.asset} size="md" tone={isFailed ? 'default' : 'positive'} />
          }
        />
        <DetailRow label="Claim ID" value={claim.id} />
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  subline: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  failure: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
});
