# AI usage notes

## What I decided

The design was specified up front, before any AI ran:

- **A pragmatic domain-driven architecture**, with the layer split the code
  still follows: `app/` for providers, router and error boundaries;
  `design-system/` for domain-independent components and tokens;
  `domains/leagues/` for api, mappers, models, queries, hooks and components;
  `shared/` for config, constants and test helpers.
- **The state ownership model.** The URL owns search, sport and selected league;
  React Query owns remote data, loading and errors; local state owns transient
  visual state; Zustand owns genuine global preferences only. Nothing is
  duplicated across two owners, so no effect exists to keep copies in sync.
- **The layer boundaries.** External DTOs never reach the UI — repository, then
  mapper, then domain model. The design system may not depend on the domain, and
  presentational components may not fetch, touch the router, or read
  `import.meta.env`.
- **The stack**: React, TypeScript, Vite, Tailwind, React Router with
  `createBrowserRouter`, TanStack Query, Zustand, Vitest, Testing Library,
  user-event, MSW, Storybook with `addon-a11y`, react-error-boundary, ESLint
  with `jsx-a11y`, Prettier.
- **TDD as the method**: write the failing test, confirm it fails for the right
  reason, implement the minimum, refactor, then update the story. Also what
  makes a test worthless — asserting Tailwind classes, mocking the hook under
  test, or passing without exercising behaviour.
- **The component convention**: one folder per component holding the component,
  its types, its test, its story and an index.
- **Accessibility as an acceptance criterion**, not a nice-to-have: semantic
  HTML, full keyboard operation, visible focus, WCAG AA contrast, and a selected
  state that never depends on colour alone.

Decisions taken as the work went:

- **Where alternate names come from.** Recover them from `lookupleague.php` on
  selection, in parallel with the badge, rather than merging
  `search_all_leagues.php` into the list — those are different leagues, so the
  merge would have produced incoherent data.
- **Persisting the cache, and how to invalidate it.** Persist to IndexedDB given
  the API's rate limits, and make switching between live and mock mode discard
  the other mode's cache. Without that the app silently renders fabricated data.
- **Caching by volatility.** Cache each query according to how stable its data
  is, instead of one blanket policy, with the league list at 10 minutes stale
  and 20 minutes garbage collection.
- **Composition over internal dependencies.** `ErrorState` and `EmptyState` take
  an `action` node instead of importing `Button`; the leagues hooks take a
  `League[]` argument instead of importing the query hooks. Both had been
  proposed as temporary workarounds for parallel agents — I made them permanent,
  which is what keeps the filtering logic testable with a literal array.
- **Theme scope.** Light/dark only, accepting that the app stops following the
  operating system after the first toggle.
- **The delivery process itself.** Cheap models implementing against fixed
  contracts, every diff reviewed before it lands, and react-i18next over a
  hand-rolled translation layer.

## Tools I used

Claude Code (Opus 5), which I ran as a coordinator delegating implementation to
cheaper Sonnet subagents. No other AI tooling — no generated design assets, no
scaffolding beyond `npm create vite`.

## How I used them

I kept the expensive-to-reverse work out of the subagents' hands: toolchain
configuration, and the shared contracts everything else had to agree on — DTO
types, domain models, constants, storage access, MSW fixtures, test helpers.
With those fixed, I split the remaining work across six subagents, each scoped
to a disjoint set of directories so two could never edit the same file: design
system form controls, design system display components, the data layer, the
hooks, the domain components, and the app shell.

The condition I set was that no diff lands unreviewed. Cheap models are only
worth using if their output is checked, and that gate caught seven real defects:
a mapper that would attach one league's alternate names to a different league, a
cache test that passed without exercising the cache, and 420 kB of MSW shipping
in the production bundle, among others.

One of them justified a testing decision I had already made. A loading `Button`
hid its label with `visibility: hidden`, which removes the element from the
accessibility tree and left the button with no accessible name. The jsdom unit
test passed, because jsdom applies no CSS. Only axe running in real Chromium
through Storybook caught it — which is why the Storybook accessibility tests are
part of the suite rather than an afterthought.
