import { z } from 'zod';

import { API_BASE_URL } from '@/config/api';

import { ApiError } from './errors';
import { apiErrorBodySchema } from './schemas';

const REQUEST_TIMEOUT_MS = 15_000;
const MS_PER_SECOND = 1000;

type RequestOptions = {
  token: string;
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
};

const parseRetryAfterHeader = (response: Response): number | undefined => {
  const seconds = Number(response.headers.get('Retry-After'));
  return Number.isFinite(seconds) && seconds > 0 ? seconds * MS_PER_SECOND : undefined;
};

const toHttpError = (response: Response, body: unknown): ApiError => {
  const parsed = apiErrorBodySchema.safeParse(body);
  const details = parsed.success ? parsed.data.error : undefined;
  return new ApiError({
    kind: 'http',
    status: response.status,
    code: details?.code,
    message: details?.message ?? `Request failed with status ${response.status}`,
    field: details?.field,
    retryAfterMs: details?.retryAfterMs ?? parseRetryAfterHeader(response),
  });
};

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const request = async <T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions,
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const hasBody = options.body !== undefined;

  let response: Response;
  let body: unknown;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${options.token}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    body = await readJson(response);
  } catch {
    const kind = controller.signal.aborted ? 'timeout' : 'network';
    throw new ApiError({ kind, message: kind === 'timeout' ? 'Request timed out' : 'Network error' });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) throw toHttpError(response, body);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError({ kind: 'bad_response', status: response.status, message: parsed.error.message });
  }
  return parsed.data;
};
