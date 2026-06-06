"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { ApiError } from "@/lib/central/api/errors"
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/central/auth/token-storage"
import { queryKeys } from "@/lib/central/query/keys"
import { authService } from "@/services/central/auth.service"
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginCredentials,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  VerifyOtpPayload,
} from "@/types/central/auth"

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: ApiError | null
  login: (credentials: LoginCredentials) => Promise<string | undefined>
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = React.useState<boolean>(() => Boolean(getAuthToken()))

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.me(),
    enabled: hasToken,
  })

  React.useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    }
  }, [meQuery.error, queryClient])

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: ({ data }) => {
      setAuthToken(data.token)
      setHasToken(true)
      queryClient.setQueryData(queryKeys.auth.me(), data.user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    },
  })

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      const result = await loginMutation.mutateAsync(credentials)

      return result.message
    },
    [loginMutation],
  )

  const logout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    }
  }, [logoutMutation, queryClient])

  const refetchUser = React.useCallback(async () => {
    await meQuery.refetch()
  }, [meQuery])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: meQuery.data ?? null,
      isAuthenticated: hasToken && Boolean(meQuery.data),
      isLoading:
        (hasToken && meQuery.isLoading) ||
        loginMutation.isPending ||
        logoutMutation.isPending,
      error:
        (meQuery.error instanceof ApiError ? meQuery.error : null) ??
        (loginMutation.error instanceof ApiError ? loginMutation.error : null),
      login,
      logout,
      refetchUser,
    }),
    [
      hasToken,
      login,
      loginMutation.error,
      loginMutation.isPending,
      logout,
      logoutMutation.isPending,
      meQuery.data,
      meQuery.error,
      meQuery.isLoading,
      refetchUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.")
  }

  return context
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authService.forgotPassword(payload),
  })
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
  })
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
  })
}

export function useRequestPasswordChangeOtp() {
  return useMutation({
    mutationFn: () => authService.requestPasswordChangeOtp(),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
  })
}
