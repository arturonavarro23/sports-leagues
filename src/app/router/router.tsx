import { createBrowserRouter, type RouteObject } from 'react-router';
import { ROUTE_PATHS } from '@/shared/constants/routes';
import { ROUTE_SEGMENTS } from '@/shared/constants/locales';
import { RouteErrorElement } from '@/app/errors/RouteErrorElement';
import { NotFoundRoute } from '@/app/errors/NotFoundRoute';
import { RootRedirect } from '@/app/router/RootRedirect';
import { LocaleLeaguesRoute } from '@/app/router/LocaleLeaguesRoute';
import { localeLeaguesLoader } from '@/app/router/localeLeaguesLoader';
import { LeaguesRoute } from '@/app/router/LeaguesRoute';
import { LocaleRootRedirect } from '@/app/router/LocaleRootRedirect';

export const routeConfig: RouteObject[] = [
  {
    path: ROUTE_PATHS.root,
    element: <RootRedirect />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: ROUTE_PATHS.leagues,
    element: <RootRedirect />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: '/:locale',
    element: <LocaleRootRedirect />,
    errorElement: <RouteErrorElement />,
  },
  {
    path: `/:locale/${ROUTE_SEGMENTS.leagues}`,
    element: <LocaleLeaguesRoute />,
    loader: localeLeaguesLoader,
    errorElement: <RouteErrorElement />,
    children: [{ index: true, element: <LeaguesRoute /> }],
  },
  {
    path: '*',
    element: <NotFoundRoute />,
  },
];

export const router = createBrowserRouter(routeConfig);
