import { apiClient, apiRequestWithMessage } from "@/lib/central/api/client"
import type {
  OnboardPayload,
  OnboardResponse,
  PaymentConfig,
  PublicPlan,
} from "@/types/central/onboard"

export const onboardService = {
  getPublicPlans() {
    return apiClient.get<PublicPlan[]>("plans/public", { auth: false })
  },

  getPaymentConfig() {
    return apiClient.get<PaymentConfig>("payments/config", { auth: false })
  },

  onboard(payload: OnboardPayload) {
    return apiRequestWithMessage<OnboardResponse>("self-onboarding", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  checkout(
    tenantId: string,
    payload: {
      payment_provider: OnboardPayload["payment_provider"]
      success_url?: string
      cancel_url?: string
    },
  ) {
    return apiRequestWithMessage<{ checkout_url: string; invoice_id: string }>(
      `self-onboarding/${tenantId}/checkout`,
      {
        method: "POST",
        body: payload,
        auth: false,
      },
    )
  },
}
