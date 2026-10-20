import { request } from './client';
import {
  ActivityPage,
  BalancesResponse,
  Claim,
  ClaimOptions,
  activityPageSchema,
  balancesResponseSchema,
  claimOptionsSchema,
  claimSchema,
} from './schemas';

export const ACTIVITY_PAGE_SIZE = 20;

export type CreateClaimBody = {
  asset: string;
  amount: string;
  destinationId: string;
};

export const fetchBalances = (token: string): Promise<BalancesResponse> =>
  request('/v1/balances', balancesResponseSchema, { token });

export const fetchClaimOptions = (token: string, asset: string): Promise<ClaimOptions> =>
  request(`/v1/claim-options?asset=${encodeURIComponent(asset)}`, claimOptionsSchema, { token });

export const createClaim = (
  token: string,
  body: CreateClaimBody,
  idempotencyKey: string,
): Promise<Claim> =>
  request('/v1/claims', claimSchema, {
    token,
    method: 'POST',
    body,
    headers: { 'Idempotency-Key': idempotencyKey },
  });

export const fetchClaim = (token: string, claimId: string): Promise<Claim> =>
  request(`/v1/claims/${encodeURIComponent(claimId)}`, claimSchema, { token });

export const fetchActivity = (token: string, cursor: string | null): Promise<ActivityPage> => {
  const params = new URLSearchParams({ limit: String(ACTIVITY_PAGE_SIZE) });
  if (cursor) params.set('cursor', cursor);
  return request(`/v1/activity?${params.toString()}`, activityPageSchema, { token });
};
