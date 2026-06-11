import { Suspense } from "react"

import { OnboardSuccessContent } from "@/components/central/auth/onboard-success-content"

export default function OnboardSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading...</p>}>
      <OnboardSuccessContent />
    </Suspense>
  )
}
