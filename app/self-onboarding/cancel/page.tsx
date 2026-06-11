import { redirect } from "next/navigation"

export default function LegacySelfOnboardingCancelRedirectPage() {
  redirect("/onboard/cancel")
}
