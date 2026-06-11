import {
  tenantApiClient,
  tenantApiRequestWithMessage,
} from "@/lib/tenant/api/client"
import type {
  TenantForgotPasswordPayload,
  TenantLoginCredentials,
  TenantLoginResponse,
  TenantResendOtpPayload,
  TenantResetPasswordPayload,
  TenantUser,
  TenantVerifyOtpPayload,
  TenantVerifyOtpResponse,
} from "@/types/tenant/auth"

export const tenantAuthService = {
  login(credentials: TenantLoginCredentials) {
    return tenantApiRequestWithMessage<TenantLoginResponse>("auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    })
  },

  logout() {
    return tenantApiRequestWithMessage<undefined>("auth/logout", {
      method: "POST",
    })
  },

  me() {
    return tenantApiClient.get<TenantUser>("auth/me")
  },

  forgotPassword(payload: TenantForgotPasswordPayload) {
    return tenantApiRequestWithMessage<undefined>("auth/forgot-password", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  resendOtp(payload: TenantResendOtpPayload) {
    return tenantApiRequestWithMessage<undefined>("auth/resend-otp", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  verifyOtp(payload: TenantVerifyOtpPayload) {
    return tenantApiRequestWithMessage<TenantVerifyOtpResponse>("auth/verify-otp", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  resetPassword(payload: TenantResetPasswordPayload) {
    return tenantApiRequestWithMessage<undefined>("auth/reset-password", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },
}
