"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { ApiError } from "@/lib/central/api/errors"
import { useTenantAuth } from "@/providers/tenant/auth-provider"
import { useTenantBootstrap } from "@/providers/tenant/tenant-bootstrap-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function TenantLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const { login, isLoading } = useTenantAuth()
  const { companyName } = useTenantBootstrap()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await login({ email, password })
      router.push("/admin/dashboard")
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to sign in. Please try again.")
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
          <h1 className="text-2xl font-bold">Sign in to {companyName}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Use your store staff credentials to access the admin panel
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
            placeholder="owner@store.example.com"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/admin/forgot-password"
              className="ms-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <FieldDescription className="text-center">
            Staff access only. Contact your store owner if you need an account.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
