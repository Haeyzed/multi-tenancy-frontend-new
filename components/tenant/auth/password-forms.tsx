"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ApiError } from "@/lib/central/api/errors"
import { tenantAuthPaths, TENANT_OTP_LENGTH } from "@/lib/tenant/auth/constants"
import {
  clearVerificationSession,
  getVerificationSession,
  setVerificationSession,
} from "@/lib/tenant/auth/verification-storage"
import {
  useTenantForgotPassword,
  useTenantResendOtp,
  useTenantResetPassword,
  useTenantVerifyOtp,
} from "@/providers/tenant/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  TenantOtpPurposes,
  type TenantOtpPurpose,
} from "@/types/tenant/auth"

export function TenantForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const forgotPassword = useTenantForgotPassword()
  const [email, setEmail] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await forgotPassword.mutateAsync({ email })
      router.push(
        `${tenantAuthPaths.verifyOtp}?purpose=${TenantOtpPurposes.PasswordReset}&email=${encodeURIComponent(email)}`,
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to send reset code. Please try again.")
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we&apos;ll send you a verification code
          </p>
        </div>
        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={forgotPassword.isPending}>
            {forgotPassword.isPending ? "Sending code..." : "Send verification code"}
          </Button>
          <FieldDescription className="text-center">
            <Link href={tenantAuthPaths.login} className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function TenantVerifyOtpForm({
  email,
  purpose,
  className,
  ...props
}: React.ComponentProps<"form"> & { email: string; purpose: TenantOtpPurpose }) {
  const router = useRouter()
  const verifyOtp = useTenantVerifyOtp()
  const resendOtp = useTenantResendOtp()
  const [otp, setOtp] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      const result = await verifyOtp.mutateAsync({ email, otp, purpose })

      if (purpose === TenantOtpPurposes.PasswordReset) {
        setVerificationSession(email, result.data.verification_token)
        router.push(
          `${tenantAuthPaths.resetPassword}?email=${encodeURIComponent(email)}`,
        )
        return
      }

      router.push(tenantAuthPaths.dashboard)
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
      setSuccessMessage(result.message ?? "Verification code sent.")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
      }
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify reset code</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
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
            maxLength={TENANT_OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {Array.from({ length: TENANT_OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Field>
          <Button type="submit" disabled={verifyOtp.isPending || otp.length !== TENANT_OTP_LENGTH}>
            {verifyOtp.isPending ? "Verifying..." : "Verify code"}
          </Button>
          <Button type="button" variant="outline" disabled={resendOtp.isPending} onClick={handleResend}>
            {resendOtp.isPending ? "Resending..." : "Resend code"}
          </Button>
          <FieldDescription className="text-center">
            <Link href={tenantAuthPaths.login} className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function TenantResetPasswordForm({
  email,
  className,
  ...props
}: React.ComponentProps<"form"> & { email: string }) {
  const router = useRouter()
  const resetPassword = useTenantResetPassword()
  const [password, setPassword] = React.useState("")
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    const session = getVerificationSession()

    if (!session || session.email !== email) {
      setErrorMessage("Your verification session expired. Please request a new code.")
      return
    }

    try {
      await resetPassword.mutateAsync({
        email,
        verification_token: session.token,
        password,
        password_confirmation: passwordConfirmation,
      })
      clearVerificationSession()
      router.push(`${tenantAuthPaths.login}?reset=1`)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to reset password. Please try again.")
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
          <Input
            id="password_confirmation"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={resetPassword.isPending}>
            {resetPassword.isPending ? "Resetting..." : "Reset password"}
          </Button>
          <FieldDescription className="text-center">
            <Link href={tenantAuthPaths.login} className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
