"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, SearchIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ApiError } from "@/lib/central/api/errors"
import { queryKeys } from "@/lib/central/query/keys"
import { permissionService } from "@/services/central/permission.service"
import { roleService } from "@/services/central/role.service"
import type { Permission } from "@/types/central/permission"
import type { Role } from "@/types/central/role"

interface RolePermissionsDialogProps {
  role: Role
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

export function RolePermissionsDialog({
  role,
  open,
  onOpenChange,
}: RolePermissionsDialogProps) {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [search, setSearch] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const roleQuery = useQuery({
    queryKey: queryKeys.roles.permissions(role.id),
    queryFn: () => roleService.get(role.id),
    enabled: open,
  })

  const permissionsQuery = useQuery({
    queryKey: [...queryKeys.permissions.all, "all-options"],
    queryFn: () => permissionService.getPaginated({ per_page: 500 }),
    enabled: open,
  })

  const allPermissions = React.useMemo(
    () =>
      (permissionsQuery.data?.data ?? []).filter(
        (permission) => permission.guard_name === role.guard_name,
      ),
    [permissionsQuery.data?.data, role.guard_name],
  )

  const filteredPermissions = React.useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return allPermissions
    }

    return allPermissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(term) ||
        (permission.module ?? "").toLowerCase().includes(term),
    )
  }, [allPermissions, search])

  const groupedPermissions = React.useMemo(
    () => groupPermissionsByModule(filteredPermissions),
    [filteredPermissions],
  )

  React.useEffect(() => {
    if (open && roleQuery.data) {
      setSelectedIds(roleQuery.data.permissions?.map((p) => p.id) ?? [])
      setSearch("")
      setErrorMessage(null)
    }
  }, [open, roleQuery.data])

  const saveMutation = useMutation({
    mutationFn: (permissionIds: number[]) =>
      roleService.syncPermissions(role.id, permissionIds),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.roles.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.roles.permissions(role.id),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ])
      onOpenChange(false)
    },
  })

  function togglePermission(permissionId: number, checked: boolean) {
    setSelectedIds((current) => {
      if (checked) {
        return current.includes(permissionId)
          ? current
          : [...current, permissionId]
      }

      return current.filter((id) => id !== permissionId)
    })
  }

  function toggleModule(modulePermissions: Permission[], checked: boolean) {
    const moduleIds = modulePermissions.map((permission) => permission.id)

    setSelectedIds((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...moduleIds]))
      }

      return current.filter((id) => !moduleIds.includes(id))
    })
  }

  async function handleSave() {
    setErrorMessage(null)

    try {
      await saveMutation.mutateAsync(selectedIds)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to update role permissions. Please try again.")
    }
  }

  const isLoading = roleQuery.isLoading || permissionsQuery.isLoading
  const isSaving = saveMutation.isPending

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Manage permissions</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Assign or remove permissions for{" "}
            <span className="font-medium text-foreground">{role.name}</span> (
            {role.guard_name} guard). Changes replace the role&apos;s current
            permission set.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search permissions..."
            className="ps-8"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : groupedPermissions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No permissions found for the {role.guard_name} guard.
          </p>
        ) : (
          <ScrollArea className="h-[min(50vh,420px)] pe-3">
            <div className="flex flex-col gap-6">
              {groupedPermissions.map(([module, modulePermissions]) => {
                const moduleIds = modulePermissions.map((p) => p.id)
                const selectedCount = moduleIds.filter((id) =>
                  selectedIds.includes(id),
                ).length
                const allSelected =
                  moduleIds.length > 0 && selectedCount === moduleIds.length
                const someSelected =
                  selectedCount > 0 && selectedCount < moduleIds.length

                return (
                  <div key={module} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={someSelected ? "indeterminate" : allSelected}
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
                            checked={selectedIds.includes(permission.id)}
                            onCheckedChange={(checked) =>
                              togglePermission(permission.id, checked === true)
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

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : (
              `Save (${selectedIds.length} selected)`
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
