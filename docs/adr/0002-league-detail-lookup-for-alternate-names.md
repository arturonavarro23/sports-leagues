# 2. Fetch league detail on selection to recover alternate names

Status: accepted

## Context

The assignment requires displaying three fields per league: `strLeague`,
`strSport` and `strLeagueAlternate`, sourced from the All Leagues endpoint:

```
https://www.thesportsdb.com/api/v1/json/3/all_leagues.php
```

That endpoint no longer returns the third field. Verified against the live API:

```json
{
  "leagues": [
    {
      "idLeague": "4328",
      "strLeague": "English Premier League",
      "strSport": "Soccer"
    }
  ]
}
```

The response carries exactly three keys — `idLeague`, `strLeague`, `strSport`.
`strLeagueAlternate` is absent, not null. The free tier also caps the list at
five leagues, all of them Soccer, which additionally reduces the sport filter to
a single option.

Two other endpoints on the same free key do return the field:

| Endpoint                           | Returns `strLeagueAlternate` | Notes                                                                                 |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `all_leagues.php`                  | No                           | 5 leagues, Soccer only                                                                |
| `search_all_leagues.php?s=<sport>` | Yes                          | 5 leagues per sport, a **different** set (Albanian Superliga, Andorran 1a Divisió, …) |
| `lookupleague.php?id=<id>`         | Yes                          | Single league by id, e.g. `"Premier League, EPL, England"`                            |

## Decision

Keep `all_leagues.php` as the source for the list, and fetch
`lookupleague.php?id=<id>` when a league is selected, in parallel with the
season badge request.

## Rationale

`search_all_leagues.php` was rejected as a source for the list. It returns a set
of leagues that does not overlap with `all_leagues.php` — merging the two would
produce a list where some rows have alternate names and others cannot, because
they are simply different leagues. That is incoherent data, not enrichment.

`lookupleague.php` is keyed by the same `idLeague` the list already provides, so
the join is exact. The request is only issued for a league the user actually
selected, which bounds the cost at one request per selection instead of one per
row.

The two selection-triggered requests — badge and detail — are independent and
are issued in parallel. Neither consumes the other's result, so there is no
async waterfall.

## Consequences

- Alternate names appear in the selected league's detail, not in every list row.
  Against the live API the list cannot show them at all, because the data does
  not exist there.
- `League.alternateNames` is still modelled as `string[]` and the list renders it
  when present, so the mock dataset and any future API restoration work without
  a code change.
- One extra query hook, cache entry and error state to maintain.
- A failed detail request must not break the badge or the list; it degrades to
  hiding the alternate names row.

## Data quality note

`strLeagueAlternate` is a single comma-separated string, and the live values are
dirty:

| League                     | Value                                               |
| -------------------------- | --------------------------------------------------- |
| English Premier League     | `"Premier League, EPL, England"`                    |
| Austrian ICE Hockey League | `"bet-at-home ICE Hockey League "` (trailing space) |
| Australian NBL             | `""` (empty string, not null)                       |
| Australian WNBL            | `"Women"` (truncated)                               |

This is why the domain model exposes `alternateNames: string[]` rather than the
raw string. `parseAlternateNames` splits on commas, trims, drops empties and
dedupes, so no component ever receives `""` or stray whitespace, and search can
match an alias without parsing logic in the UI.
