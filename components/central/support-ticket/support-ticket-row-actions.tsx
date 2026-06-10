"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  CheckCircle2Icon,
  EyeIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  UserPlusIcon,
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
import { getSupportTicketViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { supportTicketService } from "@/services/central/support-ticket.service"
import {
  SupportTicketStatuses,
  type SupportTicket,
} from "@/types/central/support-ticket"

interface SupportTicketRowActionsProps {
  ticket: SupportTicket
  onEdit: (ticket: SupportTicket) => void
  onAssign: (ticket: SupportTicket) => void
  onOpenConversation: (ticket: SupportTicket) => void
}

export function SupportTicketRowActions({
  ticket,
  onEdit,
  onAssign,
  onOpenConversation,
}: SupportTicketRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [resolveOpen, setResolveOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  const canView = can(Permissions.support.view)
  const canManage = can(Permissions.support.manage)
  const canResolve =
    canManage &&
    ticket.status !== SupportTicketStatuses.Resolved &&
    ticket.status !== SupportTicketStatuses.Closed

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets.all })
  }

  async function handleResolve() {
    const result = await supportTicketService.resolve(ticket.id)
    toastApiMessage(result.message, "Support ticket resolved.")
    await invalidate()
  }

  async function handleDelete() {
    const result = await supportTicketService.delete(ticket.id)
    toastApiMessage(result.message, "Support ticket deleted.")
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
            <DropdownMenuItem onClick={() => onOpenConversation(ticket)}>
              <MessageSquareIcon />
              Conversation
            </DropdownMenuItem>
          ) : null}
          {canView ? (
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem onClick={() => onEdit(ticket)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canManage ? (
            <DropdownMenuItem onClick={() => onAssign(ticket)}>
              <UserPlusIcon />
              Assign
            </DropdownMenuItem>
          ) : null}
          {canResolve ? (
            <DropdownMenuItem onClick={() => setResolveOpen(true)}>
              <CheckCircle2Icon />
              Resolve
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
          title={ticket.subject}
          description={ticket.tenant?.name ?? "Support ticket"}
          fields={getSupportTicketViewFields(ticket)}
        />
      ) : null}

      {canResolve ? (
        <DeleteConfirmDialog
          open={resolveOpen}
          onOpenChange={setResolveOpen}
          title="Resolve ticket?"
          description={
            <>
              Mark{" "}
              <span className="font-medium text-foreground">{ticket.subject}</span>{" "}
              as resolved for{" "}
              <span className="font-medium text-foreground">
                {ticket.tenant?.name ?? "this tenant"}
              </span>
              .
            </>
          }
          confirmLabel="Resolve ticket"
          onConfirm={handleResolve}
        />
      ) : null}

      {canManage ? (
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete ticket?"
          description={
            <>
              Permanently delete{" "}
              <span className="font-medium text-foreground">{ticket.subject}</span>{" "}
              and all associated messages.
            </>
          }
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  )
}
