import { Suspense } from "react"

import { SignupSuccessContent } from "@/components/central/auth/signup-success-content"

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading...</p>}>
      <SignupSuccessContent />
    </Suspense>
  )
}
