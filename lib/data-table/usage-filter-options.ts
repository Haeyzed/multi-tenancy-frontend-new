import {
  ActivityIcon,
  BoxIcon,
  HardDriveIcon,
  NetworkIcon,
  ShoppingCartIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import {
  UsageMetrics,
  usageMetricLabels,
  type UsageMetric,
} from "@/types/central/usage-record"

const usageMetricIcons: Record<UsageMetric, typeof ActivityIcon> = {
  products: BoxIcon,
  orders: ShoppingCartIcon,
  storage: HardDriveIcon,
  bandwidth: NetworkIcon,
  staff: UsersIcon,
  transactions: ActivityIcon,
  api_calls: ZapIcon,
}

export const usageMetricFilterOptions = Object.values(UsageMetrics).map(
  (value) => ({
    label: usageMetricLabels[value],
    value,
    icon: usageMetricIcons[value],
  }),
)

export const usageMetricOptions = usageMetricFilterOptions.map(({ label, value }) => ({
  label,
  value,
}))
