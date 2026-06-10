"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Loader2Icon, SendIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { usePermissions } from "@/hooks/use-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { Permissions } from "@/lib/central/auth/permissions"
import { queryKeys } from "@/lib/central/query/keys"
import { supportMessageService } from "@/services/central/support-message.service"
import { supportTicketService } from "@/services/central/support-ticket.service"
import {
  MessageSenderTypes,
  messageSenderTypeLabels,
  type MessageSenderType,
  type SupportMessage,
} from "@/types/central/support-message"
import {
  supportTicketPriorityLabels,
  supportTicketStatusLabels,
  type SupportTicket,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/types/central/support-ticket"
import { useAuth } from "@/providers/central/auth-provider"

interface SupportTicketMessagesDialogProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return "—"
  }

  return format(new Date(value), "MMM d, yyyy HH:mm")
}

function getSenderLabel(message: SupportMessage) {
  if (message.sender?.name) {
    return message.sender.name
  }

  return messageSenderTypeLabels[message.sender_type as MessageSenderType] ?? message.sender_type
}

export function SupportTicketMessagesDialog({
  ticket,
  open,
  onOpenChange,
}: SupportTicketMessagesDialogProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { can } = usePermissions()
  const canManage = can(Permissions.support.manage)
  const [replyBody, setReplyBody] = React.useState("")
  const [isInternal, setIsInternal] = React.useState(false)

  const ticketQuery = useQuery({
    queryKey: queryKeys.supportTickets.detail(ticket?.id ?? 0),
    queryFn: () => supportTicketService.get(ticket!.id),
    enabled: open && ticket != null,
  })

  const detail = ticketQuery.data
  const messages = detail?.messages ?? []

  React.useEffect(() => {
    if (open) {
      setReplyBody("")
      setIsInternal(false)
    }
  }, [open, ticket?.id])

  const replyMutation = useMutation({
    mutationFn: async () => {
      if (!ticket || !replyBody.trim()) {
        throw new Error("Enter a reply.")
      }

      return supportMessageService.create({
        ticket_id: ticket.id,
        sender_type: MessageSenderTypes.Admin,
        sender_id: user?.id ?? null,
        body: replyBody.trim(),
        is_internal: isInternal,
      })
    },
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Reply sent.")
      setReplyBody("")
      setIsInternal(false)
      await queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets.all })
    },
  })

  const readMutation = useMutation({
    mutationFn: (messageId: number) => supportMessageService.markAsRead(messageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets.all })
    },
  })

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[85vh] flex-col sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{detail?.subject ?? ticket?.subject}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="space-y-1">
            <span className="block">{detail?.tenant?.name ?? ticket?.tenant?.name}</span>
            {detail ? (
              <span className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">
                  {supportTicketStatusLabels[detail.status as SupportTicketStatus]}
                </Badge>
                <Badge variant="outline">
                  {supportTicketPriorityLabels[detail.priority as SupportTicketPriority]}
                </Badge>
                {detail.assignee?.name ? (
                  <Badge variant="outline">Assigned to {detail.assignee.name}</Badge>
                ) : null}
              </span>
            ) : null}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md border p-4">
          {ticketQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <>
              <div className="rounded-md bg-muted/40 p-3">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Original request
                </p>
                <p className="whitespace-pre-wrap text-sm">{detail?.body ?? ticket?.body}</p>
              </div>

              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No replies yet.</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-md border p-3 ${
                      message.is_internal ? "border-dashed bg-muted/20" : "bg-card"
                    }`}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{getSenderLabel(message)}</span>
                        {message.is_internal ? (
                          <Badge variant="secondary">Internal note</Badge>
                        ) : null}
                        {!message.is_read ? (
                          <Badge variant="destructive">Unread</Badge>
                        ) : null}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{message.body}</p>
                    {canManage && !message.is_read ? (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="mt-2 h-auto px-0"
                        onClick={() => readMutation.mutate(message.id)}
                        disabled={readMutation.isPending}
                      >
                        Mark as read
                      </Button>
                    ) : null}
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <Can permission={Permissions.support.manage}>
          <form
            className="space-y-3 border-t pt-4"
            onSubmit={(event) => {
              event.preventDefault()
              replyMutation.mutate()
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="ticket-reply">Reply</FieldLabel>
                <Textarea
                  id="ticket-reply"
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  placeholder="Write a reply to the tenant..."
                  rows={3}
                  disabled={replyMutation.isPending}
                />
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id="ticket-internal"
                  checked={isInternal}
                  onCheckedChange={(checked) => setIsInternal(checked === true)}
                  disabled={replyMutation.isPending}
                />
                <FieldLabel htmlFor="ticket-internal">Internal note only</FieldLabel>
              </Field>
            </FieldGroup>
            <Button type="submit" disabled={replyMutation.isPending || !replyBody.trim()}>
              {replyMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <SendIcon />
              )}
              Send reply
            </Button>
          </form>
        </Can>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
