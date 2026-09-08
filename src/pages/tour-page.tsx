import { TopNavigation } from "@/components/top-navigation"

export function TourPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Tour
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Production facility layout
          </h1>
        </header>

        <a
          href="/plant_layout.webp"
          target="_blank"
          rel="noreferrer"
          className="mt-10 block overflow-hidden rounded-xl border bg-muted/30"
          aria-label="Open the production facility layout at full size"
        >
          <img
            src="/plant_layout.webp"
            alt="Ground-floor plan of the production facility"
            className="h-auto w-full object-contain"
          />
        </a>
      </main>
    </div>
  )
}
