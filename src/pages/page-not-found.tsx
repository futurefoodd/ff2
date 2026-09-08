import { TopNavigation } from "@/components/top-navigation"

export function PageNotFound() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
        <article>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Oops! The page you are looking for does not exist.
          </h1>
        </article>
      </main>
    </div>
  )
}
