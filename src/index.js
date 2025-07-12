import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

// 🔧 Qui puoi importare le varie versioni della tua app (una alla volta)
 import App from './App'; // App originale con router e tutto




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
     <App /> 

  </React.StrictMode>
);

// Per performance e analytics (puoi ignorarlo per ora)
reportWebVitals();
