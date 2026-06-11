export const ONBOARD_BASE_PATH = "/onboard"

export function formatPlanPrice(
  amount: number,
  currency: string,
  billingCycle: "monthly" | "yearly",
): string {
  const major = amount / 100

  try {
    const formatted = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(major)

    return `${formatted}/${billingCycle === "monthly" ? "mo" : "yr"}`
  } catch {
    return `${major} ${currency}/${billingCycle === "monthly" ? "mo" : "yr"}`
  }
}

export function formatMinorAmount(amount: number, currency: string): string {
  return formatPlanPrice(amount, currency, "monthly").replace(/\/mo$/, "")
}

export function getOnboardCancelUrl(): string {
  if (typeof window === "undefined") {
    return `${ONBOARD_BASE_PATH}/cancel`
  }

  return `${window.location.origin}${ONBOARD_BASE_PATH}/cancel`
}

/** Paystack/Stripe redirect here; the API verifies payment then forwards to the frontend success page. */
export function getOnboardCallbackUrl(callbackUrl?: string): string {
  if (callbackUrl) {
    return callbackUrl
  }

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? "http://multi-tenancy-api.test/api/central"

  return `${apiBase.replace(/\/$/, "")}/payments/paystack/callback`
}
