import { Suspense } from "react"

import { VerifyOtpPageContent } from "./verify-otp-content"

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      }
    >
      <VerifyOtpPageContent />
    </Suspense>
  )
}
