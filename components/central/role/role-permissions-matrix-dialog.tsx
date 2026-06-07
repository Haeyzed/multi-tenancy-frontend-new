"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  CrownIcon,
  Loader2Icon,
  LockIcon,
  ShieldCheckIcon,
  ShieldIcon,
  UserRoundIcon,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError } from "@/lib/central/api/errors"
import {
  assignmentsMapToSyncPayload,
  buildAssignmentsMap,
  cloneAssignmentsMap,
  countRolePermissions,
  formatModuleLabel,
  formatPermissionLabel,
  formatRoleLabel,
  hasAssignmentChanges,
} from "@/lib/central/role/role-permissions-utils"
import { queryKeys } from "@/lib/central/query/keys"
import { roleService } from "@/services/central/role.service"
import type { RoleMatrixRole } from "@/types/central/role"

function getRoleIcon(roleName: string) {
  switch (roleName) {
    case "super_admin":
      return CrownIcon
    default:
      return ShieldIcon
  }
}

interface RolePermissionsMatrixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RolePermissionsMatrixDialog({
  open,
  onOpenChange,
}: RolePermissionsMatrixDialogProps) {
  const queryClient = useQueryClient()
  const [assignments, setAssignments] = React.useState<Map<number, Set<number>>>(
    () => new Map(),
  )
  const [savedAssignments, setSavedAssignments] = React.useState<
    Map<number, Set<number>>
  >(() => new Map())
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const matrixQuery = useQuery({
    queryKey: queryKeys.roles.permissionsMatrix(),
    queryFn: () => roleService.getPermissionsMatrix(),
    enabled: open,
  })

  const matrix = matrixQuery.data

  React.useEffect(() => {
    if (open && matrix) {
      const nextAssignments = buildAssignmentsMap(matrix.roles)
      setAssignments(nextAssignments)
      setSavedAssignments(cloneAssignmentsMap(nextAssignments))
      setErrorMessage(null)
    }
  }, [open, matrix])

  const saveMutation = useMutation({
    mutationFn: () => {
      if (!matrix) {
        throw new Error("Matrix data is not loaded.")
      }

      return roleService.syncPermissionsMatrix({
        roles: assignmentsMapToSyncPayload(matrix.roles, assignments),
      })
    },
    onSuccess: async (data) => {
      const nextAssignments = buildAssignmentsMap(data.roles)
      setAssignments(nextAssignments)
      setSavedAssignments(cloneAssignmentsMap(nextAssignments))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.roles.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.roles.permissionsMatrix(),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ])
      onOpenChange(false)
    },
  })

  function togglePermission(
    role: RoleMatrixRole,
    permissionId: number,
    checked: boolean,
  ) {
    if (role.is_system) {
      return
    }

    setAssignments((previous) => {
      const next = new Map(previous)
      const rolePermissions = new Set(next.get(role.id) ?? [])

      if (checked) {
        rolePermissions.add(permissionId)
      } else {
        rolePermissions.delete(permissionId)
      }

      next.set(role.id, rolePermissions)
      return next
    })
  }

  function hasPermission(role: RoleMatrixRole, permissionId: number): boolean {
    if (role.is_system) {
      return true
    }

    return assignments.get(role.id)?.has(permissionId) ?? false
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await saveMutation.mutateAsync()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save role permissions. Please try again.")
    }
  }

  const isDirty = hasAssignmentChanges(savedAssignments, assignments)
  const isSaving = saveMutation.isPending
  const totalPermissions = matrix?.total_permissions ?? 0

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Role permissions</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Configure access levels for each role, then save your changes.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="role-permissions-matrix-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          {matrixQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : !matrix || matrix.roles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No roles available for the {matrix?.guard_name ?? "web"} guard.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky left-0 z-10 min-w-56 bg-background">
                      Permission
                    </TableHead>
                    {matrix.roles.map((role) => {
                      const Icon = getRoleIcon(role.name)
                      const counts = countRolePermissions(
                        role.id,
                        assignments,
                        totalPermissions,
                        role.is_system,
                      )

                      return (
                        <TableHead
                          key={role.id}
                          className="min-w-28 text-center align-bottom"
                        >
                          <div className="flex flex-col items-center gap-1.5 py-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className="size-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formatRoleLabel(role.name)}
                              </span>
                            </div>
                            <span className="text-xs font-normal text-muted-foreground">
                              {counts.assigned}/{counts.total}
                            </span>
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {matrix.permission_groups.map((group) => (
                    <React.Fragment key={group.module}>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableCell
                          colSpan={matrix.roles.length + 1}
                          className="sticky left-0 bg-muted/40 font-semibold"
                        >
                          {formatModuleLabel(group.module)}
                        </TableCell>
                      </TableRow>

                      {group.permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="sticky left-0 bg-background font-medium">
                            {formatPermissionLabel(permission.name)}
                          </TableCell>

                          {matrix.roles.map((role) => {
                            const granted = hasPermission(role, permission.id)

                            return (
                              <TableCell key={role.id} className="text-center">
                                {role.is_system ? (
                                  <div className="flex justify-center">
                                    <LockIcon
                                      className="size-4 text-muted-foreground"
                                      aria-label="System role permission locked"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={granted}
                                      onCheckedChange={(checked) =>
                                        togglePermission(
                                          role,
                                          permission.id,
                                          checked === true,
                                        )
                                      }
                                      aria-label={`${formatRoleLabel(role.name)}: ${formatPermissionLabel(permission.name)}`}
                                    />
                                  </div>
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CrownIcon className="size-3.5" />
              <span>System role (locked)</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked disabled className="size-3.5" />
              <span>Permission granted</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={false} disabled className="size-3.5" />
              <span>Permission denied</span>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="role-permissions-matrix-form"
            disabled={!isDirty || isSaving || matrixQuery.isLoading}
          >
            {isSaving ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save permissions"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
