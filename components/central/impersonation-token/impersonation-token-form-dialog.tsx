"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addHours, format } from "date-fns"
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
import { Input } from "@/components/ui/input"
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
import { queryKeys } from "@/lib/central/query/keys"
import { impersonationTokenService } from "@/services/central/impersonation-token.service"
import { tenantService } from "@/services/central/tenant.service"
import type { ImpersonationToken } from "@/types/central/impersonation-token"
import { useAuth } from "@/providers/central/auth-provider"
import { useTenant } from "@/providers/central/tenant-provider"

interface ImpersonationTokenFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (token: ImpersonationToken) => void
}

function defaultExpiresAt() {
  return format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")
}

export function ImpersonationTokenFormDialog({
  open,
  onOpenChange,
  onCreated,
}: ImpersonationTokenFormDialogProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { selectedTenantId } = useTenant()
  const [tenantId, setTenantId] = React.useState(selectedTenantId ?? "")
  const [expiresAt, setExpiresAt] = React.useState(defaultExpiresAt)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const tenantsQuery = useQuery({
    queryKey: queryKeys.tenants.options(),
    queryFn: () => tenantService.getOptions(),
    enabled: open,
  })

  const tenants = tenantsQuery.data ?? []

  React.useEffect(() => {
    if (open) {
      setTenantId(selectedTenantId ?? "")
      setExpiresAt(defaultExpiresAt())
      setErrorMessage(null)
    }
  }, [open, selectedTenantId])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("You must be signed in to issue impersonation tokens.")
      }

      return impersonationTokenService.create({
        tenant_id: tenantId,
        admin_id: user.id,
        expires_at: new Date(expiresAt).toISOString(),
      })
    },
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Impersonation token created.")
      await queryClient.invalidateQueries({
        queryKey: queryKeys.impersonationTokens.all,
      })

      if (result.data?.plain_token) {
        onCreated?.(result.data)
      }

      onOpenChange(false)
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong.",
      )
    },
  })

  const isPending = mutation.isPending
  const tenantLocked = Boolean(selectedTenantId)

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Issue impersonation token</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Generate a one-time token to access a tenant as an administrator.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate()
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="impersonation-tenant">Tenant</FieldLabel>
              <OptionsCombobox
                id="impersonation-tenant"
                items={tenants}
                value={tenantId}
                onValueChange={setTenantId}
                placeholder="Select tenant"
                disabled={tenantLocked || isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="impersonation-expires">Expires</FieldLabel>
              <Input
                id="impersonation-expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                disabled={isPending}
                required
              />
              <FieldDescription>
                Defaults to one hour from now. Tokens cannot be reused after
                consumption.
              </FieldDescription>
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
            <Button type="submit" disabled={isPending || !tenantId || !user?.id}>
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              Issue token
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
