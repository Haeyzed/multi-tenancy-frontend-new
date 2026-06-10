"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  Building2Icon,
  HeadphonesIcon,
  TextIcon,
  UserIcon,
} from "lucide-react"
import * as React from "react"

import { SupportTicketRowActions } from "@/components/central/support-ticket/support-ticket-row-actions"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import {
  supportTicketCategoryFilterOptions,
  supportTicketPriorityFilterOptions,
  supportTicketStatusFilterOptions,
} from "@/lib/data-table/support-filter-options"
import {
  SupportTicketPriorities,
  SupportTicketStatuses,
  supportTicketCategoryLabels,
  supportTicketPriorityLabels,
  supportTicketStatusLabels,
  type SupportTicket,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/types/central/support-ticket"

interface SupportTicketColumnsOptions {
  onEdit: (ticket: SupportTicket) => void
  onAssign: (ticket: SupportTicket) => void
  onOpenConversation: (ticket: SupportTicket) => void
}

const priorityVariant: Record<SupportTicketPriority, "default" | "secondary" | "destructive" | "outline"> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
}

const statusVariant: Record<SupportTicketStatus, "default" | "secondary" | "destructive" | "outline"> = {
  open: "default",
  in_progress: "secondary",
  waiting_customer: "outline",
  resolved: "outline",
  closed: "secondary",
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy")
}

export function getSupportTicketColumns({
  onEdit,
  onAssign,
  onOpenConversation,
}: SupportTicketColumnsOptions): ColumnDef<SupportTicket>[] {
  return [
    {
      id: "subject",
      accessorKey: "subject",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Subject" />
      ),
      cell: ({ row }) => (
        <button
          type="button"
          className="flex max-w-[280px] items-center gap-1 truncate text-left font-medium hover:underline"
          onClick={() => onOpenConversation(row.original)}
        >
          <HeadphonesIcon className="size-4 shrink-0 text-muted-foreground" />
          {row.getValue("subject")}
        </button>
      ),
      meta: {
        label: "Subject",
        placeholder: "Search tickets...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tenant",
      accessorFn: (row) => row.tenant?.name ?? "—",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tenant" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Building2Icon className="size-4 text-muted-foreground" />
          {row.original.tenant?.name ?? "—"}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status as SupportTicketStatus

        return (
          <Badge variant={statusVariant[status] ?? "secondary"}>
            {supportTicketStatusLabels[status] ?? status}
          </Badge>
        )
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [...supportTicketStatusFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Priority" />
      ),
      cell: ({ row }) => {
        const priority = row.original.priority as SupportTicketPriority

        return (
          <Badge variant={priorityVariant[priority] ?? "secondary"}>
            {supportTicketPriorityLabels[priority] ?? priority}
          </Badge>
        )
      },
      meta: {
        label: "Priority",
        variant: "multiSelect",
        options: [...supportTicketPriorityFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Category" />
      ),
      cell: ({ row }) => {
        const category = row.original.category as SupportTicketCategory

        return (
          <span className="text-sm">
            {supportTicketCategoryLabels[category] ?? category}
          </span>
        )
      },
      meta: {
        label: "Category",
        variant: "multiSelect",
        options: [...supportTicketCategoryFilterOptions],
      },
      enableColumnFilter: true,
    },
    {
      id: "assignee",
      accessorFn: (row) => row.assignee?.name ?? "Unassigned",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Assignee" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <UserIcon className="size-4 text-muted-foreground" />
          {row.original.assignee?.name ?? "Unassigned"}
        </div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: ({ column }: { column: Column<SupportTicket, unknown> }) => (
        <DataTableColumnHeader column={column} label="Created" />
      ),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <SupportTicketRowActions
          ticket={row.original}
          onEdit={onEdit}
          onAssign={onAssign}
          onOpenConversation={onOpenConversation}
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}
