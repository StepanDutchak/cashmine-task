export const queryKeys = {
  balances: ['balances'] as const,
  claimOptions: (asset: string) => ['claimOptions', asset] as const,
  claim: (claimId: string) => ['claim', claimId] as const,
  activity: ['activity'] as const,
};
