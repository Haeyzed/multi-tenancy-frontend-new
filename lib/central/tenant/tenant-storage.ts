const SELECTED_TENANT_KEY = "central_selected_tenant_id"

export function getSelectedTenantId(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(SELECTED_TENANT_KEY)
}

export function setSelectedTenantId(tenantId: string | null): void {
  if (tenantId === null) {
    window.localStorage.removeItem(SELECTED_TENANT_KEY)
    return
  }

  window.localStorage.setItem(SELECTED_TENANT_KEY, tenantId)
}
