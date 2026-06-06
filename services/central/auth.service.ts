import { apiClient, apiRequestWithMessage } from "@/lib/central/api/client"
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginCredentials,
  LoginResponse,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/central/auth"

export const authService = {
  login(credentials: LoginCredentials) {
    return apiRequestWithMessage<LoginResponse>("auth/login", {
      method: "POST",
      body: credentials,
      auth: false,
    })
  },

  logout() {
    return apiRequestWithMessage<undefined>("auth/logout", {
      method: "POST",
    })
  },

  me() {
    return apiClient.get<User>("auth/me")
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return apiRequestWithMessage<undefined>("auth/forgot-password", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  resendOtp(payload: ResendOtpPayload) {
    return apiRequestWithMessage<undefined>("auth/resend-otp", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  verifyOtp(payload: VerifyOtpPayload) {
    return apiRequestWithMessage<VerifyOtpResponse>("auth/verify-otp", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  resetPassword(payload: ResetPasswordPayload) {
    return apiRequestWithMessage<undefined>("auth/reset-password", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  requestPasswordChangeOtp() {
    return apiRequestWithMessage<undefined>("auth/change-password/otp", {
      method: "POST",
    })
  },

  changePassword(payload: ChangePasswordPayload) {
    return apiRequestWithMessage<undefined>("auth/change-password", {
      method: "POST",
      body: payload,
    })
  },
}
