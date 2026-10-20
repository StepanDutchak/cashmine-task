import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ClaimAttempt, createClaimAttempt, loadUnresolvedAttempt } from '@/claims/claimAttempt';
import { toSubmissionState } from '@/claims/submissionState';
import { StateMessage } from '@/components/ui/StateMessage';
import { ClaimSetup } from '@/hooks/useClaimSetup';
import { useSubmitClaim } from '@/hooks/useSubmitClaim';
import { formatUnits, toUnits } from '@/money/amount';
import { canClaimAnything, quoteClaim, validateClaimAmount } from '@/money/claimAmount';

import { ClaimEditStep } from './ClaimEditStep';
import { ClaimReviewStep } from './ClaimReviewStep';

type ClaimFlowProps = {
  asset: string;
  setup: ClaimSetup;
};

export const ClaimFlow = ({ asset, setup }: ClaimFlowProps) => {
  const router = useRouter();
  const { rules, destinations } = setup;
  // An attempt whose outcome we never learned (timeout, reload) is resumed, never replaced.
  const [restoredAttempt] = useState(() => loadUnresolvedAttempt(asset));
  const [attempt, setAttempt] = useState<ClaimAttempt | null>(restoredAttempt);
  const [amountInput, setAmountInput] = useState(restoredAttempt?.body.amount ?? '');
  const [destinationId, setDestinationId] = useState(
    restoredAttempt?.body.destinationId ?? destinations[0]?.id ?? '',
  );
  const [showErrors, setShowErrors] = useState(false);

  const mutation = useSubmitClaim((claim) =>
    router.replace({ pathname: '/claims/[id]', params: { id: claim.id } }),
  );
  const { mutate } = mutation;
  const submission = toSubmissionState(mutation);

  useEffect(() => {
    if (restoredAttempt) mutate(restoredAttempt);
  }, [restoredAttempt, mutate]);

  if (!attempt && !canClaimAnything(rules)) {
    return (
      <StateMessage
        icon="◎"
        title="Not enough to claim yet"
        message={`You can claim from ${formatUnits(rules.minAmount, rules.decimals)} ${asset}, and the amount must cover the fee.`}
        actionLabel="Back to balances"
        onAction={() => router.back()}
      />
    );
  }

  if (destinations.length === 0) {
    return <StateMessage icon="!" title="No destination available" message={`There is nowhere to send ${asset} yet.`} />;
  }

  if (!attempt) {
    const goToReview = () => {
      setShowErrors(true);
      const result = validateClaimAmount(amountInput, rules);
      if (!result.ok) return;
      setAttempt(createClaimAttempt({ asset, amount: result.amountText, destinationId }));
    };
    return (
      <ClaimEditStep
        asset={asset}
        setup={setup}
        amountInput={amountInput}
        onAmountChange={setAmountInput}
        destinationId={destinationId}
        onDestinationChange={setDestinationId}
        showErrors={showErrors}
        onReview={goToReview}
      />
    );
  }

  const destinationLabel =
    destinations.find((destination) => destination.id === attempt.body.destinationId)?.label ??
    attempt.body.destinationId;

  return (
    <ClaimReviewStep
      attempt={attempt}
      quote={quoteClaim(toUnits(attempt.body.amount, rules.decimals), rules.fee)}
      decimals={rules.decimals}
      destinationLabel={destinationLabel}
      submission={submission}
      onConfirm={() => mutate(attempt)}
      onEdit={() => {
        mutation.reset();
        setAttempt(null);
      }}
      onLeave={() => router.back()}
    />
  );
};
