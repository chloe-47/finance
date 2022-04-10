import * as React from 'react';
import { StrictMode } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from 'src/root/App';

const rootElement = document.getElementById('root');

if (rootElement == null) {
  throw new Error('No HTML element with id="root" found');
}
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
