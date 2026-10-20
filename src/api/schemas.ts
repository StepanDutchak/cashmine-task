import { z } from 'zod';

import { DECIMAL_PATTERN } from '@/money/amount';

const SIGNED_DECIMAL_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?$/;

const decimalString = z.string().regex(DECIMAL_PATTERN);
const signedDecimalString = z.string().regex(SIGNED_DECIMAL_PATTERN);
const isoTimestamp = z.iso.datetime();

export const balanceSchema = z.object({
  asset: z.string(),
  decimals: z.number().int().min(0),
  available: decimalString,
  pending: decimalString,
  claiming: decimalString,
  usdPrice: decimalString,
});

export const balancesResponseSchema = z.object({
  asOf: isoTimestamp,
  items: z.array(balanceSchema),
});

export const claimOptionsSchema = z.object({
  asset: z.string(),
  minAmount: decimalString,
  fee: decimalString,
  destinations: z.array(z.object({ id: z.string(), label: z.string() })),
});

export const claimStatusSchema = z.enum(['pending', 'completed', 'failed']);

export const claimSchema = z.object({
  id: z.string(),
  asset: z.string(),
  amount: decimalString,
  fee: decimalString,
  receiveAmount: decimalString,
  destinationId: z.string(),
  status: claimStatusSchema,
  failureReason: z.string().nullable(),
  createdAt: isoTimestamp,
  updatedAt: isoTimestamp,
});

export const activityItemSchema = z.object({
  id: z.string(),
  type: z.enum(['accrual', 'reversal', 'claim']),
  asset: z.string(),
  amount: signedDecimalString,
  status: z.enum(['pending', 'confirmed', 'completed', 'failed']),
  exchange: z.string().nullable(),
  createdAt: isoTimestamp,
  relatedId: z.string().nullable(),
});

export const activityPageSchema = z.object({
  items: z.array(activityItemSchema),
  nextCursor: z.string().nullable(),
});

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    field: z.string().optional(),
    retryAfterMs: z.number().optional(),
  }),
});

export type Balance = z.infer<typeof balanceSchema>;
export type BalancesResponse = z.infer<typeof balancesResponseSchema>;
export type ClaimOptions = z.infer<typeof claimOptionsSchema>;
export type ClaimStatus = z.infer<typeof claimStatusSchema>;
export type Claim = z.infer<typeof claimSchema>;
export type ActivityItem = z.infer<typeof activityItemSchema>;
export type ActivityPage = z.infer<typeof activityPageSchema>;
