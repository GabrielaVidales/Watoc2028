import App from './App.js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './contexts/AuthContext.js'
import React, { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner.jsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.jsx'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthProvider>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      <Toaster />
    </BrowserRouter>
  </AuthProvider>
  // </StrictMode>,
)
