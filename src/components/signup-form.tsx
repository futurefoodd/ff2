import { useState, type FormEvent } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const signupSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string().min(8),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
  })

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation()
  const { signUpWithPassword, signInWithProvider } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [confirmationEmail, setConfirmationEmail] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError("")
    const result = signupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    })

    if (!result.success) {
      const passwordMismatch = result.error.issues.some(
        (issue) =>
          issue.code === "custom" && issue.path[0] === "confirmPassword"
      )
      setError(
        passwordMismatch
          ? t("auth.signUp.passwordMismatch")
          : t("auth.signUp.validationError")
      )
      return
    }

    setSubmitting(true)
    const { email, password } = result.data
    const { error: signUpError } = await signUpWithPassword(email, password)
    setSubmitting(false)

    if (signUpError) {
      setError(signUpError.message || t("auth.signUp.error"))
      return
    }

    setConfirmationEmail(email)
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setGoogleSubmitting(true)
    const { error: googleError } = await signInWithProvider("google")
    setGoogleSubmitting(false)
    if (googleError) setError(t("auth.signUp.googleError"))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            {confirmationEmail ? (
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">
                    {t("auth.signUp.confirmationTitle")}
                  </h1>
                  <p className="text-sm text-balance text-muted-foreground">
                    {t("auth.signUp.confirmationDescription", {
                      email: confirmationEmail,
                    })}
                  </p>
                </div>
                <FieldDescription className="text-center">
                  <Link to="/sign-in">{t("auth.signUp.backToSignIn")}</Link>
                </FieldDescription>
              </FieldGroup>
            ) : (
              <form onSubmit={(event) => void handleSubmit(event)}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">
                      {t("auth.signUp.title")}
                    </h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      {t("auth.signUp.description")}
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">{t("auth.email")}</FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t("auth.emailPlaceholder")}
                      autoComplete="email"
                      required
                    />
                    <FieldDescription>
                      {t("auth.signUp.emailDescription")}
                    </FieldDescription>
                  </Field>
                  <Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">
                          {t("auth.password")}
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-1/2 right-1 -translate-y-1/2"
                            aria-label={t(
                              showPassword
                                ? "auth.hidePassword"
                                : "auth.showPassword"
                            )}
                            aria-pressed={showPassword}
                            onClick={() =>
                              setShowPassword((visible) => !visible)
                            }
                          >
                            {showPassword ? (
                              <EyeOff aria-hidden="true" />
                            ) : (
                              <Eye aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password">
                          {t("auth.confirmPassword")}
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="absolute top-1/2 right-1 -translate-y-1/2"
                            aria-label={t(
                              showConfirmPassword
                                ? "auth.hidePassword"
                                : "auth.showPassword"
                            )}
                            aria-pressed={showConfirmPassword}
                            onClick={() =>
                              setShowConfirmPassword((visible) => !visible)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff aria-hidden="true" />
                            ) : (
                              <Eye aria-hidden="true" />
                            )}
                          </Button>
                        </div>
                      </Field>
                    </div>
                    <FieldDescription>
                      {t("auth.signUp.passwordHint")}
                    </FieldDescription>
                  </Field>
                  {error && (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <Field>
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? t("auth.signUp.submitting")
                        : t("auth.signUp.submit")}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    {t("auth.continueWith")}
                  </FieldSeparator>
                  <Field>
                    <Button
                      onClick={() => void handleGoogleSignIn()}
                      variant="outline"
                      type="button"
                      disabled={googleSubmitting}
                    >
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      {googleSubmitting
                        ? t("auth.signUp.googleSubmitting")
                        : t("auth.signUp.google")}
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    <Trans
                      i18nKey="auth.signUp.hasAccount"
                      components={{ signIn: <Link to="/sign-in" /> }}
                    />
                  </FieldDescription>
                </FieldGroup>
              </form>
            )}
          </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/sign-up-wellness.webp"
              alt={t("auth.signUp.imageAlt")}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.45]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        <Trans
          i18nKey="auth.legal"
          components={{
            terms: <Link to="/#terms" />,
            privacy: <Link to="/#privacy" />,
          }}
        />
      </FieldDescription>
    </div>
  )
}
