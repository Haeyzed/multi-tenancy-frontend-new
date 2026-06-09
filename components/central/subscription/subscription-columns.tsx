"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  BanIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  LayersIcon,
  PauseCircleIcon,
  SparklesIcon,
  TextIcon,
} from "lucide-react"
import * as React from "react"

import { SubscriptionRowActions } from "@/components/central/subscription/subscription-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import { subscriptionStatusFilterOptions } from "@/lib/data-table/billing-filter-options"
import {
  SubscriptionStatuses,
  subscriptionStatusLabels,
  type Subscription,
  type SubscriptionStatus,
} from "@/types/central/subscription"

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [SubscriptionStatuses.Active]: {
    label: subscriptionStatusLabels.active,
    icon: CheckCircle2Icon,
  },
  [SubscriptionStatuses.Trialing]: {
    label: subscriptionStatusLabels.trialing,
    icon: SparklesIcon,
  },
  [SubscriptionStatuses.PastDue]: {
    label: subscriptionStatusLabels.past_due,
    icon: AlertCircleIcon,
  },
  [SubscriptionStatuses.Cancelled]: {
    label: subscriptionStatusLabels.cancelled,
    icon: BanIcon,
  },
  [SubscriptionStatuses.Paused]: {
    label: subscriptionStatusLabels.paused,
    icon: PauseCircleIcon,
  },
  [SubscriptionStatuses.Expired]: {
    label: subscriptionStatusLabels.expired,
    icon: ClockIcon,
  },
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

export function getSubscriptionColumns(): ColumnDef<Subscription>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          {...getSelectAllCheckboxProps(table)}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-medium">
            <Building2Icon className="size-4 text-muted-foreground" />
            {row.original.tenant?.name ?? "—"}
          </div>
          {row.original.tenant?.domain ? (
            <span className="ps-5 text-xs text-muted-foreground">
              {row.original.tenant.domain}
            </span>
          ) : null}
        </div>
      ),
      meta: {
        label: "Tenant",
        placeholder: "Search tenants...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<SubscriptionStatus>()
        const config = statusConfig[status]
        const Icon = config.icon

        return (
          <Badge variant="outline" className="capitalize">
            <Icon />
            {config.label}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...subscriptionStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "plan",
      accessorFn: (row) => row.plan?.name ?? "—",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Plan" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-medium">
            <LayersIcon className="size-4 text-muted-foreground" />
            {row.original.plan?.name ?? "—"}
          </div>
          {row.original.plan?.slug ? (
            <span className="ps-5 font-mono text-xs text-muted-foreground">
              {row.original.plan.slug}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "billing_cycle",
      accessorKey: "billing_cycle",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Billing Cycle" />
      ),
      cell: ({ cell }) => (
        <span className="capitalize">{cell.getValue<string>()}</span>
      ),
    },
    {
      id: "latest_invoice",
      accessorFn: (row) => row.latest_invoice?.invoice_number ?? "—",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Latest Invoice" />
      ),
      cell: ({ row }) => {
        const invoice = row.original.latest_invoice

        if (!invoice) {
          return "—"
        }

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 font-medium">
              <FileTextIcon className="size-4 text-muted-foreground" />
              {invoice.invoice_number}
            </div>
            <span className="ps-5 text-xs capitalize text-muted-foreground">
              {invoice.status}
            </span>
          </div>
        )
      },
    },
    {
      id: "payment_provider",
      accessorKey: "payment_provider",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Provider" />
      ),
      cell: ({ cell }) => {
        const provider = cell.getValue<string | null>()

        return (
          <div className="flex items-center gap-1 capitalize">
            <CreditCardIcon className="size-4 text-muted-foreground" />
            {provider ?? "—"}
          </div>
        )
      },
    },
    {
      id: "current_period_end",
      accessorKey: "current_period_end",
      header: ({ column }: { column: Column<Subscription, unknown> }) => (
        <DataTableColumnHeader column={column} label="Period End" />
      ),
      cell: ({ cell }) => (
        <div className="flex items-center gap-1">
          <CalendarIcon className="size-4 text-muted-foreground" />
          {formatDate(cell.getValue<string | null>())}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <SubscriptionRowActions subscription={row.original} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function useSubscriptionColumns() {
  return React.useMemo(() => getSubscriptionColumns(), [])
}
