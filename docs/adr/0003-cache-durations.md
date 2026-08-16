# 3. Cache durations are set by staleTime, not gcTime

Status: accepted, with the persistence section superseded by
[ADR 0007](0007-persisting-the-query-cache-to-indexeddb.md)

## Context

The assignment requires that responses be cached to avoid repeat calls. React
Query exposes two independent knobs and they are easy to conflate:

- `staleTime` — how long data is considered fresh, so no refetch is issued.
- `gcTime` — how long an entry with **no observers** survives in memory before
  it is evicted.

The cache is in-memory. It does not survive a page reload unless a persister is
added, so large `gcTime` values buy nothing on a normal visit.

## Decision

| Query          | `staleTime` | `gcTime` |
| -------------- | ----------- | -------- |
| `leagues`      | 10 min      | 20 min   |
| `seasonBadge`  | `Infinity`  | 60 min   |
| `leagueDetail` | `Infinity`  | 120 min  |

## Rationale

`staleTime: Infinity` on the badge and detail queries is what actually satisfies
the requirement: once fetched, selecting the same league again never issues a
second request. Season badges and a league's alternate names are historical
facts, so there is nothing to revalidate.

`gcTime` still matters here, but for a narrower reason. The badge query is only
observed while its league is selected. Deselecting leaves the entry without
observers and starts the eviction countdown, so the default of 5 minutes would
cause a refetch when a user returns to a league ten minutes later. An hour
covers realistic re-selection within a session.

`leagueDetail` is given the longest `gcTime` because its payload is the most
stable of the three.

The league list keeps a shorter `staleTime` (10 min) than its `gcTime` (20 min)
on purpose. The two answer different questions: after 10 minutes the list is
considered stale, so the next mount revalidates it in the background while the
cached copy renders immediately; `gcTime` only decides how long that cached copy
survives without observers. Keeping `gcTime` above `staleTime` is what makes the
revalidation invisible — the stale copy is still there to paint while the
refetch runs.

Values in the range of days were considered and rejected. They cannot outlive a
reload, and within a long-lived tab they only accumulate every detail object the
user ever opened.

## The rate limit does not arrive as an error status

Worth recording because it cost real debugging time: when TheSportsDB throttles
a client it answers **HTTP 200 with a plain-text body**, not 429 and not JSON.

A repository that only checks `response.ok` therefore treats a throttled reply
as success and crashes later on `response.json()`, surfacing as a `SyntaxError`
from inside the query rather than as an API failure. The symptom is a badge that
intermittently shows its "no badge" fallback with no obvious cause, and it
cannot be reproduced in tests because MSW always answers correctly.

`getJson` now reads the body as text and parses it explicitly, throwing an
`ApiError` that carries the offending body when it is not JSON. Two tests cover
it.

This is also why the retry count is 1 rather than 2: retrying a throttled
request spends more of the same 30-per-minute budget that caused the throttling.

## Consequences

- Repeated selection of the same league is served from cache, and there is a
  test asserting the request count stays at one.
- Surviving a reload requires persistence, which was later adopted over
  IndexedDB once the documented rate limit made it worth the invalidation cost.
  See [ADR 0007](0007-persisting-the-query-cache-to-indexeddb.md).
- All durations live in `QUERY_CACHE_DURATIONS` so they cannot drift across
  hooks.
