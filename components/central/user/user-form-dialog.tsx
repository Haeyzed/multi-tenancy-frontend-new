"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, SearchIcon } from "lucide-react"
import * as React from "react"

import {
  formStateFromUser,
  formStateToPayload,
  type UserFormState,
} from "@/components/central/user/user-form-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { ApiError } from "@/lib/central/api/errors"
import { queryKeys } from "@/lib/central/query/keys"
import { permissionService } from "@/services/central/permission.service"
import { roleService } from "@/services/central/role.service"
import { userService } from "@/services/central/user.service"
import type { Permission } from "@/types/central/permission"
import type { User } from "@/types/central/user"

interface UserFormDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function groupPermissionsByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>()

  for (const permission of permissions) {
    const module = permission.module ?? "general"
    const existing = groups.get(module) ?? []
    existing.push(permission)
    groups.set(module, existing)
  }

  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
}

export function UserFormDialog({ user, open, onOpenChange }: UserFormDialogProps) {
  const isEditing = user !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<UserFormState>(() => formStateFromUser(user))
  const [permissionSearch, setPermissionSearch] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: queryKeys.users.detail(user?.id ?? 0),
    queryFn: () => userService.get(user!.id),
    enabled: open && isEditing && user !== null,
  })

  const rolesQuery = useQuery({
    queryKey: [...queryKeys.roles.all, "all-options"],
    queryFn: () => roleService.getPaginated({ per_page: 500 }),
    enabled: open,
  })

  const permissionsQuery = useQuery({
    queryKey: [...queryKeys.permissions.all, "all-options"],
    queryFn: () => permissionService.getPaginated({ per_page: 500 }),
    enabled: open,
  })

  const allRoles = React.useMemo(
    () =>
      (rolesQuery.data?.data ?? []).filter((role) => role.guard_name === "web"),
    [rolesQuery.data?.data],
  )

  const allPermissions = React.useMemo(
    () =>
      (permissionsQuery.data?.data ?? []).filter(
        (permission) => permission.guard_name === "web",
      ),
    [permissionsQuery.data?.data],
  )

  const filteredPermissions = React.useMemo(() => {
    const term = permissionSearch.trim().toLowerCase()

    if (!term) {
      return allPermissions
    }

    return allPermissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(term) ||
        (permission.module ?? "").toLowerCase().includes(term),
    )
  }, [allPermissions, permissionSearch])

  const groupedPermissions = React.useMemo(
    () => groupPermissionsByModule(filteredPermissions),
    [filteredPermissions],
  )

  React.useEffect(() => {
    if (!open) {
      return
    }

    if (isEditing && userQuery.data) {
      setForm(formStateFromUser(userQuery.data))
    } else if (!isEditing) {
      setForm(formStateFromUser(null))
    }

    setPermissionSearch("")
    setErrorMessage(null)
  }, [open, isEditing, userQuery.data])

  const mutation = useMutation({
    mutationFn: async (state: UserFormState) => {
      const payload = formStateToPayload(state, isEditing)

      if (isEditing && user) {
        return userService.update(user.id, payload)
      }

      return userService.create(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof UserFormState>(
    key: K,
    value: UserFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function toggleRole(roleId: number, checked: boolean) {
    setForm((current) => ({
      ...current,
      roleIds: checked
        ? current.roleIds.includes(roleId)
          ? current.roleIds
          : [...current.roleIds, roleId]
        : current.roleIds.filter((id) => id !== roleId),
    }))
  }

  function togglePermission(permissionId: number, checked: boolean) {
    setForm((current) => ({
      ...current,
      permissionIds: checked
        ? current.permissionIds.includes(permissionId)
          ? current.permissionIds
          : [...current.permissionIds, permissionId]
        : current.permissionIds.filter((id) => id !== permissionId),
    }))
  }

  function toggleModule(modulePermissions: Permission[], checked: boolean) {
    const moduleIds = modulePermissions.map((permission) => permission.id)

    setForm((current) => ({
      ...current,
      permissionIds: checked
        ? Array.from(new Set([...current.permissionIds, ...moduleIds]))
        : current.permissionIds.filter((id) => !moduleIds.includes(id)),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!isEditing && form.password.trim().length < 8) {
      setErrorMessage("Password must be at least 8 characters.")
      return
    }

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save user. Please try again.")
    }
  }

  const isLoadingAccess =
    rolesQuery.isLoading ||
    permissionsQuery.isLoading ||
    (isEditing && userQuery.isLoading)

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit user" : "Create user"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update account details and assign roles or direct permissions."
              : "Add a platform administrator with roles and permissions."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="user-form"
          className="flex max-h-[min(65vh,640px)] flex-col gap-6 overflow-y-auto pe-1"
          onSubmit={handleSubmit}
        >
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user-name">Name</FieldLabel>
              <Input
                id="user-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Jane Admin"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="user-password">Password</FieldLabel>
              <Input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder={isEditing ? "Leave blank to keep current" : "Min. 8 characters"}
                required={!isEditing}
                minLength={isEditing ? undefined : 8}
              />
              {isEditing ? (
                <FieldDescription>
                  Leave blank to keep the current password
                </FieldDescription>
              ) : null}
            </Field>
            <Field orientation="horizontal">
              <Switch
                id="user-active"
                checked={form.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="user-active">Active</FieldLabel>
                <FieldDescription>
                  Inactive users cannot sign in
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium">Roles</p>
              <p className="text-xs text-muted-foreground">
                Assign one or more access roles ({form.roleIds.length} selected)
              </p>
            </div>

            {isLoadingAccess ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : allRoles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles available.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {allRoles.map((role) => (
                  <label
                    key={role.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={form.roleIds.includes(role.id)}
                      onCheckedChange={(checked) =>
                        toggleRole(role.id, checked === true)
                      }
                    />
                    <span className="font-mono">{role.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium">Direct permissions</p>
              <p className="text-xs text-muted-foreground">
                Permissions assigned directly to this user, in addition to role
                permissions ({form.permissionIds.length} selected)
              </p>
            </div>

            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={permissionSearch}
                onChange={(event) => setPermissionSearch(event.target.value)}
                placeholder="Search permissions..."
                className="ps-8"
              />
            </div>

            {isLoadingAccess ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : groupedPermissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No permissions found.
              </p>
            ) : (
              <ScrollArea className="h-[min(32vh,280px)] pe-3">
                <div className="flex flex-col gap-6">
                  {groupedPermissions.map(([module, modulePermissions]) => {
                    const moduleIds = modulePermissions.map((p) => p.id)
                    const selectedCount = moduleIds.filter((id) =>
                      form.permissionIds.includes(id),
                    ).length
                    const allSelected =
                      moduleIds.length > 0 && selectedCount === moduleIds.length
                    const someSelected =
                      selectedCount > 0 && selectedCount < moduleIds.length

                    return (
                      <div key={module} className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              someSelected ? "indeterminate" : allSelected
                            }
                            onCheckedChange={(checked) =>
                              toggleModule(modulePermissions, checked === true)
                            }
                            aria-label={`Toggle all ${module} permissions`}
                          />
                          <p className="text-sm font-medium capitalize">{module}</p>
                          <span className="text-xs text-muted-foreground">
                            {selectedCount}/{moduleIds.length}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 ps-6">
                          {modulePermissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                            >
                              <Checkbox
                                checked={form.permissionIds.includes(
                                  permission.id,
                                )}
                                onCheckedChange={(checked) =>
                                  togglePermission(
                                    permission.id,
                                    checked === true,
                                  )
                                }
                              />
                              <span className="font-mono">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
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
          <Button type="submit" form="user-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create user"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
