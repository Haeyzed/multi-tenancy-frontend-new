"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { ResetPasswordForm } from "@/components/central/auth/reset-password-form"

export function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Missing email for password reset.
        </p>
        <Link
          href="/central/forgot-password"
          className="text-sm underline underline-offset-4"
        >
          Start over
        </Link>
      </div>
    )
  }

  return <ResetPasswordForm email={email} />
}
