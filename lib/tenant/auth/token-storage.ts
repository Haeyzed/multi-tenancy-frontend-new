const TOKEN_STORAGE_KEY = "tenant_auth_token"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}
