# CashMine: payback balances and claims

**Live:** https://cashmine-task.vercel.app (built for a phone screen, about 390 px wide)

On first open the app asks for your API token. It is kept only in this browser and can be changed with **Change token** on the Home screen.

## Run locally

```bash
npm install
npx expo start --web
```

```bash
npm test
```

```bash
npm run typecheck
```

The token is never read from env or bundled. The app asks for it at runtime. The API base URL is in [`src/config/api.ts`](src/config/api.ts).

## What works

- **Balances (Home):** available, pending and claiming per asset; the available total in USD (with pending and claiming totals); how fresh the snapshot is, from the server's `asOf`, with a warning when it is older than 60 s; auto refresh every 15 s and a Refresh button; skeleton, error with retry, and empty states.
- **Claim:** pick an asset, enter an amount or tap **Max**, choose a destination (no default when there is more than one), see the fee and the amount you receive, review, then confirm. The input is validated against the API rules: format, decimals, minimum, available, and the fee must be covered.
- **Claim tracking:** a status screen polls until the claim completes or fails, and shows the failure reason. Assets on Home show **Claim in progress** or **Last claim failed**.
- **Safe retries:** each claim attempt gets one Idempotency-Key for one exact request. Timeouts, network errors and 5xx responses are retried with the same key, so a claim can never be created twice. An attempt whose result is still unknown survives navigation and reloads.
- **Activity:** a paginated history of accruals, reversals and claims.
- **Tests:** 53 unit tests for amount parsing, validation, fee, USD totals and the balance-after-claim logic (`src/money/__tests__`, `src/claims/__tests__`).

Decisions, the AI workflow and known issues are in [NOTES.md](NOTES.md). AI conversations are in [`ai-logs/`](ai-logs/).

## Structure

```
src/app         routes only (Home, claim/[asset], claims/[id], activity)
src/api         fetch client, zod schemas, endpoints, errors, query keys
src/money       bigint amount logic (pure, unit tested)
src/claims      idempotent attempts, in-flight claim tracking, submission state
src/hooks       TanStack Query hooks
src/components  UI (shared kit in components/ui)
src/theme       design tokens
```
