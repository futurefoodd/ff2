import { TopNavigation } from "@/components/top-navigation"

const posters = [
  {
    src: "/dual-therapy.jpeg",
    alt: "Gut-Brain Axis Project information poster supporting children with ASD and ADHD",
  },
  {
    src: "/rotary.jpeg",
    alt: "Rotary Districts 3300 and 3310 DISCON 2026 event poster",
  },
]

export function DualTherapyPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Dietetics
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Dual Therapy &amp; Nutrient Synergy
          </h1>
        </header>

        <section
          className="mt-10 grid items-start gap-6 md:grid-cols-2"
          aria-label="Dual therapy resources"
        >
          {posters.map((poster) => (
            <a
              key={poster.src}
              href={poster.src}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-xl border bg-muted/30"
            >
              <img
                src={poster.src}
                alt={poster.alt}
                className="h-auto w-full object-contain"
              />
            </a>
          ))}
        </section>
      </main>
    </div>
  )
}
