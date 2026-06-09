export function formatMoneyFromMinor(
  amountMinor: number,
  currency = "NGN",
): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountMinor / 100)
}

export function isMoneyMetricKey(key: string): boolean {
  return (
    key.includes("amount") ||
    key.includes("collected") ||
    key.includes("refunded") ||
    key.includes("outstanding") ||
    key.includes("overdue_amount")
  )
}

export function formatBillingMetricValue(
  key: string,
  value: number | string,
  currency = "NGN",
): string {
  if (typeof value === "string") {
    return value
  }

  if (isMoneyMetricKey(key)) {
    return formatMoneyFromMinor(value, currency)
  }

  return value.toLocaleString()
}
