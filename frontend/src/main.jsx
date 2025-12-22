import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { APIProvider } from './contexts/APIContext'

// async function enableMocking() {
//   if (!import.meta.env.DEV) return;

//   const { worker } = await import('./mocks/browser');
//   return worker.start();
// }

// enableMocking()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </APIProvider>
  </StrictMode>,
)

