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
import { roleService } from "@/services/central/role.service"
import type { Role } from "@/types/central/role"

interface RoleFormState {
  name: string
  guardName: string
}

const defaultFormState: RoleFormState = {
  name: "",
  guardName: "web",
}

function roleToFormState(role: Role | null): RoleFormState {
  if (!role) {
    return defaultFormState
  }

  return {
    name: role.name,
    guardName: role.guard_name,
  }
}

interface RoleFormDialogProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleFormDialog({ role, open, onOpenChange }: RoleFormDialogProps) {
  const isEditing = role !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<RoleFormState>(() => roleToFormState(role))
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setForm(roleToFormState(role))
      setErrorMessage(null)
    }
  }, [open, role])

  const mutation = useMutation({
    mutationFn: async (state: RoleFormState) => {
      const payload = {
        name: state.name.trim(),
        guard_name: state.guardName.trim(),
      }

      if (isEditing && role) {
        return roleService.update(role.id, payload)
      }

      return roleService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Role updated successfully." : "Role created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.roles.all })
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

      setErrorMessage("Unable to save role. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit role" : "Create role"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update the role name and guard."
              : "Add a new Spatie role for platform access control."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="role-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="role-name">Name</FieldLabel>
              <Input
                id="role-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="platform-admin"
                required
              />
              <FieldDescription>Unique role identifier</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="role-guard">Guard name</FieldLabel>
              <Input
                id="role-guard"
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
              <FieldDescription>Authentication guard, typically web</FieldDescription>
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
          <Button type="submit" form="role-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create role"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
