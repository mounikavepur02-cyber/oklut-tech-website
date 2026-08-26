import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import i18n from './i18n'
import { loadTranslations } from './translationService'

/* ── context ─────────────────────────────────────────────────────────────── */

const TranslationContext = createContext({
  lang: 'en',
  loading: false,
  setLanguage: () => {},
  t: (key) => key,
})

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(i18n.language || 'en')
  const [loading, setLoading] = useState(false)

  const setLanguage = useCallback(async (code) => {
    if (!code || code === i18n.language) return
    setLoading(true)
    try {
      // If the bundle is already loaded in i18next, just switch
      if (i18n.hasResourceBundle(code, 'translation')) {
        await i18n.changeLanguage(code)
        setLang(code)
        return
      }

      // Otherwise try loading via the translation service (API + cache)
      const enBundle = i18n.getResourceBundle('en', 'translation')
      const bundle = await loadTranslations(code, enBundle)
      i18n.addResourceBundle(code, 'translation', bundle, true, true)
      await i18n.changeLanguage(code)
      setLang(code)
    } catch (err) {
      console.error('[Translation] Failed to load language:', code, err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Sync with i18next's own language changes (e.g. from detector).
  useEffect(() => {
    const handler = (lng) => setLang(lng)
    i18n.on('languageChanged', handler)
    return () => i18n.off('languageChanged', handler)
  }, [])

  // On first load, if the detector picked a non-English language, translate.
  useEffect(() => {
    const detected = i18n.language || 'en'
    if (detected !== 'en') {
      setLanguage(detected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({ lang, loading, setLanguage, t: i18n.t.bind(i18n) }), [lang, loading, setLanguage])

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  return useContext(TranslationContext)
}

export { i18n }
