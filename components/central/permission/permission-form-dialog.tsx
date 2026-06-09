"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

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
import { permissionService } from "@/services/central/permission.service"
import type { Permission } from "@/types/central/permission"

interface PermissionFormState {
  name: string
  guardName: string
  module: string
}

const defaultFormState: PermissionFormState = {
  name: "",
  guardName: "web",
  module: "",
}

function permissionToFormState(permission: Permission | null): PermissionFormState {
  if (!permission) {
    return defaultFormState
  }

  return {
    name: permission.name,
    guardName: permission.guard_name,
    module: permission.module ?? "",
  }
}

interface PermissionFormDialogProps {
  permission: Permission | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PermissionFormDialog({
  permission,
  open,
  onOpenChange,
}: PermissionFormDialogProps) {
  const isEditing = permission !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<PermissionFormState>(() =>
    permissionToFormState(permission),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setForm(permissionToFormState(permission))
      setErrorMessage(null)
    }
  }, [open, permission])

  const mutation = useMutation({
    mutationFn: async (state: PermissionFormState) => {
      const payload = {
        name: state.name.trim(),
        guard_name: state.guardName.trim(),
        module: state.module.trim() || null,
      }

      if (isEditing && permission) {
        return permissionService.update(permission.id, payload)
      }

      return permissionService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing
          ? "Permission updated successfully."
          : "Permission created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.permissions.all })
      onOpenChange(false)
    },
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save permission. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit permission" : "Create permission"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update the permission identifier, guard, and module."
              : "Add a new Spatie permission for platform access control."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="permission-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="permission-name">Name</FieldLabel>
              <Input
                id="permission-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="tenants.manage"
                required
              />
              <FieldDescription>Unique permission identifier</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="permission-guard">Guard name</FieldLabel>
              <Input
                id="permission-guard"
                value={form.guardName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    guardName: event.target.value,
                  }))
                }
                placeholder="web"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="permission-module">Module</FieldLabel>
              <Input
                id="permission-module"
                value={form.module}
                onChange={(event) =>
                  setForm((current) => ({ ...current, module: event.target.value }))
                }
                placeholder="tenants"
              />
              <FieldDescription>Optional feature group for organizing permissions</FieldDescription>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="permission-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create permission"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
