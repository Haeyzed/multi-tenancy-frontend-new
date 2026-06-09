"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShieldCheckIcon,
  StarIcon,
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
import { getDomainViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { domainService } from "@/services/central/domain.service"
import type { Domain } from "@/types/central/domain"

interface DomainRowActionsProps {
  domain: Domain
  onEdit: (domain: Domain) => void
}

export function DomainRowActions({ domain, onEdit }: DomainRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [verifyOpen, setVerifyOpen] = React.useState(false)
  const [primaryOpen, setPrimaryOpen] = React.useState(false)

  const canView = can(Permissions.tenants.view)
  const canUpdate = can(Permissions.tenants.update)
  const canDelete = can(Permissions.tenants.delete)
  const canVerify = canUpdate && !domain.verified
  const canSetPrimary = canUpdate && !domain.is_primary

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.domains.all })
  }

  async function handleDelete() {
    const result = await domainService.delete(domain.id)
    toastApiMessage(result.message, "Domain deleted successfully.")
    await invalidate()
  }

  async function handleVerify() {
    const result = await domainService.verify(domain.id)
    toastApiMessage(result.message, "Domain verified.")
    await invalidate()
  }

  async function handleSetPrimary() {
    const result = await domainService.setPrimary(domain.id)
    toastApiMessage(result.message, "Domain set as primary.")
    await invalidate()
  }

  if (!canView && !canUpdate && !canDelete) {
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
          {canUpdate ? (
            <DropdownMenuItem onClick={() => onEdit(domain)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canVerify ? (
            <DropdownMenuItem onClick={() => setVerifyOpen(true)}>
              <ShieldCheckIcon />
              Verify
            </DropdownMenuItem>
          ) : null}
          {canSetPrimary ? (
            <DropdownMenuItem onClick={() => setPrimaryOpen(true)}>
              <StarIcon />
              Set as primary
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
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
          title={domain.domain}
          description={domain.tenant?.name ?? "Domain details"}
          fields={getDomainViewFields(domain)}
        />
      ) : null}

      {canVerify ? (
        <DeleteConfirmDialog
          open={verifyOpen}
          onOpenChange={setVerifyOpen}
          title="Verify domain?"
          description={
            <>
              Mark{" "}
              <span className="font-medium text-foreground">{domain.domain}</span>{" "}
              as verified for{" "}
              <span className="font-medium text-foreground">
                {domain.tenant?.name ?? "this tenant"}
              </span>
              .
            </>
          }
          confirmLabel="Verify domain"
          onConfirm={handleVerify}
        />
      ) : null}

      {canSetPrimary ? (
        <DeleteConfirmDialog
          open={primaryOpen}
          onOpenChange={setPrimaryOpen}
          title="Set as primary domain?"
          description={
            <>
              Promote{" "}
              <span className="font-medium text-foreground">{domain.domain}</span>{" "}
              to the primary domain for{" "}
              <span className="font-medium text-foreground">
                {domain.tenant?.name ?? "this tenant"}
              </span>
              . Other primary domains will be demoted.
            </>
          }
          confirmLabel="Set as primary"
          onConfirm={handleSetPrimary}
        />
      ) : null}

      {canDelete ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete domain?"
          description={
            <>
              This will remove{" "}
              <span className="font-medium text-foreground">{domain.domain}</span>{" "}
              from{" "}
              <span className="font-medium text-foreground">
                {domain.tenant?.name ?? "this tenant"}
              </span>
              .
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
