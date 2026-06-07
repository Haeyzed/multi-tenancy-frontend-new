"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2Icon, XCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SignupSuccessContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
  const message = searchParams.get("message")
  const purpose = searchParams.get("purpose")
  const isSuccess = status !== "error"

  return (
    <div className="flex flex-col gap-6 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
        {isSuccess ? (
          <CheckCircle2Icon className="size-6 text-green-600" />
        ) : (
          <XCircleIcon className="size-6 text-destructive" />
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {isSuccess ? "Payment verified" : "Payment verification failed"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSuccess
            ? purpose === "trial_setup"
              ? "Your card was verified and your trial workspace is ready. You were charged a small verification fee (not the full plan price)."
              : "Your payment was verified and your workspace is ready."
            : (message ?? "We could not verify your payment. Please try again or contact support.")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {isSuccess ? (
          <Button render={<Link href="/central/login" />}>Sign in to your workspace</Button>
        ) : (
          <Button render={<Link href="/central/signup" />}>Back to signup</Button>
        )}
        <Button variant="outline" render={<Link href="/central/login" />}>
          Go to login
        </Button>
      </div>
    </div>
  )
}
