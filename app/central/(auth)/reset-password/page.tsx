import { Suspense } from "react"

import { ResetPasswordPageContent } from "./reset-password-content"

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  )
}
