import { tenantApiClient } from "@/lib/tenant/api/client"
import type { TenantBootstrapPayload } from "@/types/tenant/bootstrap"

export const tenantBootstrapService = {
  getPublic() {
    return tenantApiClient.get<TenantBootstrapPayload>("bootstrap", {
      auth: false,
    })
  },
}
