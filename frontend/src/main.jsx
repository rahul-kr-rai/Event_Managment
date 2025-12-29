import React from 'react'
import ReactDOM from 'react-dom/client'

// --- CRITICAL FIX FOR WHITE SCREEN ---
if (typeof window !== 'undefined') {
  window.global = window;
}

// --- NEW: SLIDER CSS ---
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)