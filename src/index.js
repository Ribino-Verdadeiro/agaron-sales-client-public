import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra o Service Worker para funcionalidade PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Opcional: mostrar notificação de atualização disponível
    console.log('Nova versão do Agaron Sales disponível!');
  },
  onSuccess: (registration) => {
    console.log('Agaron Sales está pronto para uso offline!');
  }
});

reportWebVitals();
