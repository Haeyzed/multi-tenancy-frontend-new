import { apiClient, apiRequestWithMessage } from "@/lib/central/api/client"
import type {
  PaymentConfig,
  PublicPlan,
  SignupPayload,
  SignupResponse,
} from "@/types/central/signup"

export const signupService = {
  getPublicPlans() {
    return apiClient.get<PublicPlan[]>("plans/public", { auth: false })
  },

  getPaymentConfig() {
    return apiClient.get<PaymentConfig>("payments/config", { auth: false })
  },

  signup(payload: SignupPayload) {
    return apiRequestWithMessage<SignupResponse>("signup", {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  checkout(
    tenantId: string,
    payload: {
      payment_provider: SignupPayload["payment_provider"]
      success_url?: string
      cancel_url?: string
    },
  ) {
    return apiRequestWithMessage<{ checkout_url: string; invoice_id: string }>(
      `signup/${tenantId}/checkout`,
      {
        method: "POST",
        body: payload,
        auth: false,
      },
    )
  },
}
