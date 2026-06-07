import type { User, UserPermission, UserRoleRecord } from "@/types/central/user"

export function getUserPermissionNames(user: User): string[] {
  const names = new Set<string>()

  for (const permission of user.permissions ?? []) {
    names.add(permission.name)
  }

  for (const role of user.roles ?? []) {
    for (const permission of role.permissions ?? []) {
      names.add(permission.name)
    }
  }

  return Array.from(names).sort()
}

export function getUserRoleNames(user: User): string[] {
  return (user.roles ?? []).map((role) => role.name)
}

export function countUserPermissions(user: User): number {
  return getUserPermissionNames(user).length
}

export type { UserPermission, UserRoleRecord }
