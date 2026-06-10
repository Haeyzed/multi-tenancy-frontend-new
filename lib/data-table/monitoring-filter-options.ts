import {
  AlertCircle,
  AlertTriangle,
  Bug,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react"

import { activeInactiveFilterOptions } from "@/lib/data-table/status-options"
import {
  ErrorLogSeverities,
  errorLogSeverityLabels,
} from "@/types/central/error-log"
import {
  HealthCheckStatuses,
  healthCheckStatusLabels,
} from "@/types/central/health-check"

export const apiKeyStatusFilterOptions = [...activeInactiveFilterOptions]

export const errorLogSeverityFilterOptions = [
  {
    label: errorLogSeverityLabels[ErrorLogSeverities.Critical],
    value: ErrorLogSeverities.Critical,
    icon: AlertCircle,
  },
  {
    label: errorLogSeverityLabels[ErrorLogSeverities.Error],
    value: ErrorLogSeverities.Error,
    icon: AlertTriangle,
  },
  {
    label: errorLogSeverityLabels[ErrorLogSeverities.Warning],
    value: ErrorLogSeverities.Warning,
    icon: AlertTriangle,
  },
  {
    label: errorLogSeverityLabels[ErrorLogSeverities.Info],
    value: ErrorLogSeverities.Info,
    icon: Info,
  },
  {
    label: errorLogSeverityLabels[ErrorLogSeverities.Debug],
    value: ErrorLogSeverities.Debug,
    icon: Bug,
  },
] as const

export const errorLogResolutionFilterOptions = [
  { label: "Unresolved", value: "unresolved", icon: AlertCircle },
  { label: "Resolved", value: "resolved", icon: CheckCircle },
] as const

export const healthCheckStatusFilterOptions = [
  {
    label: healthCheckStatusLabels[HealthCheckStatuses.Healthy],
    value: HealthCheckStatuses.Healthy,
    icon: CheckCircle,
  },
  {
    label: healthCheckStatusLabels[HealthCheckStatuses.Warning],
    value: HealthCheckStatuses.Warning,
    icon: AlertTriangle,
  },
  {
    label: healthCheckStatusLabels[HealthCheckStatuses.Critical],
    value: HealthCheckStatuses.Critical,
    icon: AlertCircle,
  },
  {
    label: healthCheckStatusLabels[HealthCheckStatuses.Unknown],
    value: HealthCheckStatuses.Unknown,
    icon: HelpCircle,
  },
] as const
