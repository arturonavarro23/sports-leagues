export const en = {
  app: {
    skipToMainContent: 'Skip to main content',
  },
  leagues: {
    title: 'Sports Leagues',
    subtitle: 'Search leagues by name and filter by sport.',
    alsoKnownAs: 'Also known as: {{names}}',
    searchLabel: 'Search leagues',
    sportLabel: 'Sport',
    allSports: 'All sports',
    resultCount_one: '{{count}} league found',
    resultCount_other: '{{count}} leagues found',
    tryAgain: 'Try again',
    empty: {
      title: 'No leagues match your filters',
      description: 'Try a different name, or choose another sport.',
    },
    error: {
      title: 'We could not load the leagues',
      description:
        'The leagues service did not respond. Check your connection and try again.',
    },
    badge: {
      alt: '{{league}} badge, {{season}} season',
      missing: 'No badge',
      error: 'Could not load badge',
    },
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist.',
    genericTitle: 'Something went wrong',
    backToLeagues: 'Back to leagues',
  },
  viewMode: {
    label: 'View',
    grid: 'Grid',
    list: 'List',
  },
  errors: {
    unexpectedTitle: 'Something went wrong',
    unexpectedMessage: 'An unexpected error occurred.',
    tryAgain: 'Try again',
    unableToLoadLeagues: 'Unable to load leagues',
  },
  language: {
    label: 'Language',
    // Endonyms: a reader looking for their language recognises it even while
    // the surrounding interface is in the other locale.
    english: 'English',
    spanish: 'Español',
  },
  theme: {
    label: 'Theme',
    darkMode: 'Dark mode',
  },
} as const;

// Widens every leaf of `en` to `string` so `es` can hold different text
// while TypeScript still enforces an identical key structure.
type DeepStringify<T> = T extends string
  ? string
  : { [K in keyof T]: DeepStringify<T[K]> };

export type TranslationResource = DeepStringify<typeof en>;
