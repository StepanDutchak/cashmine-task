# Notes

## Decisions

**Amounts.** Amounts stay decimal strings until [`src/money/amount.ts`](src/money/amount.ts), where they become a `bigint` count of the asset's smallest unit. Validation, fee, receive amount, Max and USD all use integers, and amounts go back to the API as canonical strings. A JS `number` would be wrong: this API returns ETH `12.345678901234591676`, which a float turns into `…592`, so Max would send an amount the user doesn't have. `big.js` would work, but four operations didn't justify a dependency I couldn't explain line by line. USD is display only, rounded half-up per row; the total is the sum of the rounded rows, so the screen adds up. The headline is **available**; pending (which can still be reversed) and claiming are shown separately.

**Balance right after a claim.** Before choosing, I had the AI lay out the options, and compared three:
- **A, snapshot only:** honest, but nothing changes for up to 15 s ("I claimed again").
- **B, optimistic subtract:** the next stale snapshot makes the balance jump back ("I stopped trusting the app").
- **C, chosen:** the snapshot **plus our claims it hasn't counted yet**, compared by server timestamps (`createdAt`/`updatedAt` against `asOf`, so the device clock doesn't matter). The balance moves once and stays put. A failed claim returns the amount with a "Last claim failed" badge. Tested live: after a 10 USDT claim, available dropped at once and didn't move when the next snapshot arrived.

**Unknown claim result.** One Idempotency-Key per exact request body, saved to `localStorage` before sending. A timeout, network error, 5xx or 504 means the outcome is unknown, so the app resends the same attempt automatically (with backoff and `retryAfterMs`) and shows "Checking whether your claim went through…". If it is still unknown, the only option is **Check again** with the same key; Edit is hidden, so a second claim is impossible. Reloading resumes the attempt. A final 429 is treated as unknown too, because an earlier, timed-out try in the same chain may have created the claim. Only a 4xx such as 400 discards the attempt. Tested by dropping two responses in the browser: 201, then two `Idempotent-Replayed` 200s, and exactly one claim on the server.

**Other.** The token is asked for at runtime and kept in `localStorage`. A new token remounts the app with an empty cache and clears unresolved attempts, so they can't be replayed under another account. There is no default destination when there are several. A server 400 shows its message and refreshes balances.

## Working with AI

Full log in [`ai-logs/`](ai-logs/); search for the quoted text.

- **A prompt that didn't get me what I wanted.** I put the token in `.env` and expected end-to-end UI testing. The AI wouldn't type the token into the page, because tool inputs end up in this public log. I changed the approach: I pasted the token into the app myself, and the AI drove the rest. *Search:* "I can't put it there myself".
- **AI output that was wrong or risky.** The AI's own audit found that its claim logic could double-claim: if retries ended in a 429 after an earlier timeout, the app showed Edit and allowed a new key. It was fixed and tested. *Search:* "Possible double claim". Smaller ones: a wrong test expectation, 82057 instead of 82058 cents (*search:* "82058"), and a failed claim shown as "You receive" (*search:* "misleading for a failed claim").
- **Rejecting a suggestion.** My prep plan, which the AI helped draft, put the token in an `EXPO_PUBLIC_*` env var with a README caveat. When the brief arrived, I rejected that in favour of runtime entry, because the brief forbids the token in the build. *Search:* "forbids the token in the build".

## Not done / known issues

- Claims in flight are tracked in memory: after a reload within about 15 s of a claim, the balance briefly shows the old snapshot until the next one.
- One unresolved attempt per asset. Changing the token discards it, on purpose.
- Unit tests only (66). *Next:* component tests for the claim flow under 504, 429 and 400 responses.
- The token in `localStorage` is readable by scripts on the origin; production would use a backend session.
- No pull-to-refresh on web (a Refresh button instead), no dark mode.
