export function formatViewDate(value: string | null | undefined): string {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function formatViewBoolean(value: boolean | null | undefined): string {
  if (value == null) {
    return "—"
  }

  return value ? "Yes" : "No"
}

export function formatViewText(value: string | number | null | undefined): string {
  if (value == null || value === "") {
    return "—"
  }

  return String(value)
}

export function formatViewHighlights(
  features: Record<string, unknown> | null | undefined,
): string {
  if (!features) {
    return "—"
  }

  const highlights = features.highlights

  if (!Array.isArray(highlights) || highlights.length === 0) {
    return "—"
  }

  const items = highlights.filter(
    (item): item is string => typeof item === "string" && item.trim() !== "",
  )

  if (items.length === 0) {
    return "—"
  }

  return items.map((item) => `• ${item}`).join("\n")
}

export function formatViewJson(value: unknown): string {
  if (value == null) {
    return "—"
  }

  if (typeof value === "object" && Object.keys(value as object).length === 0) {
    return "—"
  }

  return JSON.stringify(value, null, 2)
}
