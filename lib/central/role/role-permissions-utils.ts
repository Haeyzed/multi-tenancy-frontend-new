const moduleLabels: Record<string, string> = {
  users: "User Management",
  tenants: "Tenant Management",
  billing: "Billing",
  support: "Support",
  platform: "Platform",
  monitoring: "Monitoring",
  "api-keys": "API Keys",
  impersonation: "Impersonation",
  general: "General",
}

export function formatModuleLabel(module: string): string {
  if (moduleLabels[module]) {
    return moduleLabels[module]
  }

  return module
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function formatPermissionLabel(name: string): string {
  const separatorIndex = name.indexOf(".")

  if (separatorIndex === -1) {
    return name
  }

  const module = name.slice(0, separatorIndex)
  const action = name
    .slice(separatorIndex + 1)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
  const moduleLabel = module
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())

  return `${action} ${moduleLabel}`
}

export function formatRoleLabel(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function buildAssignmentsMap(
  roles: Array<{ id: number; permission_ids: number[] }>,
): Map<number, Set<number>> {
  const assignments = new Map<number, Set<number>>()

  for (const role of roles) {
    assignments.set(role.id, new Set(role.permission_ids))
  }

  return assignments
}

export function countRolePermissions(
  roleId: number,
  assignments: Map<number, Set<number>>,
  totalPermissions: number,
  isSystem: boolean,
): { assigned: number; total: number } {
  if (isSystem) {
    return { assigned: totalPermissions, total: totalPermissions }
  }

  return {
    assigned: assignments.get(roleId)?.size ?? 0,
    total: totalPermissions,
  }
}

export function cloneAssignmentsMap(
  assignments: Map<number, Set<number>>,
): Map<number, Set<number>> {
  const clone = new Map<number, Set<number>>()

  for (const [roleId, permissionIds] of assignments) {
    clone.set(roleId, new Set(permissionIds))
  }

  return clone
}

export function assignmentsMapToSyncPayload(
  roles: Array<{ id: number; is_system: boolean }>,
  assignments: Map<number, Set<number>>,
) {
  return roles
    .filter((role) => !role.is_system)
    .map((role) => ({
      role_id: role.id,
      permission_ids: Array.from(assignments.get(role.id) ?? []),
    }))
}

export function hasAssignmentChanges(
  initial: Map<number, Set<number>>,
  current: Map<number, Set<number>>,
): boolean {
  for (const [roleId, permissionIds] of current) {
    const initialIds = initial.get(roleId) ?? new Set<number>()

    if (permissionIds.size !== initialIds.size) {
      return true
    }

    for (const permissionId of permissionIds) {
      if (!initialIds.has(permissionId)) {
        return true
      }
    }
  }

  return false
}
