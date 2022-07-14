import React from 'react';
import ReactDOM from 'react-dom/client';
import './util/firebase';
import App from './components/App';

import 'the-new-css-reset';
import './index.css';
import './sr-only.css';

import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerSW({ immediate: true });
