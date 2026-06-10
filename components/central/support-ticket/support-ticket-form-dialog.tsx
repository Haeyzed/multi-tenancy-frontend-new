"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import {
  supportTicketCategoryOptions,
  supportTicketPriorityOptions,
  supportTicketStatusOptions,
} from "@/lib/data-table/support-filter-options"
import { queryKeys } from "@/lib/central/query/keys"
import { supportTicketService } from "@/services/central/support-ticket.service"
import { tenantService } from "@/services/central/tenant.service"
import {
  SupportTicketCategories,
  SupportTicketPriorities,
  SupportTicketStatuses,
  type SupportTicket,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/types/central/support-ticket"
import { useTenant } from "@/providers/central/tenant-provider"

interface SupportTicketFormDialogProps {
  ticket: SupportTicket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SupportTicketFormState {
  tenantId: string
  category: SupportTicketCategory
  priority: SupportTicketPriority
  status: SupportTicketStatus
  subject: string
  body: string
}

function ticketToFormState(
  ticket: SupportTicket | null,
  defaultTenantId: string | null,
): SupportTicketFormState {
  return {
    tenantId: ticket?.tenant_id ?? defaultTenantId ?? "",
    category: ticket?.category ?? SupportTicketCategories.General,
    priority: ticket?.priority ?? SupportTicketPriorities.Medium,
    status: ticket?.status ?? SupportTicketStatuses.Open,
    subject: ticket?.subject ?? "",
    body: ticket?.body ?? "",
  }
}

export function SupportTicketFormDialog({
  ticket,
  open,
  onOpenChange,
}: SupportTicketFormDialogProps) {
  const isEditing = ticket !== null
  const queryClient = useQueryClient()
  const { selectedTenantId } = useTenant()
  const [form, setForm] = React.useState<SupportTicketFormState>(() =>
    ticketToFormState(ticket, selectedTenantId),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const tenantsQuery = useQuery({
    queryKey: queryKeys.tenants.options(),
    queryFn: () => tenantService.getOptions(),
    enabled: open,
  })

  const tenants = tenantsQuery.data ?? []

  React.useEffect(() => {
    if (open) {
      setForm(ticketToFormState(ticket, selectedTenantId))
      setErrorMessage(null)
    }
  }, [open, ticket, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async (state: SupportTicketFormState) => {
      const payload = {
        tenant_id: state.tenantId,
        category: state.category,
        priority: state.priority,
        status: state.status,
        subject: state.subject.trim(),
        body: state.body.trim(),
      }

      if (isEditing && ticket) {
        return supportTicketService.update(ticket.id, payload)
      }

      return supportTicketService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Ticket updated successfully." : "Ticket created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.supportTickets.all })
      onOpenChange(false)
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong.",
      )
    },
  })

  const isPending = mutation.isPending
  const tenantLocked = Boolean(selectedTenantId) && !isEditing

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit ticket" : "Create ticket"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update ticket details and workflow status."
              : "Open a new support request on behalf of a tenant."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate(form)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ticket-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="ticket-tenant"
                items={tenants}
                value={form.tenantId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, tenantId: value }))
                }
                placeholder="Select tenant"
                disabled={tenantLocked || isPending || isEditing}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="ticket-subject">Subject</FieldLabel>
              <Input
                id="ticket-subject"
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subject: event.target.value }))
                }
                disabled={isPending}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="ticket-category">Category</FieldLabel>
                <OptionsCombobox
                  id="ticket-category"
                  items={[...supportTicketCategoryOptions]}
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      category: value as SupportTicketCategory,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="ticket-priority">Priority</FieldLabel>
                <OptionsCombobox
                  id="ticket-priority"
                  items={[...supportTicketPriorityOptions]}
                  value={form.priority}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      priority: value as SupportTicketPriority,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>

              {isEditing ? (
                <Field>
                  <FieldLabel htmlFor="ticket-status">Status</FieldLabel>
                  <OptionsCombobox
                    id="ticket-status"
                    items={[...supportTicketStatusOptions]}
                    value={form.status}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        status: value as SupportTicketStatus,
                      }))
                    }
                    disabled={isPending}
                  />
                </Field>
              ) : null}
            </div>

            <Field>
              <FieldLabel htmlFor="ticket-body">Description</FieldLabel>
              <Textarea
                id="ticket-body"
                value={form.body}
                onChange={(event) =>
                  setForm((current) => ({ ...current, body: event.target.value }))
                }
                rows={5}
                disabled={isPending}
                required
              />
            </Field>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </FieldGroup>

          <ResponsiveDialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.tenantId || !form.subject || !form.body}
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Create ticket"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
