import { useMemo } from 'react';

import { ClaimOptions } from '@/api/schemas';
import { toUnits } from '@/money/amount';
import { AssetBalance } from '@/money/balances';
import { ClaimRules } from '@/money/claimAmount';

import { useBalances } from './useBalances';
import { useClaimOptions } from './useClaimOptions';

export type ClaimSetup = {
  rules: ClaimRules;
  balance: AssetBalance;
  destinations: ClaimOptions['destinations'];
};

type ClaimSetupState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown; retry: () => void; isRetrying: boolean }
  | { status: 'unknownAsset' }
  | { status: 'ready'; setup: ClaimSetup };

const buildRules = (balance: AssetBalance, options: ClaimOptions): ClaimRules => ({
  decimals: balance.decimals,
  available: balance.available,
  minAmount: toUnits(options.minAmount, balance.decimals),
  fee: toUnits(options.fee, balance.decimals),
});

// Joins the balance snapshot (available, decimals) with the asset's claim options (min, fee).
export const useClaimSetup = (asset: string): ClaimSetupState => {
  const balancesQuery = useBalances();
  const optionsQuery = useClaimOptions(asset);
  const balance = balancesQuery.data?.balances.find((item) => item.asset === asset);
  const options = optionsQuery.data;

  const built = useMemo(() => {
    if (!balance || !options) return null;
    try {
      return { rules: buildRules(balance, options), error: null };
    } catch (error) {
      return { rules: null, error };
    }
  }, [balance, options]);

  const retry = () => {
    if (balancesQuery.isError) balancesQuery.refetch();
    if (optionsQuery.isError) optionsQuery.refetch();
  };
  const isRetrying = balancesQuery.isFetching || optionsQuery.isFetching;

  if (balancesQuery.isPending || optionsQuery.isPending) return { status: 'loading' };
  if (balancesQuery.isError && !balancesQuery.data) {
    return { status: 'error', error: balancesQuery.error, retry, isRetrying };
  }
  if (optionsQuery.isError) return { status: 'error', error: optionsQuery.error, retry, isRetrying };
  if (!balance || !options) return { status: 'unknownAsset' };
  if (!built?.rules) return { status: 'error', error: built?.error, retry, isRetrying };

  return { status: 'ready', setup: { rules: built.rules, balance, destinations: options.destinations } };
};
