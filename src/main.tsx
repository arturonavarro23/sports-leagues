import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './shared/i18n/i18n';
import { App } from './app/App';
import { env } from './shared/config/env';

async function enableMockApi(): Promise<void> {
  // The literal import.meta.env.DEV is what lets Rollup drop MSW from the
  // production bundle; a runtime-only flag leaves the whole worker shipped.
  if (!import.meta.env.DEV) return;
  if (!env.isMockApiEnabled) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found.');

void enableMockApi().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
