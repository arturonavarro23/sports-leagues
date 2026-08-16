# 6. Components receive slots, not internal dependencies

Status: accepted

## Context

Two places invited a hard internal dependency:

- `ErrorState` and `EmptyState` both render a call to action, which is usually a
  button. The obvious implementation imports `Button` from the design system.
- The leagues hooks (`useFilteredLeagues`, `useLeagueSelection`) operate on
  league data, which is produced by the query hooks. The obvious implementation
  imports `useLeaguesQuery`.

## Decision

Neither dependency is allowed.

`ErrorState` and `EmptyState` expose `action?: ReactNode`. The caller passes the
control it wants.

The leagues hooks take data as an argument. `useFilteredLeagues(leagues, ...)`
receives a `League[]`; it never fetches. The page composes the query layer and
the derivation layer.

## Rationale

`ErrorState` importing `Button` would fix the action to one component and one
variant. A caller needing a link, two buttons, or no action at all would have to
either fork the component or add props that only exist to configure something it
should not have owned. A `ReactNode` slot costs nothing and supports all of
those.

The hooks case is stronger. A hook that fetches its own data can only be tested
by standing up a QueryClient and mocking the network, and it cannot be reused
against data from anywhere else. Taking `League[]` as a parameter makes the
filtering logic a pure function of its inputs, testable with a literal array.

Both rules also keep the dependency graph a DAG with no cycles between sibling
modules, which is what let the components and the hooks be built in parallel
without either blocking on the other.

## Consequences

- Pages and containers carry the wiring. That is their job.
- `ErrorState`'s stories and tests pass a plain `<button>`, so the component's
  test suite does not fail when the design system's `Button` changes.
- This is a permanent contract, not a temporary scaffold. Wiring `Button` into
  `ErrorState` later would be a regression, not a cleanup.
