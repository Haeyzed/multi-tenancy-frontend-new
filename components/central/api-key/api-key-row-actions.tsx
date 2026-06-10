"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  BanIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

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
import { getApiKeyViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { apiKeyService } from "@/services/central/api-key.service"
import type { ApiKey } from "@/types/central/api-key"

interface ApiKeyRowActionsProps {
  apiKey: ApiKey
  onEdit: (apiKey: ApiKey) => void
}

export function ApiKeyRowActions({ apiKey, onEdit }: ApiKeyRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [revokeOpen, setRevokeOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.apiKeys.view)
  const canManage = can(Permissions.apiKeys.manage)
  const canRevoke = canManage && apiKey.is_active

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys.all })
  }

  async function handleRevoke() {
    const result = await apiKeyService.revoke(apiKey.id)
    toastApiMessage(result.message, "API key revoked.")
    await invalidate()
  }

  async function handleDelete() {
    const result = await apiKeyService.delete(apiKey.id)
    toastApiMessage(result.message, "API key deleted.")
    await invalidate()
  }

  if (!canView && !canManage) {
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
          {canView ? (
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem onClick={() => onEdit(apiKey)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canRevoke ? (
            <DropdownMenuItem onClick={() => setRevokeOpen(true)}>
              <BanIcon />
              Revoke
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canView ? (
        <RecordViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          title={apiKey.name}
          description={apiKey.tenant?.name ?? "API key details"}
          fields={getApiKeyViewFields(apiKey)}
        />
      ) : null}

      {canRevoke ? (
        <DeleteConfirmDialog
          open={revokeOpen}
          onOpenChange={setRevokeOpen}
          title="Revoke API key?"
          description={
            <>
              This will deactivate{" "}
              <span className="font-medium text-foreground">{apiKey.name}</span>{" "}
              for{" "}
              <span className="font-medium text-foreground">
                {apiKey.tenant?.name ?? "this tenant"}
              </span>
              . Existing integrations using this key will stop working.
            </>
          }
          confirmLabel="Revoke key"
          onConfirm={handleRevoke}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete API key?"
          description={
            <>
              Permanently delete{" "}
              <span className="font-medium text-foreground">{apiKey.name}</span>.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
