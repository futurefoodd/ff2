import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { SignupForm } from "@/components/signup-form"

export function SignUpPage() {
  const { t } = useTranslation()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/35 px-4 py-12 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />
      <div className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
      </div>
      <div className="relative w-full max-w-4xl">
        <Link
          to="/"
          aria-label={t("auth.returnHome")}
          className="mb-8 flex items-center justify-center gap-3 font-semibold tracking-tight"
        >
          <img
            src="/ff_icon.png"
            alt=""
            className="size-10 rounded-xl object-cover shadow-sm"
          />
          <span>Future Foods</span>
        </Link>
        <SignupForm />
      </div>
    </main>
  )
}
