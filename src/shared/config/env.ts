// The only module allowed to read import.meta.env.
const DEFAULT_API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

export interface AppEnvironment {
  readonly apiBaseUrl: string;
  readonly isDevelopment: boolean;
  readonly isMockApiEnabled: boolean;
}

function readApiBaseUrl(): string {
  const configured = import.meta.env.VITE_SPORTS_DB_API_BASE_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.trim().replace(/\/+$/, '');
  }
  return DEFAULT_API_BASE_URL;
}

export const env: AppEnvironment = {
  apiBaseUrl: readApiBaseUrl(),
  isDevelopment: import.meta.env.DEV,
  isMockApiEnabled: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
};
