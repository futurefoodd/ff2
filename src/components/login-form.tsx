import { useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { z } from "zod"

const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
})
type LoginData = z.infer<typeof LoginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  })

  const { t } = useTranslation()
  const { signInWithPassword, signInWithProvider } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (data: LoginData) => {
    setSubmitting(true)
    setError("")

    const { error: signInError } = await signInWithPassword(
      data.email,
      data.password
    )
    setSubmitting(false)

    if (signInError) setError(t("auth.signIn.error"))
  }

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true)
    setError("")

    const { error: signInError } = await signInWithProvider("google")
    setGoogleSubmitting(false)

    if (signInError) setError(t("auth.signIn.googleError"))
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.signIn.title")}</CardTitle>
          <CardDescription>{t("auth.signIn.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Field>
                <Button
                  type="button"
                  variant="outline"
                  disabled={googleSubmitting}
                  onClick={() => void handleGoogleSignIn()}
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
                    ? t("auth.signIn.googleSubmitting")
                    : t("auth.signIn.google")}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                {t("auth.continueWith")}
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">{t("auth.email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">
                    {t("auth.password")}
                  </FieldLabel>
                  <Link
                    className="text-sm underline-offset-4 hover:underline"
                    to="/forgot-password"
                  >
                    {t("auth.signIn.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(errors.password)}
                    className="pr-10"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    aria-label={t(
                      showPassword ? "auth.hidePassword" : "auth.showPassword"
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
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Field>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? t("auth.signIn.submitting")
                    : t("auth.signIn.submit")}
                </Button>
                <FieldDescription className="text-center">
                  <Trans
                    i18nKey="auth.signIn.noAccount"
                    components={{ signUp: <Link to="/sign-up" /> }}
                  />
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
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
