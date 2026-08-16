# Architecture

## Layers

```
TheSportsDB API
  → repository        api/leaguesRepository.ts     returns raw DTOs
  → DTO               api/leagues.dto.ts           external shape, never leaves the domain
  → mapper            mappers/*.ts                 pure DTO → domain translation
  → domain model      models/league.ts             League, LeagueDetail, SeasonBadge
  → query hook        queries/*.ts                 React Query: cache, dedup, loading, errors
  → page              pages/LeaguesPage.tsx        composition and orchestration
  → component         components/*                 props in, callbacks out
```

The UI never sees a DTO. A field renamed by TheSportsDB changes one mapper, not
a component tree.

## Directory map

```
src/
  app/              providers, router, error boundaries, App
  design-system/    foundations (tokens) + domain-independent components
  domains/leagues/  api, mappers, models, queries, hooks, utils, components,
                    pages, stores, constants
  shared/           config, constants, test helpers, cn
  mocks/            MSW handlers and fixtures shared by app, tests and Storybook
```

## Dependency rules

The design system may not import the leagues domain, React Query, React Router,
repositories or Zustand. The leagues domain may import the design system. Both
rules are enforced by `no-restricted-imports` in `eslint.config.js`, not by
convention — see ADR 0005.

Presentational components additionally may not fetch, touch the router, or read
`import.meta.env`. `src/shared/config/env.ts` is the only module that reads the
environment.

## State ownership

| Concern                        | Owner             | Why                                                |
| ------------------------------ | ----------------- | -------------------------------------------------- |
| Search, sport, selected league | URL               | Shareable, survives refresh, back/forward is free  |
| Active locale                  | URL pathname      | Addressable, and back/forward changes the language |
| Leagues, badge, league detail  | React Query       | Caching, dedup, loading and error states           |
| Uncommitted input text         | Local React state | Transient, never leaves the component              |
| View mode, theme preference    | Zustand           | Global, not remote, not addressable                |

The locale is deliberately **not** in Zustand: it is addressable, so the URL
owns it and `localStorage` only remembers it to resolve the redirect from `/`.
The theme is the opposite case — it is a device preference, not something a
shared link should carry — so Zustand owns it and the URL never mentions it.

Nothing is duplicated across two owners, so no effect exists to keep two copies
in sync. See ADR 0001.

`useSearchParams` and the parameter names are encapsulated in
`useLeagueFilters`. No component knows a parameter name.

## Hooks

Small and composable rather than one page-sized hook:

| Hook                                                               | Responsibility                                |
| ------------------------------------------------------------------ | --------------------------------------------- |
| `useLeagueFilters`                                                 | The only owner of the URL search params       |
| `useLeagueSelection`                                               | Selected league, built on the param primitive |
| `useFilteredLeagues`                                               | Pure derivation over a `League[]` argument    |
| `useSportOptions`                                                  | Pure derivation of the sport dropdown options |
| `useDebouncedValue`                                                | Keeps keystroke work off the URL              |
| `useLeaguesQuery` / `useSeasonBadgeQuery` / `useLeagueDetailQuery` | Remote state                                  |

## Request flow on selection

Selecting a league issues the badge lookup and the league detail lookup
**in parallel**. Neither consumes the other's result, so there is no waterfall.
Neither fires at all before a league is selected (`enabled` guard).

## Error handling

Layered, with distinct responsibilities:

| Boundary                 | Catches                                                  |
| ------------------------ | -------------------------------------------------------- |
| `AppErrorBoundary`       | Unexpected render errors anywhere                        |
| Router `errorElement`    | Routing failures and unknown routes                      |
| `QueryErrorBoundary`     | Domain render errors, and resets failed queries on retry |
| Local query error states | Expected API failures (loading / error / empty / retry)  |

Expected remote states are represented explicitly rather than thrown. A failed
badge request degrades to a local fallback inside a fixed-size container: it
does not crash the list and does not shift layout.

There is deliberately no boundary per card.

## Selected state

Selection is signalled three ways, none of which is colour alone:

- `aria-pressed` on the card's button, for assistive technology,
- a ring plus a border-width change on the surface, which is a geometric
  difference and therefore survives greyscale — verified by rendering the page
  under a `grayscale(1)` filter,
- `data-selected` on the surface, which is what the tests assert rather than
  Tailwind class strings.

A "Selected" text label was tried and removed: the ring and `aria-pressed`
already satisfy the requirement, and the label consumed space in the card
header for a third redundant signal.
