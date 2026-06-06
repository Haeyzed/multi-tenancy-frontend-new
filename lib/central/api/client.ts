import { ApiError } from "@/lib/central/api/errors"
import { getAuthToken } from "@/lib/central/auth/token-storage"
import { getSelectedTenantId } from "@/lib/central/tenant/tenant-storage"
import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "@/types/central/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://multi-tenancy-api.test/api/central"

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
  auth?: boolean
  tenantScoped?: boolean
}

function buildUrl(
  path: string,
  query?: ApiRequestOptions["query"],
  tenantScoped = false,
): string {
  const url = new URL(path.replace(/^\//, ""), `${API_BASE_URL}/`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }

  if (tenantScoped) {
    const tenantId = getSelectedTenantId()

    if (tenantId) {
      url.searchParams.set("tenant_id", tenantId)
    }
  }

  return url.toString()
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()

  if (!text) {
    return {} as T
  }

  return JSON.parse(text) as T
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    query,
    auth = true,
    tenantScoped = false,
    headers,
    ...init
  } = options

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getAuthToken()

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path, query, tenantScoped), {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await parseJson<ApiSuccessResponse<T> | ApiErrorResponse>(response)

  if (!response.ok || payload.success === false) {
    throw new ApiError(response.status, payload as ApiErrorResponse)
  }

  return (payload as ApiSuccessResponse<T>).data as T
}

export async function apiRequestWithMessage<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<{ data: T; message?: string }> {
  const {
    body,
    query,
    auth = true,
    tenantScoped = false,
    headers,
    ...init
  } = options

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getAuthToken()

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path, query, tenantScoped), {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await parseJson<ApiSuccessResponse<T> | ApiErrorResponse>(response)

  if (!response.ok || payload.success === false) {
    throw new ApiError(response.status, payload as ApiErrorResponse)
  }

  const successPayload = payload as ApiSuccessResponse<T>

  return {
    data: successPayload.data as T,
    message: successPayload.message,
  }
}

export async function apiPaginatedRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiPaginatedResponse<T>> {
  const {
    body,
    query,
    auth = true,
    tenantScoped = false,
    headers,
    ...init
  } = options

  const requestHeaders = new Headers(headers)
  requestHeaders.set("Accept", "application/json")

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = getAuthToken()

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path, query, tenantScoped), {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const payload = await parseJson<ApiPaginatedResponse<T> | ApiErrorResponse>(response)

  if (!response.ok || payload.success === false) {
    throw new ApiError(response.status, payload as ApiErrorResponse)
  }

  return payload as ApiPaginatedResponse<T>
}

export const apiClient = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
}
