import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@providers/ThemeProvider'
import { AuthProvider } from '@context/AuthContext'
import { RouteProvider } from '@context/RouteContext'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <RouteProvider>
              <App />
              <Toaster position="bottom-right" />
            </RouteProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
