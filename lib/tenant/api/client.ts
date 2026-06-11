import { ApiError } from "@/lib/central/api/errors"
import { getTenantApiBaseUrl } from "@/lib/tenant/domain/resolve-host"
import { getClientHostContext } from "@/lib/tenant/domain/resolve-host"
import { getAuthToken } from "@/lib/tenant/auth/token-storage"
import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from "@/types/central/api"

export interface TenantApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
  auth?: boolean
  slug?: string
}

function resolveSlug(explicitSlug?: string): string {
  if (explicitSlug) {
    return explicitSlug
  }

  const context = getClientHostContext()

  if (context.mode !== "tenant" || !context.slug) {
    throw new Error("Tenant API requests require a tenant subdomain context.")
  }

  return context.slug
}

function buildUrl(
  path: string,
  slug: string,
  query?: TenantApiRequestOptions["query"],
): string {
  const url = new URL(path.replace(/^\//, ""), `${getTenantApiBaseUrl(slug)}/`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
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

export async function tenantApiRequest<T>(
  path: string,
  options: TenantApiRequestOptions = {},
): Promise<T> {
  const {
    body,
    query,
    auth = true,
    slug: explicitSlug,
    headers,
    ...init
  } = options

  const slug = resolveSlug(explicitSlug)
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

  const response = await fetch(buildUrl(path, slug, query), {
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

export async function tenantApiRequestWithMessage<T>(
  path: string,
  options: TenantApiRequestOptions = {},
): Promise<{ data: T; message?: string }> {
  const {
    body,
    query,
    auth = true,
    slug: explicitSlug,
    headers,
    ...init
  } = options

  const slug = resolveSlug(explicitSlug)
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

  const response = await fetch(buildUrl(path, slug, query), {
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

export async function tenantApiPaginatedRequest<T>(
  path: string,
  options: TenantApiRequestOptions = {},
): Promise<ApiPaginatedResponse<T>> {
  const {
    body,
    query,
    auth = true,
    slug: explicitSlug,
    headers,
    ...init
  } = options

  const slug = resolveSlug(explicitSlug)
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

  const response = await fetch(buildUrl(path, slug, query), {
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

export const tenantApiClient = {
  get: <T>(path: string, options?: TenantApiRequestOptions) =>
    tenantApiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: TenantApiRequestOptions) =>
    tenantApiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: TenantApiRequestOptions) =>
    tenantApiRequest<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: TenantApiRequestOptions) =>
    tenantApiRequest<T>(path, { ...options, method: "DELETE" }),
  postWithMessage: <T>(
    path: string,
    body?: unknown,
    options?: TenantApiRequestOptions,
  ) => tenantApiRequestWithMessage<T>(path, { ...options, method: "POST", body }),
}
