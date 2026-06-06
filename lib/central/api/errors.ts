import type { ApiErrorResponse, ApiValidationErrors } from "@/types/central/api"

export class ApiError extends Error {
  readonly status: number
  readonly errors?: ApiValidationErrors

  constructor(status: number, body: ApiErrorResponse | { message?: string }) {
    super(body.message ?? "Request failed.")
    this.name = "ApiError"
    this.status = status
    this.errors = "errors" in body ? body.errors : undefined
  }

  getFieldErrors(field: string): string[] {
    return this.errors?.[field] ?? []
  }

  get firstFieldError(): string | undefined {
    if (!this.errors) {
      return undefined
    }

    const firstKey = Object.keys(this.errors)[0]

    return firstKey ? this.errors[firstKey]?.[0] : undefined
  }
}
