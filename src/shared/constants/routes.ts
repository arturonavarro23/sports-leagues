export const ROUTE_PATHS = {
  root: '/',
  leagues: '/leagues',
} as const;

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];
