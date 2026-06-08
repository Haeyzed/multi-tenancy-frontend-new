import { endOfDay, format, startOfDay, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export function getDefaultDashboardDateRange(): DateRange {
  const to = endOfDay(new Date())
  const from = startOfDay(subDays(to, 29))

  return { from, to }
}

export function formatDashboardDateParam(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export function formatDashboardDateRangeLabel(range: DateRange | undefined) {
  if (!range?.from) {
    return "Select date range"
  }

  if (!range.to) {
    return format(range.from, "LLL dd, y")
  }

  return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
}

export function dashboardDateRangeToParams(range: DateRange | undefined) {
  if (!range?.from || !range?.to) {
    return undefined
  }

  return {
    start_date: formatDashboardDateParam(range.from),
    end_date: formatDashboardDateParam(range.to),
  }
}
