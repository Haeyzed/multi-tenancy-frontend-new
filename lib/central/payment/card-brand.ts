export type CardBrand = "visa" | "mastercard" | "verve" | "amex" | "unknown"

export interface CardDisplayInfo {
  brand: CardBrand
  label: string
  gradient: string
  accent: string
  pattern: string
}

const brandMap: Record<CardBrand, CardDisplayInfo> = {
  visa: {
    brand: "visa",
    label: "Visa",
    gradient: "from-[#1a1f71] via-[#2d4aa8] to-[#1a1f71]",
    accent: "text-white/90",
    pattern: "VISA",
  },
  mastercard: {
    brand: "mastercard",
    label: "Mastercard",
    gradient: "from-[#1a1a1a] via-[#3d3d3d] to-[#1a1a1a]",
    accent: "text-white/90",
    pattern: "MC",
  },
  verve: {
    brand: "verve",
    label: "Verve",
    gradient: "from-[#004b23] via-[#1b7f4e] to-[#004b23]",
    accent: "text-white/90",
    pattern: "VERVE",
  },
  amex: {
    brand: "amex",
    label: "American Express",
    gradient: "from-[#006fcf] via-[#0095da] to-[#006fcf]",
    accent: "text-white/90",
    pattern: "AMEX",
  },
  unknown: {
    brand: "unknown",
    label: "Card",
    gradient: "from-slate-700 via-slate-600 to-slate-800",
    accent: "text-white/80",
    pattern: "CARD",
  },
}

export function normalizeCardBrand(value?: string | null): CardBrand {
  if (!value) {
    return "unknown"
  }

  const normalized = value.toLowerCase().replace(/[\s_-]+/g, "")

  if (normalized.includes("visa")) {
    return "visa"
  }

  if (normalized.includes("master")) {
    return "mastercard"
  }

  if (normalized.includes("verve")) {
    return "verve"
  }

  if (normalized.includes("amex") || normalized.includes("americanexpress")) {
    return "amex"
  }

  return "unknown"
}

export function getCardDisplayInfo(value?: string | null): CardDisplayInfo {
  return brandMap[normalizeCardBrand(value)]
}

export function formatCardExpiry(
  month?: number | string | null,
  year?: number | string | null,
): string {
  if (!month || !year) {
    return "—"
  }

  const monthValue = String(month).padStart(2, "0")
  const yearValue = String(year).slice(-2)

  return `${monthValue}/${yearValue}`
}
