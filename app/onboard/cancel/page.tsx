import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ONBOARD_BASE_PATH } from "@/lib/central/onboard/utils"

export default function OnboardCancelPage() {
  return (
    <div className="flex flex-col gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Checkout cancelled</h1>
        <p className="text-sm text-muted-foreground">
          Your payment or card setup was cancelled. You can return to onboarding
          and try again, or resume checkout if your workspace was already created.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button render={<Link href={ONBOARD_BASE_PATH} />}>
          Back to onboarding
        </Button>
        <Button variant="outline" render={<Link href="/central/login" />}>
          Central sign in
        </Button>
      </div>
    </div>
  )
}
