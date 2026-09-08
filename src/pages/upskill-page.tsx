import { Video } from "lucide-react"
import { useState } from "react"

import { TopNavigation } from "@/components/top-navigation"
import { env } from "@/config/env"
import { getPublicStorageUrl } from "@/services/storage"

function getUpskillVideoUrl() {
  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_PUBLISHABLE_KEY ||
    !env.SUPABASE_UPSKILL_VIDEO_BUCKET ||
    !env.UPSKILL_VIDEO_PATH
  ) {
    return ""
  }

  return getPublicStorageUrl({
    bucket: env.SUPABASE_UPSKILL_VIDEO_BUCKET,
    path: env.UPSKILL_VIDEO_PATH,
  })
}

export function UpskillPage() {
  const videoUrl = getUpskillVideoUrl()
  const [videoFailed, setVideoFailed] = useState(false)
  const showVideo = Boolean(videoUrl) && !videoFailed

  return (
    <div className="min-h-svh bg-background text-foreground">
      <TopNavigation />
      <main className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Upskill
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Nutrition learning resources
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Watch practical learning sessions from Future Foods and Utara
            Dietetics.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="upskill-video-title">
          <h2 id="upskill-video-title" className="text-xl font-semibold">
            Featured video
          </h2>

          <div className="mt-4 aspect-video overflow-hidden rounded-xl border bg-muted/40">
            {showVideo ? (
              <video
                className="h-full w-full bg-black object-contain"
                src={videoUrl}
                controls
                preload="metadata"
                onError={() => setVideoFailed(true)}
              >
                Your browser does not support the video element.
              </video>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center text-muted-foreground">
                <div>
                  <Video className="mx-auto size-10" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">Video coming soon</p>
                  <p className="mt-1 text-sm">
                    Configure the Supabase bucket and video path to display it
                    here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
