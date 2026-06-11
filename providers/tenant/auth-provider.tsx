"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { ApiError } from "@/lib/central/api/errors"
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/lib/tenant/auth/token-storage"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { tenantAuthService } from "@/services/tenant/auth.service"
import type {
  TenantForgotPasswordPayload,
  TenantLoginCredentials,
  TenantResendOtpPayload,
  TenantResetPasswordPayload,
  TenantUser,
  TenantVerifyOtpPayload,
} from "@/types/tenant/auth"

interface TenantAuthContextValue {
  user: TenantUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: ApiError | null
  login: (credentials: TenantLoginCredentials) => Promise<string | undefined>
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
}

const TenantAuthContext = React.createContext<TenantAuthContextValue | null>(null)

export function TenantAuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = React.useState<boolean>(() =>
    Boolean(getAuthToken()),
  )

  const meQuery = useQuery({
    queryKey: tenantQueryKeys.auth.me(),
    queryFn: () => tenantAuthService.me(),
    enabled: hasToken,
  })

  React.useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: tenantQueryKeys.auth.all })
    }
  }, [meQuery.error, queryClient])

  const loginMutation = useMutation({
    mutationFn: (credentials: TenantLoginCredentials) =>
      tenantAuthService.login(credentials),
    onSuccess: ({ data }) => {
      setAuthToken(data.token)
      setHasToken(true)
      queryClient.setQueryData(tenantQueryKeys.auth.me(), data.user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => tenantAuthService.logout(),
    onSettled: () => {
      clearAuthToken()
      setHasToken(false)
      queryClient.removeQueries({ queryKey: tenantQueryKeys.auth.all })
    },
  })

  const login = React.useCallback(
    async (credentials: TenantLoginCredentials) => {
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
      queryClient.removeQueries({ queryKey: tenantQueryKeys.auth.all })
    }
  }, [logoutMutation, queryClient])

  const refetchUser = React.useCallback(async () => {
    await meQuery.refetch()
  }, [meQuery])

  const value = React.useMemo<TenantAuthContextValue>(
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

  return (
    <TenantAuthContext.Provider value={value}>{children}</TenantAuthContext.Provider>
  )
}

export function useTenantAuth() {
  const context = React.useContext(TenantAuthContext)

  if (!context) {
    throw new Error("useTenantAuth must be used within TenantAuthProvider.")
  }

  return context
}

export function useTenantForgotPassword() {
  return useMutation({
    mutationFn: (payload: TenantForgotPasswordPayload) =>
      tenantAuthService.forgotPassword(payload),
  })
}

export function useTenantResendOtp() {
  return useMutation({
    mutationFn: (payload: TenantResendOtpPayload) =>
      tenantAuthService.resendOtp(payload),
  })
}

export function useTenantVerifyOtp() {
  return useMutation({
    mutationFn: (payload: TenantVerifyOtpPayload) =>
      tenantAuthService.verifyOtp(payload),
  })
}

export function useTenantResetPassword() {
  return useMutation({
    mutationFn: (payload: TenantResetPasswordPayload) =>
      tenantAuthService.resetPassword(payload),
  })
}
