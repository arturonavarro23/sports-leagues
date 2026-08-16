# 8. Locale in the pathname, theme in the store

Status: accepted

## Context

Two user preferences were added at the same time. They look similar and are
routinely stored the same way, but they answer different questions.

The locale answers "what does this page say", which is a property of the page.
The theme answers "how does this device render", which is a property of the
reader's environment.

## Decision

The locale lives in the pathname (`/en/leagues`, `/es/leagues`). The theme lives
in Zustand and never appears in the URL.

The route slug is not translated: `/es/ligas` does not exist.

## Rationale

A locale in the URL makes a page shareable in a specific language, survives
reload, and gets back/forward for free because the router already tracks
history. A theme in the URL would mean a reader who prefers dark mode sends a
link that forces dark mode on the recipient, which is the reader's preference
leaking into someone else's device.

Keeping the slug in English means the only difference between the two localized
URLs is one segment, so switching language is a rewrite of that segment and
nothing else — the entire query string, and therefore the reader's filters and
selected league, survive untouched. A translated slug would also mean every new
locale invents new routes to maintain.

`localStorage` still remembers the locale, but only to answer one question:
which language to redirect to from `/`. A valid pathname always wins over it, so
a shared link is never overridden by the recipient's saved preference.

## Dropping the 'system' theme option

The theme was first built as `'light' | 'dark' | 'system'`, with a select and a
live `matchMedia` subscription. It was reduced to a two-state toggle on the
project owner's decision.

What was kept: with nothing stored, the initial theme is still resolved from
`prefers-color-scheme`, so a first visit respects the operating system.

What was lost, stated plainly: the app no longer follows the operating system
after the reader toggles once, and there is no way to return to "follow the
system" short of clearing storage. A two-state switch cannot express three
states, so this is inherent to the control, not an implementation gap.

`role="switch"` is used rather than a checkbox or a radiogroup because the
control is genuinely binary.

## Consequences

- `SupportedLocale` and `ROUTE_SEGMENTS` are the only place route strings live.
- `useLeagueFilters` still owns the query string; the locale segment is owned by
  the router helpers. Neither knows about the other.
- The theme's pre-React initialization duplicates the storage key in plain JS in
  `index.html`, because it must run before any module loads. The duplication is
  commented at both sites.
