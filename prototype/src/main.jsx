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

// On-screen keyboard: the viewport meta asks Chrome to shrink the layout above
// the keyboard (interactive-widget=resizes-content). For browsers that ignore
// it, size the app to the visible viewport so suggestions can scroll into view.
const vv = window.visualViewport
if (vv && matchMedia('(max-width: 899px)').matches) {
  const fit = () => { document.getElementById('root').style.height = vv.height + 'px' }
  vv.addEventListener('resize', fit)
  fit()
}
