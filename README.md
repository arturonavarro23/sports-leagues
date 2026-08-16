# Sports Leagues

A responsive single page application that lists sports leagues from
TheSportsDB, filters them by name and sport, and shows a season badge for the
selected league. English and Spanish, light and dark.

## Running it

```bash
npm install
npm run dev        # live API
npm run dev:mock   # bundled multi-sport dataset
```

Both serve on <http://localhost:5173>.

## About the data source

TheSportsDB's free tier returns five leagues from `all_leagues.php`, all Soccer,
and omits `strLeagueAlternate`:

```console
$ curl -s "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
{"leagues":[{"idLeague":"4328","strLeague":"English Premier League","strSport":"Soccer"}, …]}
```

Two required features depend on data that response no longer carries:

- **Displaying `strLeagueAlternate`**, one of the three fields the brief asks
  for alongside `strLeague` and `strSport`. The key is absent from the payload,
  so the row would never render.
- **Filtering by sport**, which the brief illustrates with "Soccer, Basketball,
  Motorsport". All five leagues returned are Soccer, so the dropdown has one
  option and filtering changes nothing.

Neither can be demonstrated, or meaningfully tested, against the live API.

**Alternate names.** `lookupleague.php?id=<id>` still returns the field, and it
is keyed by the same `idLeague` the list already provides, so the join is exact.
It is fetched when a league is selected, in parallel with the badge request —
neither consumes the other's result, so there is no waterfall.
`search_all_leagues.php` also returns the field but was rejected as a source: it
serves a set of leagues that does not overlap with `all_leagues.php`, so merging
the two would have produced a list where some rows can never have alternate
names because they are simply different leagues.

The values themselves are dirty — a comma-separated string with trailing
whitespace, empty strings rather than nulls, and truncated entries. The mapper
splits, trims, drops empties and dedupes, so the UI only ever receives a clean
`string[]` and search can match an alias without parsing anything.

**MSW.** It was already a dependency for tests, so making it serve the
application costs nothing extra and solves the demonstrability problem:
`npm run dev:mock` provides 13 leagues across 7 sports, alternate names, a
league with none, long names for wrapping, and one league per badge failure
mode. The same handlers back the app, the Vitest suite and Storybook, so a
fixture cannot drift and make a story pass while a test fails. It is opt-in
rather than the default, which keeps the real integration honest, and the worker
is loaded behind a build-time flag so none of it reaches production.

## Routes

| Route         | Result                                             |
| ------------- | -------------------------------------------------- |
| `/en/leagues` | English                                            |
| `/es/leagues` | Spanish                                            |
| `/`           | Redirects: saved locale → browser locale → English |
| `/es/ligas`   | Not Found — the slug is never translated           |

Switching language rewrites only the locale segment, so the query string
survives:

```
/en/leagues?search=premier&sport=Soccer&league=4328
/es/leagues?search=premier&sport=Soccer&league=4328
```

Search, sport and selected league live in the query string; the locale lives in
the pathname; the theme lives in a store and never touches the URL.

## Scripts

| Command                                 | What it does                                 |
| --------------------------------------- | -------------------------------------------- |
| `npm run dev` / `dev:mock`              | Dev server, live API or mock dataset         |
| `npm run build` / `preview`             | Production build, then serve it              |
| `npm test` / `test:coverage`            | Unit and integration tests                   |
| `npm run test:storybook`                | Storybook interaction tests (needs Chromium) |
| `npm run storybook`                     | Storybook on port 6006                       |
| `npm run lint` / `typecheck` / `format` | Quality gates                                |

## Stack

React 19, TypeScript, Vite, Tailwind v4, React Router v8, TanStack Query,
Zustand, i18next, Vitest, Testing Library, MSW, Storybook, ESLint with
`jsx-a11y`, Prettier.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — layers, dependency rules, state ownership
- [AI usage](AI-USAGE.md) — tools used and decisions taken
- [ADRs](docs/adr/) — decisions and their trade-offs

Copy `.env.example` to `.env` to override the API base URL or force mock mode.
