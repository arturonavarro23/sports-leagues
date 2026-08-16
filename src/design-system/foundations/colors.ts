export const colors = {
  surfaceBase: '#101826',
  surfaceRaised: '#16202f',
  surfaceOverlay: '#1d2a3d',
  surfaceSunken: '#0b111c',

  borderSubtle: '#26344a',
  borderStrong: '#3a4b66',

  contentPrimary: '#f1f5f9',
  contentSecondary: '#a9b8cc',
  contentMuted: '#7d8ea6',
  contentInverse: '#0b1f12',

  accent: '#22c55e',
  accentStrong: '#16a34a',
  accentSoft: '#4ade80',

  danger: '#f87171',
  dangerSoft: '#fca5a5',
  focus: '#7dd3fc',
} as const;

export type ColorToken = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorToken];
