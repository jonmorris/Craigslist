import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './theme.css'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)

// Installable PWA: register the service worker when served over http(s), e.g.
// GitHub Pages. Skipped for file:// and inside sandboxed previews.
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}))
}
