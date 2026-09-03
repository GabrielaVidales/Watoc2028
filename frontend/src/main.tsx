import App from './App.js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './features/auth/contexts/AuthContext.jsx'
import React, { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner.jsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from './components/ui/tooltip.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider>
            <TooltipProvider>
              <App />
            </TooltipProvider>
          </ThemeProvider>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  // </StrictMode>,
)
