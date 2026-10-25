import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
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
import { useAuth } from "@/contexts/auth-context"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

export function UpdatePasswordPage() {
  const { t } = useTranslation()
  const { user, updatePassword } = useAuth()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const updatePasswordSchema = z
      .object({
        password: z
          .string()
          .min(8, t("auth.updatePassword.minLength"))
          .regex(/[A-Z]/, t("auth.updatePassword.uppercase"))
          .regex(/[^A-Za-z0-9\s]/, t("auth.updatePassword.specialCharacter")),
        confirmPassword: z
          .string()
          .min(1, t("auth.updatePassword.confirmRequired")),
      })
      .refine((values) => values.password === values.confirmPassword, {
        path: ["confirmPassword"],
        message: t("auth.updatePassword.mismatch"),
      })
    const result = updatePasswordSchema.safeParse({
      password,
      confirmPassword,
    })

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? t("auth.updatePassword.error")
      )
      return
    }

    setSubmitting(true)
    const { error: updateError } = await updatePassword(result.data.password)
    setSubmitting(false)

    if (updateError) {
      setError(t("auth.updatePassword.error"))
      return
    }

    setUpdated(true)
    setPassword("")
    setConfirmPassword("")
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
                !user
                  ? "auth.updatePassword.linkExpiredTitle"
                  : updated
                    ? "auth.updatePassword.successTitle"
                    : "auth.updatePassword.title"
              )}
            </CardTitle>
            <CardDescription>
              {t(
                !user
                  ? "auth.updatePassword.linkExpiredDescription"
                  : updated
                    ? "auth.updatePassword.successDescription"
                    : "auth.updatePassword.description"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <FieldDescription className="text-center">
                <Link
                  className="underline underline-offset-4"
                  to="/forgot-password"
                >
                  {t("auth.updatePassword.requestNewLink")}
                </Link>
              </FieldDescription>
            ) : updated ? (
              <FieldDescription className="text-center">
                <Link to="/profile">{t("auth.updatePassword.continue")}</Link>
              </FieldDescription>
            ) : (
              <form noValidate onSubmit={(event) => void handleSubmit(event)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="new-password">
                      {t("auth.updatePassword.newPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="new-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="pr-10"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
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
                        onClick={() => setShowPassword((visible) => !visible)}
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
                    <FieldLabel htmlFor="confirm-new-password">
                      {t("auth.confirmPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirm-new-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="pr-10"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
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
                  {error && (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <Field>
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? t("auth.updatePassword.submitting")
                        : t("auth.updatePassword.submit")}
                    </Button>
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
