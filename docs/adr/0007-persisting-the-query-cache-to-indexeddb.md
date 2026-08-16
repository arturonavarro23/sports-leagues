# 7. Persisting the query cache to IndexedDB

Status: accepted

Supersedes the "out of scope" note in
[ADR 0003](0003-cache-durations.md).

## Context

ADR 0003 established that React Query's cache is in-memory and dies on reload.
That was accepted at the time, but the API documentation states a hard
constraint that changes the calculation:

- 30 requests per minute overall,
- `all_leagues.php` limited to 10 requests on the free tier.

Every page reload spent one of those ten. The league list is also the single
most cacheable resource in the application: it is identical for every user and
changes on the order of months.

## Decision

Persist the query cache to IndexedDB with
`PersistQueryClientProvider`, an async storage persister and `idb-keyval`.

Only two query families are persisted:

| Query          | Persisted | Why                                                                                                                                  |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `leagues`      | Yes       | Large, stable, and rate limited                                                                                                      |
| `leagueDetail` | Yes       | Effectively immutable per league                                                                                                     |
| `seasonBadge`  | No        | Numerous and cheap; persisting every badge the user ever opened grows the payload without saving a request they are likely to repeat |

## Cache invalidation

Persistence is only safe if stale payloads can never deserialise into code that
no longer understands them. Two independent hazards, one mechanism:

```ts
buildCacheBuster(isMockApiEnabled); // "1-live" | "1-mock"
```

**Schema drift.** `PERSISTED_CACHE.schemaVersion` must be bumped whenever a
domain model or a mapper's output changes shape. React Query discards the whole
stored cache when the buster changes.

**Mode drift.** This is the subtler one. The mock dataset and the live API
return different data for identical query keys. Without the mode in the buster,
running `npm run dev:mock` and then `npm run dev` on the same port would hydrate
13 fabricated leagues into an application that is talking to the real API — the
UI would silently display data that does not exist. Putting the mode in the
buster makes switching discard the other mode's cache.

Verified in the browser on a single origin:

|                        | after `npm run dev` | after `npm run dev:mock` |
| ---------------------- | ------------------- | ------------------------ |
| `buster`               | `1-live`            | `1-mock`                 |
| Leagues rendered       | 5                   | 13                       |
| Sports in the dropdown | Soccer              | 7 sports                 |

A `maxAge` of 24 hours bounds how old a hydrated cache may be, independently of
the buster.

## Consequences

- A reload issues **zero** requests to `all_leagues.php`; measured with the
  Resource Timing API, the request list after a reload is empty.
- Three dependencies added: `@tanstack/react-query-persist-client`,
  `@tanstack/query-async-storage-persister`, `idb-keyval`.
- `schemaVersion` is now a maintenance obligation. A model change without a
  bump is a real bug, which is why the constant sits next to a comment saying
  so and is covered by a test asserting the buster contains it.
- Storage failures degrade gracefully: if IndexedDB is unavailable, the provider
  falls back to a normal in-memory client.
