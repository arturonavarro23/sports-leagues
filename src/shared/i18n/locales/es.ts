import type { TranslationResource } from './en';

export const es: TranslationResource = {
  app: {
    skipToMainContent: 'Saltar al contenido principal',
  },
  leagues: {
    title: 'Ligas Deportivas',
    subtitle: 'Busca ligas por nombre y filtra por deporte.',
    alsoKnownAs: 'También conocida como: {{names}}',
    searchLabel: 'Buscar ligas',
    sportLabel: 'Deporte',
    allSports: 'Todos los deportes',
    resultCount_one: '{{count}} liga encontrada',
    resultCount_other: '{{count}} ligas encontradas',
    tryAgain: 'Intentar de nuevo',
    empty: {
      title: 'Ninguna liga coincide con tus filtros',
      description: 'Prueba con otro nombre o elige otro deporte.',
    },
    error: {
      title: 'No pudimos cargar las ligas',
      description:
        'El servicio de ligas no respondió. Revisa tu conexión e intenta de nuevo.',
    },
    badge: {
      alt: 'Escudo de {{league}}, temporada {{season}}',
      missing: 'Sin escudo',
      error: 'No se pudo cargar el escudo',
    },
  },
  notFound: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe.',
    genericTitle: 'Algo salió mal',
    backToLeagues: 'Volver a ligas',
  },
  viewMode: {
    label: 'Vista',
    grid: 'Cuadrícula',
    list: 'Lista',
  },
  errors: {
    unexpectedTitle: 'Algo ha salido mal',
    unexpectedMessage: 'Se ha producido un error inesperado.',
    tryAgain: 'Reintentar',
    unableToLoadLeagues: 'No se han podido cargar las ligas',
  },
  language: {
    label: 'Idioma',
    english: 'English',
    spanish: 'Español',
  },
  theme: {
    label: 'Tema',
    darkMode: 'Modo oscuro',
  },
};
