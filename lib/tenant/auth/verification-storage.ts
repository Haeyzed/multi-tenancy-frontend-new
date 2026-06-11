const VERIFICATION_TOKEN_KEY = "tenant_verification_token"
const VERIFICATION_EMAIL_KEY = "tenant_verification_email"

export function setVerificationSession(email: string, token: string): void {
  window.sessionStorage.setItem(VERIFICATION_EMAIL_KEY, email)
  window.sessionStorage.setItem(VERIFICATION_TOKEN_KEY, token)
}

export function getVerificationSession(): {
  email: string
  token: string
} | null {
  const email = window.sessionStorage.getItem(VERIFICATION_EMAIL_KEY)
  const token = window.sessionStorage.getItem(VERIFICATION_TOKEN_KEY)

  if (!email || !token) {
    return null
  }

  return { email, token }
}

export function clearVerificationSession(): void {
  window.sessionStorage.removeItem(VERIFICATION_EMAIL_KEY)
  window.sessionStorage.removeItem(VERIFICATION_TOKEN_KEY)
}
