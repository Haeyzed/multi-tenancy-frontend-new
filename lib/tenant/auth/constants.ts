export const TENANT_OTP_LENGTH = 6

export const tenantAuthPaths = {
  login: "/admin/login",
  forgotPassword: "/admin/forgot-password",
  verifyOtp: "/admin/verify-otp",
  resetPassword: "/admin/reset-password",
  dashboard: "/admin/dashboard",
} as const
