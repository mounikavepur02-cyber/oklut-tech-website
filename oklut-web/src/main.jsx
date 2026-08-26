import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { CookieConsentProvider } from './components/cookie/CookieConsentProvider.tsx'
import { TranslationProvider } from './i18n/TranslationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/oklut-tech-website">
      <TranslationProvider>
        <AuthProvider>
          <CookieConsentProvider>
            <App />
          </CookieConsentProvider>
        </AuthProvider>
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
)
