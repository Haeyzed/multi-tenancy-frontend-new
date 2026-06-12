"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { Table } from "@tanstack/react-table"
import { Trash2Icon, XIcon } from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
} from "@/components/ui/action-bar"
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { brandService } from "@/services/tenant/brand.service"
import type { Brand } from "@/types/tenant/brand"

interface BrandActionBarProps {
  table: Table<Brand>
}

export function BrandActionBar({ table }: BrandActionBarProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const rows = table.getFilteredSelectedRowModel().rows
  const canDelete = can(TenantPermissions.catalog.manage)

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table],
  )

  async function handleBulkDelete() {
    const ids = rows.map((row) => row.original.id)
    const result = await brandService.bulkDelete(ids)
    toastApiMessage(result.message, "Selected brands deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
    table.toggleAllRowsSelected(false)
  }

  return (
    <>
      <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
        <ActionBarSelection>{rows.length} selected</ActionBarSelection>
        <ActionBarSeparator />
        <ActionBarGroup>
          <ActionBarItem onClick={() => table.toggleAllRowsSelected(false)}>
            Clear selection
          </ActionBarItem>
          {canDelete ? (
            <ActionBarItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault()
                setDeleteOpen(true)
              }}
            >
              <Trash2Icon />
              Delete
            </ActionBarItem>
          ) : null}
          <ActionBarClose>
            <XIcon />
          </ActionBarClose>
        </ActionBarGroup>
      </ActionBar>

      {canDelete ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete brands?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{rows.length}</span>{" "}
              selected brand{rows.length === 1 ? "" : "s"}. This action cannot be
              undone.
            </>
          }
          onConfirm={handleBulkDelete}
          confirmLabel={`Delete ${rows.length}`}
        />
      ) : null}
    </>
  )
}
