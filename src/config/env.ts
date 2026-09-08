interface Env {
  API_BASE_URL: string
  SUPABASE_URL: string
  SUPABASE_PUBLISHABLE_KEY: string
  SUPABASE_PRODUCT_IMAGES_BUCKET: string
  SUPABASE_UPSKILL_VIDEO_BUCKET: string
  UPSKILL_VIDEO_PATH: string
  TURNSTILE_SITE_KEY: string
  MODE: "dev" | "sit" | "uat" | "prod"
  ENABLE_DEV_TOOLS?: boolean
}

export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`)
  }
  return value || defaultValue || ""
}

export const env: Readonly<Env> = Object.freeze({
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://localhost:8443/api/v1"),
  SUPABASE_URL: getEnvVar("VITE_SUPABASE_URL"),
  SUPABASE_PUBLISHABLE_KEY: getEnvVar(
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ),
  SUPABASE_PRODUCT_IMAGES_BUCKET: getEnvVar(
    "VITE_SUPABASE_PRODUCT_IMAGES_BUCKET",
    "product-images"
  ),
  SUPABASE_UPSKILL_VIDEO_BUCKET: getEnvVar(
    "VITE_SUPABASE_UPSKILL_VIDEO_BUCKET",
    "upskill-videos"
  ),
  UPSKILL_VIDEO_PATH: getEnvVar("VITE_UPSKILL_VIDEO_PATH", ""),
  TURNSTILE_SITE_KEY: getEnvVar(
    "VITE_TURNSTILE_SITE_KEY",
    import.meta.env.PROD ? "" : "1x00000000000000000000AA"
  ),
  MODE: (import.meta.env.MODE || "dev") as Env["MODE"],
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === "true",
})

export default env
