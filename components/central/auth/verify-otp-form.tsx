"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ApiError } from "@/lib/central/api/errors"
import { OTP_LENGTH } from "@/lib/central/auth/constants"
import { setVerificationSession } from "@/lib/central/auth/verification-storage"
import { useResendOtp, useVerifyOtp } from "@/providers/central/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { OtpPurposes, type OtpPurpose } from "@/types/central/auth"

interface VerifyOtpFormProps extends React.ComponentProps<"form"> {
  email: string
  purpose: OtpPurpose
}

const purposeCopy: Record<
  OtpPurpose,
  { title: string; description: string; successPath: string }
> = {
  [OtpPurposes.PasswordReset]: {
    title: "Verify reset code",
    description: "Enter the verification code sent to your email",
    successPath: "/central/reset-password",
  },
  [OtpPurposes.PasswordChange]: {
    title: "Verify password change",
    description: "Enter the verification code sent to your email",
    successPath: "/central/dashboard",
  },
  [OtpPurposes.EmailVerification]: {
    title: "Verify your email",
    description: "Enter the verification code sent to your email",
    successPath: "/central/login",
  },
}

export function VerifyOtpForm({
  email,
  purpose,
  className,
  ...props
}: VerifyOtpFormProps) {
  const router = useRouter()
  const verifyOtp = useVerifyOtp()
  const resendOtp = useResendOtp()
  const [otp, setOtp] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  )

  const copy = purposeCopy[purpose]

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const result = await verifyOtp.mutateAsync({ email, otp, purpose })

      if (purpose === OtpPurposes.PasswordReset) {
        setVerificationSession(email, result.data.verification_token)
        router.push(
          `/central/reset-password?email=${encodeURIComponent(email)}`,
        )
        return
      }

      setSuccessMessage(result.message ?? "Verification successful.")
      router.push(`${copy.successPath}?verified=1`)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to verify code. Please try again.")
    }
  }

  async function handleResend() {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const result = await resendOtp.mutateAsync({ email, purpose })
      setSuccessMessage(
        result.message ??
          "If an account exists for that email, a verification code has been sent.",
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to resend code. Please try again.")
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{copy.title}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {copy.description}
          </p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            {successMessage}
          </p>
        ) : null}
        <Field>
          <FieldLabel htmlFor="otp">Verification code</FieldLabel>
          <InputOTP
            id="otp"
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Field>
          <Button
            type="submit"
            disabled={verifyOtp.isPending || otp.length !== OTP_LENGTH}
          >
            {verifyOtp.isPending ? "Verifying..." : "Verify code"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={resendOtp.isPending}
            onClick={handleResend}
          >
            {resendOtp.isPending ? "Resending..." : "Resend code"}
          </Button>
          <FieldDescription className="text-center">
            <Link href="/central/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
