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

export function formatViewJson(value: unknown): string {
  if (value == null) {
    return "—"
  }

  if (typeof value === "object" && Object.keys(value as object).length === 0) {
    return "—"
  }

  return JSON.stringify(value, null, 2)
}
