# Notes

## Decisions

**1. How amounts are represented and calculated.** Every amount stays a decimal string until it reaches [`src/money/amount.ts`](src/money/amount.ts), where it becomes a `bigint` count of the asset's smallest unit (scaled by `decimals`). Validation, fee, receive amount, Max and USD all use integers, and amounts go back to the API as canonical strings. *Alternatives:* `number` is simply wrong for money. This API returns ETH `12.345678901234591676`, which a float turns into `…592`, so Max would send an amount the user does not have. `big.js`/`decimal.js` would work, but I only need four operations and wanted every line to be explainable. USD is display only: each row is rounded half-up to cents, and the total is the sum of the rounded rows, so the screen adds up. The headline total is **available**. Pending and claiming are shown separately, because pending can still be reversed.

**2. What the balance shows right after a claim.** I considered three options:
- **A (snapshot only):** always honest, but nothing changes for up to 15 s ("I claimed again").
- **B (optimistic subtract + refetch):** the next stale snapshot makes the balance jump back up ("I stopped trusting the app").
- **C, which I chose:** the balance shown is the snapshot **plus claims the snapshot has not counted yet**, decided by server timestamps: `createdAt > asOf` means not counted yet, and `updatedAt > asOf` means it settled after the snapshot. The number moves once, at submit, and stays put when the snapshot catches up. Failed claims add the amount back, with a "Last claim failed · amount returned" badge, and pending claims show "Claim in progress". No device clock is involved. The logic is in [`src/claims/inFlightClaims.ts`](src/claims/inFlightClaims.ts), with 12 tests. I verified it against the live API: after a 10 USDT claim, available dropped at once and did not move when the new snapshot arrived 10 s later.

**3. When the result of a claim request is unknown.** An attempt is one Idempotency-Key bound to one exact body, saved to `localStorage` *before* sending. A network error, timeout, 5xx or 504 leaves the outcome unknown, so the app automatically resends **the same attempt**, up to 4 times with backoff and respecting `retryAfterMs`, while showing "Checking whether your claim went through…". If it is still unknown, the user sees "We couldn't confirm your claim… checking again is safe" with **Check again**. Confirm and Edit are hidden, so no new key can be created. Leaving or reloading resumes the same attempt. A 4xx response means it was definitely not created, so the attempt is discarded and the user can edit. *Tested* by dropping the first two responses in the browser: 201, then two `Idempotent-Replayed` 200s, all with the same key, and exactly one claim on the server.

**Other decisions.** The token is asked for at runtime and kept in `localStorage`. A new token remounts the app with an empty cache and clears unresolved attempts, because replaying an attempt under another token would create a real claim there. A 401 anywhere returns to the token screen. When there are several destinations, there is no default, so money never goes somewhere the user did not pick. Client validation mirrors the docs, but the server stays the source of truth: a 400 shows its message and refreshes balances.

## Working with AI

Full log: [`ai-logs/`](ai-logs/). To find each moment, search the log for the quoted text.

- **A prompt that didn't get me what I wanted.** After putting the token in `.env`, I expected the AI to test the screens end to end. It refused to type the token into the page, because tool inputs end up in this public log; it only reads the token through `$CASHMINE_TOKEN` in curl. I changed my approach: I pasted the token into the app myself, and the AI drove the rest. *Search:* "I can't put it there myself".
- **AI output that was wrong or risky.** (a) The AI's own unit test expected 820.413207 × 1.0002 = 82057 cents. Running the tests and recomputing by hand showed the code's 82058 is right. *Search:* "82058". (b) The first claim status screen said "You receive 0.00098 BTC" for a **failed** claim, which is misleading money copy. This was caught during the live end-to-end test, when the server actually failed that claim. *Search:* "misleading for a failed claim". (c) The AI started the dev server with `CI=1`, which turns off reloads, so it was testing a stale bundle. The DOM (`aria-checked` null) and the Metro log exposed it. *Search:* "stale bundle".
- **Disagreeing with or rejecting a suggestion.** The first claim form pre-selected the first destination. When the real API returned two destinations (a Binance account and a wallet), I rejected that default: a payout must go only to a destination the user chose. Earlier, my own plan put the token in an `EXPO_PUBLIC_*` env var; the brief forbids that, so it was dropped in favour of runtime entry. *Search:* "no default destination".

## Not done / known issues

- In-flight claims are tracked in memory. If the page is reloaded within about 15 s of a claim, the balance briefly shows the old snapshot (option A behaviour) until the next one. *Next:* persist tracked claims per token.
- There is one unresolved attempt per asset at a time.
- Only unit tests, no component tests. *Next:* RNTL + MSW tests for the claim flow under 504, 429 and 400 responses.
- The token in `localStorage` is readable by any script on the page origin. In production it should be a backend session.
- Full-precision amounts (up to 18 decimals) can be long. *Next:* a compact display with the full value on tap.
- No pull-to-refresh on web (a Refresh button instead), no dark mode, and Activity refreshes only after claims or on reopen.
