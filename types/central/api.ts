export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data?: T
}

export interface ApiPaginatedMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface ApiPaginatedResponse<T> {
  success: true
  message?: string
  data: T
  meta: ApiPaginatedMeta
}

export interface ApiValidationErrors {
  [field: string]: string[]
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ApiValidationErrors
}

export type SelectOption = {
  value: string
  label: string
}
