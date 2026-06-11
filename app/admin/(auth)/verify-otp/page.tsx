"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { TenantVerifyOtpForm } from "@/components/tenant/auth/password-forms"
import { tenantAuthPaths } from "@/lib/tenant/auth/constants"
import {
  TenantOtpPurposes,
  type TenantOtpPurpose,
} from "@/types/tenant/auth"

function isOtpPurpose(value: string | null): value is TenantOtpPurpose {
  return (
    value === TenantOtpPurposes.PasswordReset ||
    value === TenantOtpPurposes.PasswordChange ||
    value === TenantOtpPurposes.EmailVerification
  )
}

export default function TenantVerifyOtpPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const purposeParam = searchParams.get("purpose")

  if (!email || !isOtpPurpose(purposeParam)) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          This verification link is invalid or incomplete.
        </p>
        <Link href={tenantAuthPaths.login} className="text-sm underline underline-offset-4">
          Back to login
        </Link>
      </div>
    )
  }

  return <TenantVerifyOtpForm email={email} purpose={purposeParam} />
}
