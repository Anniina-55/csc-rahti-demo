import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'


// render the main app to root element
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}