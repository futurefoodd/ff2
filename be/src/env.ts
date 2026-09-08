import "dotenv/config"
import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
})

export const env = {
  port: Number(process.env.PORT) || 8443,
  jwtSecret: process.env.JWT_SECRET || "change-me-super-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "dev",
  logLevel: process.env.LOG_LEVEL || "info",
  baseUrl:
    process.env.BASE_URL + ":" + process.env.PORT || "http://localhost:8443",
  stripe_baseUrl: process.env.STRIPE_BASE_URL || "https://api.stripe.com",
  turnstileSecretKey:
    process.env.TURNSTILE_SECRET_KEY ||
    (process.env.NODE_ENV === "production"
      ? ""
      : "1x0000000000000000000000000000000AA"),
  turnstileAllowedHostnames: (
    process.env.TURNSTILE_ALLOWED_HOSTNAMES ||
    (process.env.NODE_ENV === "production" ? "" : "localhost,127.0.0.1")
  )
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || "",
}
