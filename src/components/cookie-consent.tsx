import { Cookie } from "lucide-react"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const cookieConsentKey = "company-cookie-consent"

export function CookieConsent() {
  const [open, setOpen] = useState(
    () => !window.localStorage.getItem(cookieConsentKey)
  )

  const saveConsent = (value: "necessary" | "all") => {
    window.localStorage.setItem(cookieConsentKey, value)
    setOpen(false)
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Cookie />
          </AlertDialogMedia>
          <AlertDialogTitle>Cookie preferences</AlertDialogTitle>
          <AlertDialogDescription>
            We use essential cookies for security, language settings, and your
            cart. With your permission, we also use anonymized analytics to
            understand site performance. We do not enable marketing cookies by
            default.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            variant="outline"
            onClick={() => saveConsent("necessary")}
          >
            Essential only
          </AlertDialogAction>
          <AlertDialogAction onClick={() => saveConsent("all")}>
            Accept analytics
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
