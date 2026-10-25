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
    showPassword: "Show password",
    hidePassword: "Hide password",
    confirmPassword: "Confirm password",
    continueWith: "Or continue with",
    legal:
      "By continuing, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>.",
    signIn: {
      title: "Welcome back",
      description: "Sign in with your email and password.",
      error:
        "We couldn’t sign you in. Check your email and password and try again.",
      submitting: "Signing in…",
      googleSubmitting: "Connecting to Google…",
      googleError: "We couldn’t start Google sign-in. Please try again.",
      apple: "Sign in with Apple",
      google: "Sign in with Google",
      forgotPassword: "Forgot your password?",
      submit: "Sign in",
      noAccount: "Don’t have an account? <signUp>Sign up</signUp>",
    },
    resetPassword: {
      title: "Reset your password",
      description: "Enter your email and we’ll send a password reset link.",
      sentTitle: "Check your email",
      sentDescription:
        "If an account exists for {{email}}, we’ll send a password reset link.",
      checkSpam: "Check your inbox and spam folder for the reset email.",
      sendError: "We couldn’t request a reset link. Please try again.",
      invalidEmail: "Enter a valid email address.",
      sending: "Sending…",
      submit: "Send reset link",
      changeEmail: "Use a different email",
      backToSignIn: "Remembered your password? <signIn>Sign in</signIn>",
    },
    updatePassword: {
      title: "Choose a new password",
      description:
        "Use at least 8 characters, including one uppercase letter and one special character.",
      linkExpiredTitle: "This reset link is no longer valid",
      linkExpiredDescription:
        "The link may have expired or already been used. Request a new password reset email to continue.",
      requestNewLink: "Request a new reset link",
      newPassword: "New password",
      mismatch: "The passwords don’t match.",
      minLength: "Use at least 8 characters.",
      uppercase: "Include at least one uppercase letter.",
      specialCharacter: "Include at least one special character.",
      confirmRequired: "Please confirm your password.",
      error:
        "We couldn’t update your password. Request a new reset link and try again.",
      submitting: "Updating password…",
      submit: "Update password",
      successTitle: "Password updated",
      successDescription: "Your password has been changed successfully.",
      continue: "Continue to your profile",
    },
    signUp: {
      title: "Create your account",
      description: "Enter your email below to create your account",
      emailDescription:
        "We’ll use this to contact you. We will not share your email with anyone else.",
      passwordHint: "Must be at least 8 characters long.",
      submit: "Create account",
      submitting: "Creating account…",
      error:
        "We couldn’t create your account. Check your details and try again.",
      passwordMismatch: "The passwords don’t match.",
      validationError:
        "Enter a valid email and a password with at least 8 characters.",
      googleError: "We couldn’t start Google sign-up. Please try again.",
      googleSubmitting: "Connecting to Google…",
      confirmationTitle: "Check your email",
      confirmationDescription:
        "If an account can be created for {{email}}, we’ll send a confirmation email. Follow the link to finish signing up.",
      backToSignIn: "Back to sign in",
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
