"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ApiError } from "@/lib/central/api/errors"
import { useResendOtp } from "@/providers/central/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { OtpPurposes } from "@/types/central/auth"

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const resendOtp = useResendOtp()
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setMessage(null)

    try {
      const result = await resendOtp.mutateAsync({
        email,
        purpose: OtpPurposes.EmailVerification,
      })
      setMessage(
        result.message ??
          "If an account exists for that email, a verification code has been sent.",
      )
      router.push(
        `/central/verify-otp?purpose=${OtpPurposes.EmailVerification}&email=${encodeURIComponent(email)}`,
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to send verification code. Please try again.")
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
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email to receive a verification code
          </p>
        </div>
        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
            {message}
          </p>
        ) : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="admin@platform.com"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={resendOtp.isPending}>
            {resendOtp.isPending ? "Sending code..." : "Send verification code"}
          </Button>
          <FieldDescription className="text-center">
            Already verified?{" "}
            <Link href="/central/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
