export type AppHostMode = "central" | "tenant"

export interface HostContext {
  mode: AppHostMode
  slug?: string
  hostname: string
}

const CENTRAL_HOSTS = (
  process.env.NEXT_PUBLIC_CENTRAL_HOSTS ?? "localhost,127.0.0.1"
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean)

const TENANT_API_DOMAIN_BASE =
  process.env.NEXT_PUBLIC_TENANT_DOMAIN_BASE ?? "multi-tenancy-api.test"

const TENANT_APP_DOMAIN_BASE =
  process.env.NEXT_PUBLIC_TENANT_APP_DOMAIN_BASE ?? ""

/**
 * Resolve whether the current host is the central app or a tenant subdomain.
 */
export function resolveHostContext(host: string): HostContext {
  const hostname = host.split(":")[0]?.toLowerCase() ?? ""

  if (!hostname || CENTRAL_HOSTS.includes(hostname)) {
    return { mode: "central", hostname }
  }

  if (hostname.endsWith(".localhost")) {
    const slug = hostname.replace(/\.localhost$/, "")

    if (slug && slug !== "localhost") {
      return { mode: "tenant", slug, hostname }
    }
  }

  if (hostname.endsWith(`.${TENANT_API_DOMAIN_BASE}`)) {
    const slug = hostname.slice(0, -(TENANT_API_DOMAIN_BASE.length + 1))

    if (slug && !slug.includes(".")) {
      return { mode: "tenant", slug, hostname }
    }
  }

  if (
    TENANT_APP_DOMAIN_BASE &&
    hostname.endsWith(`.${TENANT_APP_DOMAIN_BASE}`)
  ) {
    const slug = hostname.slice(0, -(TENANT_APP_DOMAIN_BASE.length + 1))

    if (slug && !slug.includes(".")) {
      return { mode: "tenant", slug, hostname }
    }
  }

  return { mode: "central", hostname }
}

export function getClientHostContext(): HostContext {
  if (typeof window === "undefined") {
    return { mode: "central", hostname: "" }
  }

  return resolveHostContext(window.location.host)
}

export function getTenantApiBaseUrl(slug: string): string {
  const scheme = process.env.NEXT_PUBLIC_TENANT_API_SCHEME ?? "http"

  return `${scheme}://${slug}.${TENANT_API_DOMAIN_BASE}/api`
}
