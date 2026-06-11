export const TenantOtpPurposes = {
  PasswordReset: "password_reset",
  PasswordChange: "password_change",
  EmailVerification: "email_verification",
} as const

export type TenantOtpPurpose =
  (typeof TenantOtpPurposes)[keyof typeof TenantOtpPurposes]

export interface TenantUser {
  id: string
  email: string
  first_name: string
  last_name: string
  name: string
  phone: string | null
  avatar_media_id: number | null
  email_verified_at: string | null
  last_login_at: string | null
  is_active: boolean
  locale: string | null
  timezone: string | null
  created_at: string | null
  updated_at: string | null
  role_names?: string[]
  permission_names?: string[]
  is_store_owner?: boolean
}

export interface TenantLoginCredentials {
  email: string
  password: string
}

export interface TenantLoginResponse {
  user: TenantUser
  token: string
}

export interface TenantForgotPasswordPayload {
  email: string
}

export interface TenantResendOtpPayload {
  email: string
  purpose: TenantOtpPurpose
}

export interface TenantVerifyOtpPayload {
  email: string
  otp: string
  purpose: TenantOtpPurpose
}

export interface TenantVerifyOtpResponse {
  verification_token: string
  expires_in_minutes: number
}

export interface TenantResetPasswordPayload {
  email: string
  verification_token: string
  password: string
  password_confirmation: string
}
