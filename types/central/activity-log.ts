export interface ActivityCauser {
  id: number | string
  type: string | null
  name?: string | null
}

export interface ActivitySubject {
  id: number | string
  type: string | null
}

export interface ActivityLogEntry {
  id: number
  log_name: string | null
  description: string
  subject_type: string | null
  subject_id: number | string | null
  causer_type: string | null
  causer_id: number | string | null
  event: string | null
  attribute_changes: Record<string, unknown> | null
  properties: Record<string, unknown> | null
  created_at: string | null
  updated_at: string | null
  subject?: ActivitySubject | null
  causer?: ActivityCauser | null
}

export interface ActivityListParams {
  page?: number
  per_page?: number
  search?: string
  log_name?: string
  event?: string
}
