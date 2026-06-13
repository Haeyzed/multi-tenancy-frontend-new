"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { Table } from "@tanstack/react-table"
import { Link2OffIcon, RotateCcwIcon, Trash2Icon, XIcon } from "lucide-react"
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
import { categoryService } from "@/services/tenant/category.service"
import type { Category } from "@/types/tenant/category"

interface CategoryActionBarProps {
  table: Table<Category>
}

export function CategoryActionBar({ table }: CategoryActionBarProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [restoreOpen, setRestoreOpen] = React.useState(false)
  const [unlinkOpen, setUnlinkOpen] = React.useState(false)

  const rows = table.getFilteredSelectedRowModel().rows
  const canManage = can(TenantPermissions.catalog.manage)
  const trashedRows = rows.filter((row) => row.original.deleted_at)
  const activeRows = rows.filter((row) => !row.original.deleted_at)
  const linkedRows = activeRows.filter((row) => (row.original.products_count ?? 0) > 0)
  const linkedProductCount = linkedRows.reduce(
    (total, row) => total + (row.original.products_count ?? 0),
    0,
  )

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false)
      }
    },
    [table],
  )

  async function handleBulkDelete() {
    const ids = activeRows.map((row) => row.original.id)
    const result = await categoryService.bulkDelete(ids)
    toastApiMessage(result.message, "Selected categories deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
    table.toggleAllRowsSelected(false)
  }

  async function handleBulkRestore() {
    const ids = trashedRows.map((row) => row.original.id)
    const result = await categoryService.bulkRestore(ids)
    toastApiMessage(result.message, "Selected categories restored successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
    table.toggleAllRowsSelected(false)
  }

  async function handleBulkUnlink() {
    const ids = linkedRows.map((row) => row.original.id)
    const result = await categoryService.bulkUnlink(ids)
    toastApiMessage(
      result.message,
      "Products unlinked from selected categories successfully.",
    )
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
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
          {canManage && trashedRows.length > 0 ? (
            <ActionBarItem
              onSelect={(event) => {
                event.preventDefault()
                setRestoreOpen(true)
              }}
            >
              <RotateCcwIcon />
              Restore
            </ActionBarItem>
          ) : null}
          {canManage && linkedRows.length > 0 ? (
            <ActionBarItem
              onSelect={(event) => {
                event.preventDefault()
                setUnlinkOpen(true)
              }}
            >
              <Link2OffIcon />
              Unlink products
            </ActionBarItem>
          ) : null}
          {canManage && activeRows.length > 0 ? (
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

      {canManage && activeRows.length > 0 ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete categories?"
          description={
            <>
              This will move{" "}
              <span className="font-medium text-foreground">{activeRows.length}</span>{" "}
              selected categor{activeRows.length === 1 ? "y" : "ies"} to the trash.
            </>
          }
          onConfirm={handleBulkDelete}
          confirmLabel={`Delete ${activeRows.length}`}
        />
      ) : null}

      {canManage && trashedRows.length > 0 ? (
        <DeleteConfirmDialog
          open={restoreOpen}
          onOpenChange={setRestoreOpen}
          title="Restore categories?"
          description={
            <>
              This will restore{" "}
              <span className="font-medium text-foreground">{trashedRows.length}</span>{" "}
              selected categor{trashedRows.length === 1 ? "y" : "ies"}.
            </>
          }
          onConfirm={handleBulkRestore}
          confirmLabel={`Restore ${trashedRows.length}`}
        />
      ) : null}

      {canManage && linkedRows.length > 0 ? (
        <DeleteConfirmDialog
          open={unlinkOpen}
          onOpenChange={setUnlinkOpen}
          title="Unlink products from categories?"
          description={
            <>
              This will remove category assignments from up to{" "}
              <span className="font-medium text-foreground">{linkedProductCount}</span>{" "}
              linked product{linkedProductCount === 1 ? "" : "s"} across{" "}
              <span className="font-medium text-foreground">{linkedRows.length}</span>{" "}
              selected categor{linkedRows.length === 1 ? "y" : "ies"}.
            </>
          }
          onConfirm={handleBulkUnlink}
          confirmLabel={`Unlink ${linkedRows.length}`}
        />
      ) : null}
    </>
  )
}
