import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../tokens.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Bento } from './Bento';

// Screenshot harness: `?shot=bento` renders the Dracula-org
// submission screenshot page instead of the full showcase.
const shot = new URLSearchParams(window.location.search).get('shot');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{shot === 'bento' ? <Bento /> : <App />}</StrictMode>,
);
