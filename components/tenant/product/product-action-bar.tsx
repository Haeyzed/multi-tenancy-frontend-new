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
import { productService } from "@/services/tenant/product.service"
import type { Product } from "@/types/tenant/product"

interface ProductActionBarProps {
  table: Table<Product>
}

export function ProductActionBar({ table }: ProductActionBarProps) {
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
    const result = await productService.bulkDelete(ids)
    toastApiMessage(result.message, "Selected products deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.products.all })
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
          title="Delete products?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{rows.length}</span>{" "}
              selected product{rows.length === 1 ? "" : "s"}. This action cannot be
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
