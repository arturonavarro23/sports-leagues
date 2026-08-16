export const STORAGE_KEYS = {
  language: 'league-list:language:v1',
  theme: 'league-list:theme:v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
