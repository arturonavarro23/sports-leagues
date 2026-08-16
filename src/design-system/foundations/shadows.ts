export const shadows = {
  card: '0 1px 2px rgb(0 0 0 / 0.35)',
  raised: '0 8px 24px -12px rgb(0 0 0 / 0.6)',
} as const;

export type ShadowToken = keyof typeof shadows;
export type ShadowValue = (typeof shadows)[ShadowToken];
