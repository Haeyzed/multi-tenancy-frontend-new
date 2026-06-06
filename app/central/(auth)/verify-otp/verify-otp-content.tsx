"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { VerifyOtpForm } from "@/components/central/auth/verify-otp-form"
import { OtpPurposes, type OtpPurpose } from "@/types/central/auth"

function isOtpPurpose(value: string | null): value is OtpPurpose {
  return (
    value === OtpPurposes.PasswordReset ||
    value === OtpPurposes.PasswordChange ||
    value === OtpPurposes.EmailVerification
  )
}

export function VerifyOtpPageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const purposeParam = searchParams.get("purpose")

  if (!email || !isOtpPurpose(purposeParam)) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          This verification link is invalid or incomplete.
        </p>
        <Link href="/central/login" className="text-sm underline underline-offset-4">
          Back to login
        </Link>
      </div>
    )
  }

  return <VerifyOtpForm email={email} purpose={purposeParam} />
}
