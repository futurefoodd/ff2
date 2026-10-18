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
  auth: {
    returnHome: "Return to Future Foods home",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    confirmPassword: "Confirm password",
    continueWith: "Or continue with",
    legal:
      "By continuing, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>.",
    signIn: {
      title: "Welcome back",
      description: "Sign in with your Apple or Google account",
      apple: "Sign in with Apple",
      google: "Sign in with Google",
      forgotPassword: "Forgot your password?",
      submit: "Sign in",
      noAccount: "Don’t have an account? <signUp>Sign up</signUp>",
    },
    signUp: {
      title: "Create your account",
      description: "Enter your email below to create your account",
      emailDescription:
        "We’ll use this to contact you. We will not share your email with anyone else.",
      passwordHint: "Must be at least 8 characters long.",
      submit: "Create account",
      apple: "Sign up with Apple",
      google: "Sign up with Google",
      meta: "Sign up with Meta",
      hasAccount: "Already have an account? <signIn>Sign in</signIn>",
      imageAlt:
        "Roselle, soursop, grains, and fruit pastilles arranged as a botanical wellness still life",
    },
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
