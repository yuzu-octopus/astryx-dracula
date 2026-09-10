import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../tokens.css';
import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BareTemplate, TemplateDetail, TemplatesIndex } from './Templates';
import { TEMPLATE_IDS } from './templateRegistry';

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
  const params = new URLSearchParams(window.location.search);
  // Screenshot harness: `?shot=bento` keeps rendering the bento page.
  const shot = params.get('shot');
  // `?bare=<id>` renders a template with no viewer chrome. The templates index
  // loads each page through this so the template gets a frame of its own.
  // Unknown and empty values render the index instead: a blank screen has no
  // way back to the showcase.
  const bare = params.get('bare');
  const hash = useHash();
  if (bare != null) {
    return (
      <Suspense fallback={null}>
        {TEMPLATE_IDS.includes(bare) ? <BareTemplate id={bare} /> : <TemplatesIndex />}
      </Suspense>
    );
  }
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
