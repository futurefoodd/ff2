import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth"

export function ProfilePage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto min-h-svh max-w-7xl px-6 py-16 lg:px-12">
      <h1 className="text-4xl font-semibold tracking-tight">Profile</h1>
      <Card className="mt-8 max-w-xl rounded-3xl">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p className="text-sm text-muted-foreground">
              {user.email ?? "No email address is available."}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              You are signed out. {" "}
              <Link className="underline" to="/sign-in">
                Sign in
              </Link>{" "}
              to view your account.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
