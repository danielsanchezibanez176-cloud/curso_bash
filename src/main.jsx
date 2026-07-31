import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './styles/app.css'
import './styles/animations.css'
import './styles/sidebar.css'
import './styles/dashboard.css'
import './styles/terminal.css'
import './styles/lessons.css'
import './styles/laboratory.css'
import './styles/quiz.css'
import './styles/achievements.css'

// Capturar errores no controlados y mostrarlos en pantalla
window.addEventListener('error', (e) => {
  const splash = document.getElementById('splash')
  if (splash) {
    splash.innerHTML = `
      <div style="font-family:monospace;color:#ff4757;padding:40px;max-width:800px;text-align:left">
        <div style="color:#00ff88;font-size:1.2rem;margin-bottom:16px">LinuxAcademy — Error de inicio</div>
        <div style="color:#ffd700;margin-bottom:8px">Error: ${e.message}</div>
        <div style="color:#8892a4;font-size:0.85rem;margin-bottom:16px">${e.filename}:${e.lineno}</div>
        <div style="color:#4d9fff;font-size:0.9rem">Abre la consola del navegador (F12 → Console) para más detalles.</div>
      </div>`
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Ocultar splash DESPUÉS de que React renderice
// Usamos requestAnimationFrame para esperar al primer paint
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (window.__hideSplash) window.__hideSplash()
  })
})
