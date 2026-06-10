export const ChangelogTypes = {
  Feature: "feature",
  Fix: "fix",
  Breaking: "breaking",
  Security: "security",
  Performance: "performance",
} as const

export type ChangelogType = (typeof ChangelogTypes)[keyof typeof ChangelogTypes]

export const changelogTypeLabels: Record<ChangelogType, string> = {
  feature: "Feature",
  fix: "Fix",
  breaking: "Breaking",
  security: "Security",
  performance: "Performance",
}

export interface PlatformChangelog {
  id: number
  version: string
  title: string
  description: string
  type: ChangelogType
  is_published: boolean
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ChangelogFormPayload {
  version: string
  title: string
  description: string
  type: ChangelogType
  is_published?: boolean
  published_at?: string | null
}

export interface ChangelogListParams {
  page?: number
  per_page?: number
  search?: string
  type?: string
  is_published?: string
}
