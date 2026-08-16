# 4. An opt-in mock API mode backed by MSW

Status: accepted

## Context

The live free tier returns five leagues, all Soccer, with no alternate names
(see ADR 0002). Three required features are therefore not demonstrable against
it:

- the sport dropdown has exactly one option,
- `strLeagueAlternate` never renders,
- an empty search result is the only reachable empty state.

MSW is already a required dependency for tests.

## Decision

The application calls the real API by default. Setting
`VITE_ENABLE_MOCK_API=true` starts the MSW browser worker before React mounts
and serves a richer multi-sport dataset from `src/mocks/leagueFixtures.ts`.

The same handlers back the Vitest suite and Storybook, so all three consume one
fixture set.

## Rationale

Shipping a mock as the default would misrepresent what the integration does.
Shipping no mock would leave most of the UI unreachable for a reviewer.

An opt-in flag keeps the real integration honest and the demo complete, and
sharing handlers between the app, the tests and Storybook means a fixture drift
cannot make a story pass while the tests fail.

Mock startup is dynamically imported inside the flag check, so the worker code
is not part of the default bundle.

## Consequences

- `npm run dev` hits the real API and shows five Soccer leagues.
- `VITE_ENABLE_MOCK_API=true npm run dev` shows the full dataset, including
  alternate names, several sports, a league with no badge and a league whose
  badge request fails.
- The fixture set must keep matching the real DTO shape. It is typed against the
  same DTO interfaces the repository uses, so a shape change breaks compilation.
