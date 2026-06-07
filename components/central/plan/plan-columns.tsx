"use client"

import type { Column, ColumnDef } from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  GlobeIcon,
  LayersIcon,
  ListChecksIcon,
  TextIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { PlanRowActions } from "@/components/central/plan/plan-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { getSelectAllCheckboxProps } from "@/lib/data-table/checkbox-utils"
import type { Plan } from "@/types/central/plan"

function formatPrice(amountMinor: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountMinor / 100)
}

interface GetPlanColumnsOptions {
  onEdit: (plan: Plan) => void
}

export function getPlanColumns({
  onEdit,
}: GetPlanColumnsOptions): ColumnDef<Plan>[] {
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
      id: "name",
      accessorKey: "name",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 font-medium">
            <LayersIcon className="size-4 text-muted-foreground" />
            {row.getValue("name")}
          </div>
          {row.original.slug ? (
            <span className="ps-5 font-mono text-xs text-muted-foreground">
              {row.original.slug}
            </span>
          ) : null}
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search plans...",
        variant: "text",
        icon: TextIcon,
      },
      enableColumnFilter: true,
      enablePinning: true,
    },
    {
      id: "tier",
      accessorKey: "tier",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Tier" />
      ),
      cell: ({ cell }) => (
        <span className="tabular-nums">{cell.getValue<number>()}</span>
      ),
    },
    {
      id: "price_monthly",
      accessorKey: "price_monthly",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Monthly" />
      ),
      cell: ({ row }) =>
        formatPrice(row.original.price_monthly, row.original.currency),
    },
    {
      id: "price_yearly",
      accessorKey: "price_yearly",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Yearly" />
      ),
      cell: ({ row }) =>
        formatPrice(row.original.price_yearly, row.original.currency),
    },
    {
      id: "plan_features",
      accessorFn: (row) => row.plan_features?.length ?? 0,
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Features" />
      ),
      cell: ({ row }) => {
        const count = row.original.plan_features?.length ?? 0

        return (
          <div className="flex items-center gap-1">
            <ListChecksIcon className="size-4 text-muted-foreground" />
            <span className="tabular-nums">{count}</span>
          </div>
        )
      },
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Active" />
      ),
      cell: ({ cell }) => {
        const isActive = cell.getValue<boolean>()

        return (
          <Badge variant="outline">
            {isActive ? (
              <>
                <CheckCircle2Icon />
                Active
              </>
            ) : (
              <>
                <XCircleIcon />
                Inactive
              </>
            )}
          </Badge>
        )
      },
    },
    {
      id: "is_public",
      accessorKey: "is_public",
      header: ({ column }: { column: Column<Plan, unknown> }) => (
        <DataTableColumnHeader column={column} label="Public" />
      ),
      cell: ({ cell }) => {
        const isPublic = cell.getValue<boolean>()

        return (
          <Badge variant="outline">
            {isPublic ? (
              <>
                <GlobeIcon />
                Public
              </>
            ) : (
              <>
                <XCircleIcon />
                Private
              </>
            )}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PlanRowActions plan={row.original} onEdit={onEdit} />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
      enablePinning: true,
    },
  ]
}

export function usePlanColumns(options: GetPlanColumnsOptions) {
  return React.useMemo(() => getPlanColumns(options), [options.onEdit])
}
