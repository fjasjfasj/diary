import 'the-new-css-reset';
import './index.css';
import './sr-only.css';
import './util/firebase';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './components/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerSW({ immediate: true });
