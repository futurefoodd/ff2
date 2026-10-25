import { useState, type FormEvent } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth"
import { z } from "zod"

export function ForgotPasswordPage() {
  const { t } = useTranslation()
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const result = z
      .object({
        email: z.email(t("auth.resetPassword.invalidEmail")).max(254),
      })
      .safeParse({ email })
    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? t("auth.resetPassword.invalidEmail")
      )
      return
    }

    setSubmitting(true)

    const { error: requestError } = await requestPasswordReset(
      result.data.email
    )
    setSubmitting(false)

    if (requestError) {
      setError(t("auth.resetPassword.sendError"))
      return
    }

    setSent(true)
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/35 px-4 py-12 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />
      <div className="relative w-full max-w-sm">
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
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {t(
                sent
                  ? "auth.resetPassword.sentTitle"
                  : "auth.resetPassword.title"
              )}
            </CardTitle>
            <CardDescription>
              {sent
                ? t("auth.resetPassword.sentDescription", { email })
                : t("auth.resetPassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <FieldGroup>
                <FieldDescription className="text-center">
                  {t("auth.resetPassword.checkSpam")}
                </FieldDescription>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSent(false)
                    setError("")
                  }}
                >
                  {t("auth.resetPassword.changeEmail")}
                </Button>
              </FieldGroup>
            ) : (
              <form noValidate onSubmit={(event) => void handleSubmit(event)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">
                      {t("auth.email")}
                    </FieldLabel>
                    <Input
                      id="reset-email"
                      name="email"
                      type="email"
                      placeholder={t("auth.emailPlaceholder")}
                      autoComplete="email"
                      autoCapitalize="none"
                      required
                      aria-invalid={Boolean(error)}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Field>
                  {error && (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <Field>
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? t("auth.resetPassword.sending")
                        : t("auth.resetPassword.submit")}
                    </Button>
                    <FieldDescription className="text-center">
                      <Trans
                        i18nKey="auth.resetPassword.backToSignIn"
                        components={{ signIn: <Link to="/sign-in" /> }}
                      />
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
