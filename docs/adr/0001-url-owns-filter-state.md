# 1. The URL owns search, sport and selected league

Status: accepted

## Context

Four candidate owners exist for state in this application: the URL, React Query,
local React state and Zustand. Search text, the sport filter and the selected
league are all things a user would reasonably expect to survive a refresh and to
be shareable as a link.

## Decision

Search, sport and selected league live in the URL and nowhere else:

```
/leagues?search=premier&sport=Soccer&league=4328
```

`useSearchParams` and the parameter names are encapsulated inside
`useLeagueFilters`. No component imports the router or knows a parameter name.

Ownership elsewhere:

| Concern                                                                  | Owner             |
| ------------------------------------------------------------------------ | ----------------- |
| Search, sport, selected league                                           | URL               |
| Leagues, badge, league detail, loading and remote errors, caching, dedup | React Query       |
| Transient visual state (uncommitted input text)                          | Local React state |
| Genuine global client preferences                                        | Zustand           |

## Rationale

Putting filters in the URL makes deep links, refresh and browser back/forward
work with no extra code, because the router already tracks history.

Mirroring the same values into Zustand or `useState` would create two sources of
truth that must be synchronised with an effect. That synchronisation is the
usual source of stale-filter bugs, and it is avoided entirely by not
duplicating.

Zustand keeps only preferences that are neither remote data nor addressable
state. Anything already in the URL or in React Query is deliberately absent.

## Consequences

- The debounced search input keeps its own uncommitted text in local state while
  typing, and writes to the URL with `replace: true` so a single search does not
  push one history entry per keystroke.
- Sport and league selection use push navigation, because they are discrete user
  intents that should be undoable with the back button.
- Clearing a value removes the parameter instead of leaving `?search=&sport=all`.
- Any component needing a filter receives it through props from the page.

## Filtering happens on the client because the API offers nothing else

Probed against the live API:

| Request                                     | Result                                                        |
| ------------------------------------------- | ------------------------------------------------------------- |
| `all_leagues.php?s=premier`                 | Parameter ignored, full list returned                         |
| `all_leagues.php?limit=2`                   | Parameter ignored, full list returned                         |
| `all_leagues.php?page=2`                    | Parameter ignored, full list returned                         |
| `search_all_leagues.php?l=Premier`          | `{"countries":"Invalid name passed"}`                         |
| `searchleagues.php?l=Premier`               | Endpoint does not exist                                       |
| `search_all_leagues.php?s=Soccer&c=England` | Works, but filters by sport and country, never by league name |

There is no league-name search and no pagination. `all_leagues.php` returns the
entire collection in a single response and ignores every query parameter, so
client-side filtering is not a shortcut — it is the only available strategy, and
it is the right one: fetch once, cache with a long `staleTime`, filter in
memory.

One consequence worth stating plainly, because the name suggests otherwise: the
search debounce does **not** save network requests, since typing issues none. It
exists only to keep per-keystroke filtering work off the critical path.

## Changing the sport clears the selected league

`setSport` deletes the `league` parameter. Without it, narrowing to a sport the
selected league does not belong to would leave a league id in the URL whose card
is no longer in the list — a detail panel describing something the user cannot
see.

The precise rule would be "clear only if the selection left the filtered set",
but `useLeagueFilters` deliberately has no access to the league data, and
recovering it there would either couple the URL hook to a query or require an
effect that watches the filtered list and writes back to the URL. That
write-back is exactly the state synchronisation this architecture avoids.

The cost is that narrowing from "All sports" to the selected league's own sport
also clears the selection, which is stricter than necessary. That was accepted
in exchange for keeping the URL hook free of data dependencies.
