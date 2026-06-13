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
import { brandService } from "@/services/tenant/brand.service"
import type { Brand } from "@/types/tenant/brand"

interface BrandActionBarProps {
  table: Table<Brand>
}

export function BrandActionBar({ table }: BrandActionBarProps) {
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
    const result = await brandService.bulkDelete(ids)
    toastApiMessage(result.message, "Selected brands deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
    table.toggleAllRowsSelected(false)
  }

  async function handleBulkRestore() {
    const ids = trashedRows.map((row) => row.original.id)
    const result = await brandService.bulkRestore(ids)
    toastApiMessage(result.message, "Selected brands restored successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
    table.toggleAllRowsSelected(false)
  }

  async function handleBulkUnlink() {
    const ids = linkedRows.map((row) => row.original.id)
    const result = await brandService.bulkUnlink(ids)
    toastApiMessage(result.message, "Products unlinked from selected brands successfully.")
    await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
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
          title="Delete brands?"
          description={
            <>
              This will move{" "}
              <span className="font-medium text-foreground">{activeRows.length}</span>{" "}
              selected brand{activeRows.length === 1 ? "" : "s"} to the trash.
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
          title="Restore brands?"
          description={
            <>
              This will restore{" "}
              <span className="font-medium text-foreground">{trashedRows.length}</span>{" "}
              selected brand{trashedRows.length === 1 ? "" : "s"}.
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
          title="Unlink products from brands?"
          description={
            <>
              This will remove brand assignments from up to{" "}
              <span className="font-medium text-foreground">{linkedProductCount}</span>{" "}
              linked product{linkedProductCount === 1 ? "" : "s"} across{" "}
              <span className="font-medium text-foreground">{linkedRows.length}</span>{" "}
              selected brand{linkedRows.length === 1 ? "" : "s"}.
            </>
          }
          onConfirm={handleBulkUnlink}
          confirmLabel={`Unlink ${linkedRows.length}`}
        />
      ) : null}
    </>
  )
}
