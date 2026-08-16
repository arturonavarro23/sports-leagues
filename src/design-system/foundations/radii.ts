export const radii = {
  control: '0.5rem',
  card: '0.75rem',
  pill: '9999px',
} as const;

export type RadiusToken = keyof typeof radii;
export type RadiusValue = (typeof radii)[RadiusToken];
