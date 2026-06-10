"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { supportTicketService } from "@/services/central/support-ticket.service"
import { userService } from "@/services/central/user.service"
import type { SupportTicket } from "@/types/central/support-ticket"

interface SupportTicketAssignDialogProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportTicketAssignDialog({
  ticket,
  open,
  onOpenChange,
}: SupportTicketAssignDialogProps) {
  const queryClient = useQueryClient()
  const [adminId, setAdminId] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const usersQuery = useQuery({
    queryKey: [...queryKeys.users.all, "assign-options"] as const,
    queryFn: () =>
      userService.getPaginated({ page: 1, per_page: 100, is_active: "active" }),
    enabled: open,
  })

  const userOptions = React.useMemo(
    () =>
      (usersQuery.data?.data ?? []).map((user) => ({
        value: String(user.id),
        label: user.name,
      })),
    [usersQuery.data?.data],
  )

  React.useEffect(() => {
    if (open && ticket) {
      setAdminId(ticket.assigned_to ? String(ticket.assigned_to) : "")
      setErrorMessage(null)
    }
  }, [open, ticket])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!ticket || !adminId) {
        throw new Error("Select an assignee.")
      }

      return supportTicketService.assign(ticket.id, Number(adminId))
    },
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Ticket assigned successfully.")
      await queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets.all })
      onOpenChange(false)
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong.",
      )
    },
  })

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Assign ticket</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Assign{" "}
            <span className="font-medium text-foreground">
              {ticket?.subject ?? "this ticket"}
            </span>{" "}
            to a platform administrator.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {usersQuery.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ticket-assignee">Assignee</FieldLabel>
              <OptionsCombobox
                id="ticket-assignee"
                items={userOptions}
                value={adminId}
                onValueChange={setAdminId}
                placeholder="Select admin"
                disabled={mutation.isPending}
              />
              <FieldDescription>
                Assignment moves open tickets to in progress automatically.
              </FieldDescription>
            </Field>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </FieldGroup>
        )}

        <ResponsiveDialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !adminId}
          >
            {mutation.isPending ? <Loader2Icon className="animate-spin" /> : null}
            Assign
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
