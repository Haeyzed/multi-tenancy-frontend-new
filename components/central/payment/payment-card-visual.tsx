"use client"

import { cn } from "@/lib/utils"
import {
  formatCardExpiry,
  getCardDisplayInfo,
  type CardBrand,
} from "@/lib/central/payment/card-brand"

export interface PaymentCardVisualProps {
  brand?: string | null
  last4?: string | null
  expMonth?: number | string | null
  expYear?: number | string | null
  holderName?: string | null
  provider?: string | null
  isDefault?: boolean
  className?: string
  compact?: boolean
}

function BrandMark({ brand }: { brand: CardBrand }) {
  if (brand === "mastercard") {
    return (
      <div className="flex items-center">
        <span className="size-7 rounded-full bg-[#eb001b]/90" />
        <span className="-ms-3 size-7 rounded-full bg-[#f79e1b]/90" />
      </div>
    )
  }

  const info = getCardDisplayInfo(brand)

  return (
    <span className={cn("text-sm font-bold tracking-[0.2em]", info.accent)}>
      {info.pattern}
    </span>
  )
}

export function PaymentCardVisual({
  brand,
  last4,
  expMonth,
  expYear,
  holderName,
  provider,
  isDefault,
  className,
  compact = false,
}: PaymentCardVisualProps) {
  const info = getCardDisplayInfo(brand)
  const displayLast4 = last4?.padStart(4, "0") ?? "0000"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 text-white shadow-lg",
        info.gradient,
        compact ? "max-w-xs" : "max-w-sm",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_45%)]" />
      <div className="pointer-events-none absolute -end-8 -top-8 size-28 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/70">
            {provider ? `${provider} card` : "Payment card"}
          </p>
          {isDefault ? (
            <span className="mt-1 inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
              Default
            </span>
          ) : null}
        </div>
        <BrandMark brand={info.brand} />
      </div>

      <div className={cn("relative mt-8 font-mono tracking-[0.3em]", compact ? "text-lg" : "text-xl")}>
        •••• •••• •••• {displayLast4}
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4 text-sm">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
            Cardholder
          </p>
          <p className="truncate font-medium">
            {holderName?.trim() || "Store owner"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
            Expires
          </p>
          <p className="font-medium">
            {formatCardExpiry(expMonth, expYear)}
          </p>
        </div>
      </div>
    </div>
  )
}
