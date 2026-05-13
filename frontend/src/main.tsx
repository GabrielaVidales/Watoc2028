import App from './App.js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.js'
import './index.css'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  // </StrictMode>,
)
