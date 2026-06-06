"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ApiError } from "@/lib/central/api/errors"
import {
  clearVerificationSession,
  getVerificationSession,
} from "@/lib/central/auth/verification-storage"
import { useResetPassword } from "@/providers/central/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ResetPasswordFormProps extends React.ComponentProps<"form"> {
  email: string
}

export function ResetPasswordForm({
  email,
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter()
  const resetPassword = useResetPassword()
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
      router.push("/central/login?reset=1")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to reset password. Please try again.")
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
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Choose a new password for {email}
          </p>
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
            <Link href="/central/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
