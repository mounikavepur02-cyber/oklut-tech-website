import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useBodyScrollLock } from '../../lib/useBodyScrollLock'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { useCookieConsent } from './CookieConsentProvider'
import { useTranslation } from '../../i18n/TranslationContext'

export function CookieConsentBanner() {
  const { decided, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent()
  const { t } = useTranslation()

  const panelRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(panelRef, !decided)
  useBodyScrollLock(!decided)

  // Move keyboard focus into the banner the moment it appears.
  useEffect(() => {
    if (decided) return
    primaryRef.current?.focus()
  }, [decided])

  if (decided) return null

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="cookie-banner-panel" ref={panelRef}>
        <div className="cookie-banner-head">
          <span className="cookie-banner-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <div>
            <h2 id="cookie-banner-title">{t('cookieConsent.title')}</h2>
            <p id="cookie-banner-description">{t('cookieConsent.description')}</p>
          </div>
        </div>

        <div className="cookie-banner-actions">
          <button
            type="button"
            ref={primaryRef}
            className="btn btn-primary"
            onClick={acceptAll}
          >
            {t('cookieConsent.acceptAll')}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={rejectNonEssential}
          >
            {t('cookieConsent.rejectNonEssential')}
          </button>
        </div>

        <div className="cookie-banner-links">
          <button type="button" className="link-btn" onClick={openPreferences}>
            {t('cookieConsent.managePreferences')}
          </button>
          <span aria-hidden="true">·</span>
          <Link to="/privacy" className="link-btn">
            {t('cookieConsent.privacyPolicy')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CookieConsentBanner
