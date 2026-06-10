"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  BanIcon,
  EyeIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { getTokenStatus } from "@/components/central/impersonation-token/impersonation-token-columns"
import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { Permissions } from "@/lib/central/auth/permissions"
import { getImpersonationTokenViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { impersonationTokenService } from "@/services/central/impersonation-token.service"
import type { ImpersonationToken } from "@/types/central/impersonation-token"

interface ImpersonationTokenRowActionsProps {
  token: ImpersonationToken
}

export function ImpersonationTokenRowActions({
  token,
}: ImpersonationTokenRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [useOpen, setUseOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canUse = can(Permissions.impersonation.use)
  const status = getTokenStatus(token)
  const canMarkUsed = canUse && status === "valid"

  async function invalidate() {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.impersonationTokens.all,
    })
  }

  async function handleMarkUsed() {
    const result = await impersonationTokenService.markAsUsed(token.id)
    toastApiMessage(result.message, "Impersonation token marked as used.")
    await invalidate()
  }

  async function handleDelete() {
    const result = await impersonationTokenService.delete(token.id)
    toastApiMessage(result.message, "Impersonation token deleted.")
    await invalidate()
  }

  if (!canUse) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setViewOpen(true)}>
            <EyeIcon />
            View
          </DropdownMenuItem>
          {canMarkUsed ? (
            <DropdownMenuItem onClick={() => setUseOpen(true)}>
              <BanIcon />
              Mark as used
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RecordViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={token.tenant?.name ?? "Impersonation token"}
        description="One-time tenant impersonation token"
        fields={getImpersonationTokenViewFields(token)}
      />

      {canMarkUsed ? (
        <DeleteConfirmDialog
          open={useOpen}
          onOpenChange={setUseOpen}
          title="Mark token as used?"
          description={
            <>
              This will consume the impersonation token for{" "}
              <span className="font-medium text-foreground">
                {token.tenant?.name ?? "this tenant"}
              </span>
              . It cannot be used again afterward.
            </>
          }
          confirmLabel="Mark as used"
          onConfirm={handleMarkUsed}
        />
      ) : null}

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete impersonation token?"
        description={
          <>
            Permanently delete this impersonation token for{" "}
            <span className="font-medium text-foreground">
              {token.tenant?.name ?? "this tenant"}
            </span>
            .
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  )
}
