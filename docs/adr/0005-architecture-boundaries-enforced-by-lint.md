# 5. Architecture boundaries are enforced by ESLint, not convention

Status: accepted

## Context

The architecture defines two rules that are easy to state and easy to erode:

- the design system must not depend on the leagues domain, React Query, React
  Router, repositories or Zustand;
- presentational components must not fetch, must not touch the router, and must
  not read `import.meta.env`.

Rules of this kind decay when they live only in a README, because the violation
is invisible in review until the coupling is already load bearing.

## Decision

Encode both rules as `no-restricted-imports` and `no-restricted-properties`
entries in `eslint.config.js`, scoped by file path:

- `src/design-system/**` may not import `@/domains/*`.
- `src/design-system/**` and `src/domains/*/components/**` may not import
  `react-router`, `@tanstack/react-query`, `zustand`, or anything under
  `**/api/**` or `**/queries/**`, and may not read `import.meta`.

Test and story files are exempt, since a story legitimately wires a component to
a mocked provider.

## Rationale

A violation now fails `npm run lint` with a message naming the intended fix,
which is cheaper than catching it in review and far cheaper than catching it
after the coupling spreads.

Scoping by glob rather than by package keeps the boundary declarative: moving a
component into `design-system/` automatically subjects it to the stricter rule.

ESLint was kept over Biome and oxlint specifically because this project already
depends on `eslint-plugin-jsx-a11y` and `eslint-plugin-storybook`. Biome does
support pattern-based import restrictions, so the boundary rules are portable if
the toolchain is ever swapped; `eslint-plugin-storybook` has no equivalent.

## Consequences

- `src/shared/config/env.ts` is the single module that reads `import.meta.env`.
  Everything else imports typed values from it.
- Data reaches presentational components only as props, passed down by a page or
  container.
- Adding a legitimate exception requires editing the lint config, which makes
  the exception visible in the diff.
