import App from './App.js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.js'
import './index.css'

// Esto solo se ejecuta si está en modo development 
// no se ejecuta cuando se hace el build de React
if (false && import.meta.env.MODE === 'development') {
  console.groupCollapsed(
    "%c[WATOC 2028: Frontend]",
    `color:#00ff88;
     background:#002b1e;
     font-weight:800;
     padding:4px 8px;
     letter-spacing: 1px;
     border-radius:6px;`
  )
  console.log("%cModo desarrollo:", "color:#FFFF00;font-weight:300;")
  console.log("%c- Usando variables de entorno en .env.development", "color:#e0e0e0;font-weight:300;")
  console.log("%c- Levantando mock-server con MSW para simular backend", "color:#e0e0e0;font-weight:300;")
  console.groupEnd()

  async function enableMocking() {
    if (!import.meta.env.DEV) return

    const { worker } = await import('../mocks/browser.js')
    return worker.start()
  }

  // esto es porque congela la inicialización de la app hasta que se levante el mock, para que no 
  // haya ninguna llamada en React que intente acceder al backend falso antes de que se inicialize
  await enableMocking()
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  // </StrictMode>,
)
