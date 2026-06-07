export const OtpPurposes = {
  PasswordReset: "password_reset",
  PasswordChange: "password_change",
  EmailVerification: "email_verification",
} as const

export type OtpPurpose = (typeof OtpPurposes)[keyof typeof OtpPurposes]

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  last_login_at: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResendOtpPayload {
  email: string
  purpose: OtpPurpose
}

export interface VerifyOtpPayload {
  email: string
  otp: string
  purpose: OtpPurpose
}

export interface VerifyOtpResponse {
  verification_token: string
  expires_in_minutes: number
}

export interface ResetPasswordPayload {
  email: string
  verification_token: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordPayload {
  password: string
  password_confirmation: string
  current_password?: string
  verification_token?: string
}
