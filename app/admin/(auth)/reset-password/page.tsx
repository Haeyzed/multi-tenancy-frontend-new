"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { TenantResetPasswordForm } from "@/components/tenant/auth/password-forms"
import { tenantAuthPaths } from "@/lib/tenant/auth/constants"

export default function TenantResetPasswordPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Missing email for password reset.
        </p>
        <Link
          href={tenantAuthPaths.forgotPassword}
          className="text-sm underline underline-offset-4"
        >
          Start over
        </Link>
      </div>
    )
  }

  return <TenantResetPasswordForm email={email} />
}
