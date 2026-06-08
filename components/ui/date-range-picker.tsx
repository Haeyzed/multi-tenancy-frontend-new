"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDashboardDateRangeLabel } from "@/lib/central/dashboard/date-range"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  className?: string
  id?: string
  align?: "start" | "center" | "end"
}

export function DateRangePicker({
  value,
  onChange,
  className,
  id = "dashboard-date-range",
  align = "end",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            className={cn("justify-start px-2.5 font-normal", className)}
          >
            <CalendarIcon data-icon="inline-start" />
            {formatDashboardDateRangeLabel(value)}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={(range) => {
            onChange?.(range)
            if (range?.from && range?.to) {
              setOpen(false)
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

export function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>()

  return (
    <DateRangePicker
      value={date}
      onChange={setDate}
      className="w-[280px]"
    />
  )
}

export function formatDateRangeParam(date: Date) {
  return format(date, "yyyy-MM-dd")
}
