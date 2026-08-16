export const easings = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const durations = {
  instant: '80ms',
  fast: '140ms',
  normal: '220ms',
} as const;

export type EasingToken = keyof typeof easings;
export type DurationToken = keyof typeof durations;
