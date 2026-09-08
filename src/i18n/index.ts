import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import ms from "./locales/ms.json"
import zh from "./locales/zh.json"

const supportedLanguages = ["en", "ms", "zh"] as const
type SupportedLanguage = (typeof supportedLanguages)[number]

const en = {
  app: { language: "Language" },
  navigation: {
    company: "Future Foods",
    primary: "Primary navigation",
    menu: "Menu",
    openMenu: "Open navigation menu",
    signIn: "Sign in",
    signUp: "Sign up",
    home: "Home",
    products: "Products",
    doctorsForum: "Doctors forum",
    dietetics: "Dietetics",
    upskill: "Upskill",
    tour: "Tour",
  },
}

function getInitialLanguage(): SupportedLanguage {
  const storedLanguage = window.localStorage.getItem("language")
  if (
    storedLanguage &&
    supportedLanguages.includes(storedLanguage as SupportedLanguage)
  ) {
    return storedLanguage as SupportedLanguage
  }

  const browserLanguage = window.navigator.language.split("-")[0]
  return supportedLanguages.includes(browserLanguage as SupportedLanguage)
    ? (browserLanguage as SupportedLanguage)
    : "en"
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ms: { translation: ms },
    zh: { translation: zh },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: { escapeValue: false },
  returnNull: false,
})

i18n.on("languageChanged", (language) => {
  window.localStorage.setItem("language", language)
})

export default i18n
