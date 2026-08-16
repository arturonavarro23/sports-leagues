export const breakpoints = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;

export type BreakpointToken = keyof typeof breakpoints;
export type BreakpointValue = (typeof breakpoints)[BreakpointToken];
