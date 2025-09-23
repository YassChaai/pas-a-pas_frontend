import { useEffect, useMemo, useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "@/components/navbar"

const COOKIE_KEY = "pasapas-cookie-consent"
const CONSENT_VERSION = "1"
const CONSENT_MAX_AGE_DAYS = 180

function parseConsent(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.status || parsed.version !== CONSENT_VERSION) return null
    if (!parsed.date) return null
    const saved = new Date(parsed.date)
    const now = new Date()
    const ageInDays = (now - saved) / (1000 * 60 * 60 * 24)
    if (ageInDays > CONSENT_MAX_AGE_DAYS) return null
    return parsed
  } catch (err) {
    console.warn("Cookie consent parsing failed", err)
    return null
  }
}

export default function MainLayout() {
  const [showCookieBanner, setShowCookieBanner] = useState(false)
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    const stored = parseConsent(localStorage.getItem(COOKIE_KEY))
    if (!stored) {
      setShowCookieBanner(true)
    } else {
      setConsent(stored)
    }
  }, [])

  const handleConsent = (value) => {
    const payload = {
      status: value,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload))
    setConsent(payload)
    setShowCookieBanner(false)
  }

  const openPreferences = () => {
    setShowCookieBanner(true)
  }

  const bannerMessage = useMemo(
    () =>
      "Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies statistiques et marketing pour personnaliser votre expérience.",
    [],
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-center">
            <p>© {new Date().getFullYear()} Pas à Pas — Sneakers & SneakArt</p>
            <span className="hidden text-slate-300 md:inline">•</span>
            <a href="/politique-de-confidentialite" className="text-xs font-medium text-pasapas-blue hover:underline">
              Politique de confidentialité
            </a>
            <span className="hidden text-slate-300 md:inline">•</span>
            <button
              type="button"
              onClick={openPreferences}
              className="rounded-full border border-slate-200 px-4 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="fixed inset-x-4 bottom-4 z-50">
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/70 bg-white/95 shadow-2xl backdrop-blur px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-base font-semibold text-slate-900">Cookies & confidentialité</h2>
                <p className="text-sm text-slate-600">{bannerMessage}</p>
                <a
                  href="/politique-de-confidentialite"
                  className="text-xs font-medium text-pasapas-blue underline"
                >
                  En savoir plus
                </a>
              </div>
              <div className="flex flex-col gap-2 md:flex-row">
                <button
                  type="button"
                  onClick={() => handleConsent("essential")}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
                >
                  Continuer sans cookies optionnels
                </button>
                <button
                  type="button"
                  onClick={() => handleConsent("all")}
                  className="rounded-full bg-pasapas-blue px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  Accepter tous les cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
