import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../tokens.css';
import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TemplateDetail, TemplatesIndex } from './Templates';

const Bento = lazy(() =>
  import('./Bento').then((m) => ({ default: m.Bento })),
);

function useHash(): string {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const fn = () => setHash(window.location.hash);
    window.addEventListener('hashchange', fn);
    return () => window.removeEventListener('hashchange', fn);
  }, []);
  return hash;
}

function Router() {
  // Screenshot harness: `?shot=bento` keeps rendering the bento page.
  const shot = new URLSearchParams(window.location.search).get('shot');
  const hash = useHash();
  if (shot === 'bento' || hash === '#/bento') {
    return (
      <Suspense fallback={null}>
        <Bento />
      </Suspense>
    );
  }
  if (hash === '#/templates') return <TemplatesIndex />;
  const match = hash.match(/^#\/templates\/([\w-]+)$/);
  if (match) {
    return (
      <Suspense fallback={null}>
        <TemplateDetail id={match[1]} />
      </Suspense>
    );
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
