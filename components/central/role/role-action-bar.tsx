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
import { usePermissions } from "@/hooks/use-permissions"
import { Permissions } from "@/lib/central/auth/permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"
import type { Role } from "@/types/central/role"

interface RoleActionBarProps {
  table: Table<Role>
}

export function RoleActionBar({ table }: RoleActionBarProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const rows = table.getFilteredSelectedRowModel().rows
  const canDelete = can(Permissions.roles.delete)

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
    const result = await roleService.bulkDelete(ids)
    toastApiMessage(result.message, "Selected roles deleted successfully.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
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
          title="Delete roles?"
          description={
            <>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">{rows.length}</span>{" "}
              selected role{rows.length === 1 ? "" : "s"}. This action cannot be
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
