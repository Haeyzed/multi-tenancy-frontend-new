import type { User, UserFormPayload } from "@/types/central/user"

export interface UserFormState {
  name: string
  email: string
  password: string
  isActive: boolean
  roleIds: number[]
  permissionIds: number[]
}

const defaultFormState: UserFormState = {
  name: "",
  email: "",
  password: "",
  isActive: true,
  roleIds: [],
  permissionIds: [],
}

export function formStateFromUser(user: User | null): UserFormState {
  if (!user) {
    return defaultFormState
  }

  return {
    name: user.name,
    email: user.email,
    password: "",
    isActive: user.is_active,
    roleIds: user.roles?.map((role) => role.id) ?? [],
    permissionIds: user.permissions?.map((permission) => permission.id) ?? [],
  }
}

export function formStateToPayload(
  state: UserFormState,
  isEditing: boolean,
): UserFormPayload {
  const payload: UserFormPayload = {
    name: state.name.trim(),
    email: state.email.trim(),
    is_active: state.isActive,
    role_ids: state.roleIds,
    permission_ids: state.permissionIds,
  }

  if (!isEditing || state.password.trim()) {
    payload.password = state.password
  }

  return payload
}
