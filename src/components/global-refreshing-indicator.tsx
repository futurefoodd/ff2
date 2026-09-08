import { useIsFetching } from "@tanstack/react-query"
import { RefreshCw } from "lucide-react"

export function GlobalRefreshingIndicator() {
  const refreshingQueries = useIsFetching({
    predicate: (query) => query.state.data !== undefined,
  })

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4"
    >
      {refreshingQueries > 0 && (
        <div
          role="status"
          data-refreshing="true"
          className="flex items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-sm font-medium shadow-lg backdrop-blur-sm"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          <span>Refreshing…</span>
        </div>
      )}
    </div>
  )
}
