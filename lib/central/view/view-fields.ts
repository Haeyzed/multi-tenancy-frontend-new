import {
  announcementTargetAudienceLabels,
  announcementTypeLabels,
  type PlatformAnnouncement,
} from "@/types/central/announcement"
import type { Permission } from "@/types/central/permission"
import type { Plan } from "@/types/central/plan"
import type { Role } from "@/types/central/role"
import {
  invoiceStatusLabels,
  type Invoice,
} from "@/types/central/invoice"
import {
  paymentStatusLabels,
  type Payment,
} from "@/types/central/payment"
import {
  subscriptionStatusLabels,
  type Subscription,
} from "@/types/central/subscription"
import type { ApiKey } from "@/types/central/api-key"
import type { Domain } from "@/types/central/domain"
import type { ErrorLog } from "@/types/central/error-log"
import type { HealthCheck } from "@/types/central/health-check"
import {
  errorLogSeverityLabels,
  type ErrorLogSeverity,
} from "@/types/central/error-log"
import {
  healthCheckStatusLabels,
  healthCheckTypeLabels,
  type HealthCheckStatus,
  type HealthCheckType,
} from "@/types/central/health-check"
import type { TenantMetric } from "@/types/central/tenant-metric"
import type { UsageRecord } from "@/types/central/usage-record"
import {
  usageMetricLabels,
  type UsageMetric,
} from "@/types/central/usage-record"
import type { ActivityLogEntry } from "@/types/central/activity-log"
import type { ImpersonationToken } from "@/types/central/impersonation-token"
import {
  changelogTypeLabels,
  type ChangelogType,
  type PlatformChangelog,
} from "@/types/central/changelog"
import type { SupportTicket } from "@/types/central/support-ticket"
import {
  supportTicketCategoryLabels,
  supportTicketPriorityLabels,
  supportTicketStatusLabels,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/types/central/support-ticket"
import { TenantStatuses, type Tenant } from "@/types/central/tenant"
import type { User } from "@/types/central/user"
import {
  getUserPermissionNames,
  getUserRoleNames,
} from "@/lib/central/user/user-utils"
import type { RecordViewField } from "@/components/central/record-view-dialog"
import {
  formatViewBoolean,
  formatViewDate,
  formatViewHighlights,
  formatViewText,
} from "@/lib/central/view/formatters"
import { fromMinorUnits } from "@/components/central/plan/plan-form-utils"

const tenantStatusLabels: Record<string, string> = {
  [TenantStatuses.Pending]: "Pending",
  [TenantStatuses.Active]: "Active",
  [TenantStatuses.Suspended]: "Suspended",
  [TenantStatuses.Cancelled]: "Cancelled",
}

export function getUserViewFields(user: User): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(user.name) },
    { label: "Email", value: formatViewText(user.email) },
    { label: "Active", value: formatViewBoolean(user.is_active) },
    { label: "Email verified", value: formatViewDate(user.email_verified_at) },
    { label: "Last login", value: formatViewDate(user.last_login_at) },
    {
      label: "Roles",
      value: formatViewText(getUserRoleNames(user).join(", ") || "—"),
      fullWidth: true,
    },
    {
      label: "Permissions",
      value: formatViewText(getUserPermissionNames(user).join(", ") || "—"),
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(user.created_at) },
    { label: "Updated", value: formatViewDate(user.updated_at) },
  ]
}

export function getRoleViewFields(role: Role): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(role.name), mono: true },
    { label: "Guard", value: formatViewText(role.guard_name) },
    {
      label: "Permissions",
      value: formatViewText(
        role.permissions?.map((permission) => permission.name).join(", ") || "—",
      ),
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(role.created_at) },
    { label: "Updated", value: formatViewDate(role.updated_at) },
  ]
}

export function getPermissionViewFields(
  permission: Permission,
): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(permission.name), mono: true },
    { label: "Module", value: formatViewText(permission.module) },
    { label: "Guard", value: formatViewText(permission.guard_name) },
    { label: "Created", value: formatViewDate(permission.created_at) },
    { label: "Updated", value: formatViewDate(permission.updated_at) },
  ]
}

export function getPlanViewFields(plan: Plan): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(plan.name) },
    { label: "Slug", value: formatViewText(plan.slug), mono: true },
    { label: "Description", value: formatViewText(plan.description), fullWidth: true },
    { label: "Tier", value: formatViewText(plan.tier) },
    { label: "Currency", value: formatViewText(plan.currency) },
    {
      label: "Monthly price",
      value: formatViewText(fromMinorUnits(plan.price_monthly)),
    },
    {
      label: "Yearly price",
      value: formatViewText(fromMinorUnits(plan.price_yearly)),
    },
    { label: "Trial days", value: formatViewText(plan.trial_days) },
    { label: "Sort order", value: formatViewText(plan.sort_order) },
    { label: "Active", value: formatViewBoolean(plan.is_active) },
    { label: "Public", value: formatViewBoolean(plan.is_public) },
    {
      label: "Highlights",
      value: formatViewHighlights(plan.display_features),
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(plan.created_at) },
    { label: "Updated", value: formatViewDate(plan.updated_at) },
  ]
}

export function getDomainViewFields(domain: Domain): RecordViewField[] {
  return [
    { label: "Domain", value: formatViewText(domain.domain) },
    { label: "Tenant", value: formatViewText(domain.tenant?.name) },
    { label: "Primary", value: formatViewBoolean(domain.is_primary) },
    { label: "Fallback", value: formatViewBoolean(domain.is_fallback) },
    { label: "Verified", value: formatViewBoolean(domain.verified) },
    { label: "Created", value: formatViewDate(domain.created_at) },
    { label: "Updated", value: formatViewDate(domain.updated_at) },
  ]
}

export function getTenantConfigViewFields(config: TenantConfig): RecordViewField[] {
  return [
    { label: "Key", value: formatViewText(config.key), mono: true },
    { label: "Tenant", value: formatViewText(config.tenant?.name) },
    {
      label: "Value",
      value: config.encrypted
        ? "Encrypted"
        : formatViewText(config.value),
    },
    { label: "Encrypted", value: formatViewBoolean(config.encrypted) },
    { label: "Created", value: formatViewDate(config.created_at) },
    { label: "Updated", value: formatViewDate(config.updated_at) },
  ]
}

export function getTenantViewFields(tenant: Tenant): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(tenant.name) },
    { label: "Slug", value: formatViewText(tenant.slug), mono: true },
    { label: "Database", value: formatViewText(tenant.database), mono: true },
    { label: "Domain", value: formatViewText(tenant.domain) },
    {
      label: "Status",
      value: formatViewText(tenantStatusLabels[tenant.status] ?? tenant.status),
    },
    { label: "Plan ID", value: formatViewText(tenant.plan_id), mono: true },
    { label: "Billing cycle", value: formatViewText(tenant.billing_cycle) },
    { label: "Owner name", value: formatViewText(tenant.owner_name) },
    { label: "Owner email", value: formatViewText(tenant.owner_email) },
    { label: "Trial ends", value: formatViewDate(tenant.trial_ends_at) },
    { label: "Subscribed", value: formatViewDate(tenant.subscribed_at) },
    { label: "Expires", value: formatViewDate(tenant.expires_at) },
    { label: "Created", value: formatViewDate(tenant.created_at) },
    { label: "Updated", value: formatViewDate(tenant.updated_at) },
  ]
}

export function getInvoiceViewFields(invoice: Invoice): RecordViewField[] {
  return [
    { label: "Invoice number", value: formatViewText(invoice.invoice_number) },
    { label: "Tenant", value: formatViewText(invoice.tenant?.name) },
    {
      label: "Plan",
      value: formatViewText(invoice.subscription?.plan?.name),
    },
    {
      label: "Status",
      value: formatViewText(invoiceStatusLabels[invoice.status]),
    },
    {
      label: "Amount due",
      value: formatViewText(
        `${fromMinorUnits(invoice.amount_due)} ${invoice.currency}`,
      ),
    },
    {
      label: "Amount paid",
      value: formatViewText(
        `${fromMinorUnits(invoice.amount_paid)} ${invoice.currency}`,
      ),
    },
    {
      label: "Remaining",
      value: formatViewText(
        `${fromMinorUnits(invoice.amount_remaining)} ${invoice.currency}`,
      ),
    },
    { label: "Due date", value: formatViewDate(invoice.due_date) },
    { label: "Paid at", value: formatViewDate(invoice.paid_at) },
    {
      label: "Billing period start",
      value: formatViewDate(invoice.billing_period_start),
    },
    {
      label: "Billing period end",
      value: formatViewDate(invoice.billing_period_end),
    },
    {
      label: "Payment intent",
      value: formatViewText(invoice.payment_intent_id),
      mono: true,
    },
    { label: "Notes", value: formatViewText(invoice.notes), fullWidth: true },
    { label: "Created", value: formatViewDate(invoice.created_at) },
    { label: "Updated", value: formatViewDate(invoice.updated_at) },
  ]
}

export function getPaymentViewFields(payment: Payment): RecordViewField[] {
  return [
    {
      label: "Provider payment ID",
      value: formatViewText(payment.provider_payment_id),
      mono: true,
      fullWidth: true,
    },
    { label: "Tenant", value: formatViewText(payment.tenant?.name) },
    {
      label: "Invoice",
      value: formatViewText(payment.invoice?.invoice_number),
    },
    {
      label: "Status",
      value: formatViewText(paymentStatusLabels[payment.status]),
    },
    {
      label: "Amount",
      value: formatViewText(
        `${fromMinorUnits(payment.amount)} ${payment.currency}`,
      ),
    },
    {
      label: "Refunded",
      value: formatViewText(
        `${fromMinorUnits(payment.refunded_amount)} ${payment.currency}`,
      ),
    },
    {
      label: "Provider",
      value: formatViewText(payment.payment_provider),
    },
    {
      label: "Payment method",
      value: formatViewText(
        [payment.payment_method_type, payment.payment_method_last4]
          .filter(Boolean)
          .join(" •••• "),
      ),
    },
    {
      label: "Failure message",
      value: formatViewText(payment.failure_message),
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(payment.created_at) },
    { label: "Updated", value: formatViewDate(payment.updated_at) },
  ]
}

export function getSubscriptionViewFields(
  subscription: Subscription,
): RecordViewField[] {
  return [
    { label: "Tenant", value: formatViewText(subscription.tenant?.name) },
    { label: "Plan", value: formatViewText(subscription.plan?.name) },
    {
      label: "Status",
      value: formatViewText(subscriptionStatusLabels[subscription.status]),
    },
    { label: "Billing cycle", value: formatViewText(subscription.billing_cycle) },
    {
      label: "Current period start",
      value: formatViewDate(subscription.current_period_start),
    },
    {
      label: "Current period end",
      value: formatViewDate(subscription.current_period_end),
    },
    { label: "Trial ends", value: formatViewDate(subscription.trial_ends_at) },
    { label: "Cancelled", value: formatViewDate(subscription.cancelled_at) },
    {
      label: "Cancellation reason",
      value: formatViewText(subscription.cancellation_reason),
      fullWidth: true,
    },
    {
      label: "Payment provider",
      value: formatViewText(subscription.payment_provider),
    },
    {
      label: "Provider subscription ID",
      value: formatViewText(subscription.payment_provider_id),
      mono: true,
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(subscription.created_at) },
    { label: "Updated", value: formatViewDate(subscription.updated_at) },
  ]
}

export function getAnnouncementViewFields(
  announcement: PlatformAnnouncement,
): RecordViewField[] {
  return [
    { label: "Title", value: formatViewText(announcement.title) },
    {
      label: "Type",
      value: formatViewText(announcementTypeLabels[announcement.type]),
    },
    {
      label: "Target audience",
      value: formatViewText(
        announcementTargetAudienceLabels[announcement.target_audience],
      ),
    },
    {
      label: "Target plans",
      value: formatViewText(
        announcement.target_plan_names?.join(", ") ||
          announcement.target_plans?.join(", ") ||
          "—",
      ),
      fullWidth: true,
    },
    { label: "Active", value: formatViewBoolean(announcement.is_active) },
    { label: "Starts", value: formatViewDate(announcement.starts_at) },
    { label: "Ends", value: formatViewDate(announcement.ends_at) },
    { label: "Body", value: formatViewText(announcement.body), fullWidth: true },
    { label: "Created", value: formatViewDate(announcement.created_at) },
    { label: "Updated", value: formatViewDate(announcement.updated_at) },
  ]
}

export function getApiKeyViewFields(apiKey: ApiKey): RecordViewField[] {
  return [
    { label: "Name", value: formatViewText(apiKey.name) },
    { label: "Tenant", value: formatViewText(apiKey.tenant?.name) },
    { label: "Active", value: formatViewBoolean(apiKey.is_active) },
    {
      label: "Permissions",
      value: formatViewText(apiKey.permissions?.join(", ")),
      fullWidth: true,
    },
    { label: "Last used", value: formatViewDate(apiKey.last_used_at) },
    { label: "Expires", value: formatViewDate(apiKey.expires_at) },
    { label: "Created", value: formatViewDate(apiKey.created_at) },
    { label: "Updated", value: formatViewDate(apiKey.updated_at) },
  ]
}

export function getHealthCheckViewFields(
  healthCheck: HealthCheck,
): RecordViewField[] {
  return [
    {
      label: "Check type",
      value: formatViewText(
        healthCheckTypeLabels[healthCheck.check_type as HealthCheckType] ??
          healthCheck.check_type,
      ),
    },
    { label: "Tenant", value: formatViewText(healthCheck.tenant?.name) },
    {
      label: "Status",
      value: formatViewText(
        healthCheckStatusLabels[healthCheck.status as HealthCheckStatus] ??
          healthCheck.status,
      ),
    },
    {
      label: "Response time",
      value: formatViewText(
        healthCheck.response_time_ms != null
          ? `${healthCheck.response_time_ms} ms`
          : null,
      ),
    },
    { label: "Message", value: formatViewText(healthCheck.message), fullWidth: true },
    { label: "Checked", value: formatViewDate(healthCheck.checked_at) },
    { label: "Created", value: formatViewDate(healthCheck.created_at) },
  ]
}

export function getErrorLogViewFields(errorLog: ErrorLog): RecordViewField[] {
  return [
    {
      label: "Severity",
      value: formatViewText(
        errorLogSeverityLabels[errorLog.severity as ErrorLogSeverity] ??
          errorLog.severity,
      ),
    },
    { label: "Channel", value: formatViewText(errorLog.channel) },
    { label: "Tenant", value: formatViewText(errorLog.tenant?.name ?? "Platform") },
    { label: "Message", value: formatViewText(errorLog.message), fullWidth: true },
    {
      label: "Context",
      value: formatViewText(
        errorLog.context ? JSON.stringify(errorLog.context, null, 2) : null,
      ),
      mono: true,
      fullWidth: true,
    },
    { label: "Occurred", value: formatViewDate(errorLog.occurred_at) },
    { label: "Resolved", value: formatViewDate(errorLog.resolved_at) },
    { label: "Created", value: formatViewDate(errorLog.created_at) },
  ]
}

export function getSupportTicketViewFields(
  ticket: SupportTicket,
): RecordViewField[] {
  return [
    { label: "Subject", value: formatViewText(ticket.subject) },
    { label: "Tenant", value: formatViewText(ticket.tenant?.name) },
    {
      label: "Category",
      value: formatViewText(
        supportTicketCategoryLabels[ticket.category as SupportTicketCategory] ??
          ticket.category,
      ),
    },
    {
      label: "Priority",
      value: formatViewText(
        supportTicketPriorityLabels[ticket.priority as SupportTicketPriority] ??
          ticket.priority,
      ),
    },
    {
      label: "Status",
      value: formatViewText(
        supportTicketStatusLabels[ticket.status as SupportTicketStatus] ??
          ticket.status,
      ),
    },
    { label: "Assignee", value: formatViewText(ticket.assignee?.name) },
    { label: "Body", value: formatViewText(ticket.body), fullWidth: true },
    { label: "Resolved", value: formatViewDate(ticket.resolved_at) },
    { label: "Created", value: formatViewDate(ticket.created_at) },
    { label: "Updated", value: formatViewDate(ticket.updated_at) },
  ]
}

function shortClassName(value: string | null) {
  if (!value) {
    return "—"
  }

  const parts = value.split("\\")

  return parts[parts.length - 1] ?? value
}

export function getChangelogViewFields(
  entry: PlatformChangelog,
): RecordViewField[] {
  return [
    { label: "Version", value: formatViewText(entry.version) },
    { label: "Title", value: formatViewText(entry.title) },
    {
      label: "Type",
      value: formatViewText(
        changelogTypeLabels[entry.type as ChangelogType] ?? entry.type,
      ),
    },
    { label: "Published", value: formatViewBoolean(entry.is_published) },
    { label: "Published at", value: formatViewDate(entry.published_at) },
    {
      label: "Description",
      value: formatViewText(entry.description),
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(entry.created_at) },
    { label: "Updated", value: formatViewDate(entry.updated_at) },
  ]
}

export function getActivityLogViewFields(
  entry: ActivityLogEntry,
): RecordViewField[] {
  return [
    { label: "Description", value: formatViewText(entry.description), fullWidth: true },
    { label: "Event", value: formatViewText(entry.event) },
    { label: "Log", value: formatViewText(entry.log_name) },
    {
      label: "Subject",
      value: formatViewText(
        entry.subject_type
          ? `${shortClassName(entry.subject_type)}${entry.subject_id != null ? ` #${entry.subject_id}` : ""}`
          : null,
      ),
    },
    { label: "Actor", value: formatViewText(entry.causer?.name ?? "System") },
    {
      label: "Changes",
      value: formatViewText(
        entry.attribute_changes
          ? JSON.stringify(entry.attribute_changes, null, 2)
          : null,
      ),
      mono: true,
      fullWidth: true,
    },
    {
      label: "Properties",
      value: formatViewText(
        entry.properties ? JSON.stringify(entry.properties, null, 2) : null,
      ),
      mono: true,
      fullWidth: true,
    },
    { label: "When", value: formatViewDate(entry.created_at) },
  ]
}

function getImpersonationTokenStatusLabel(token: ImpersonationToken) {
  if (token.used_at) {
    return "Used"
  }

  if (new Date(token.expires_at) <= new Date()) {
    return "Expired"
  }

  return "Valid"
}

export function getImpersonationTokenViewFields(
  token: ImpersonationToken,
): RecordViewField[] {
  return [
    { label: "Tenant", value: formatViewText(token.tenant?.name) },
    { label: "Issued by", value: formatViewText(token.administrator?.name) },
    {
      label: "Status",
      value: formatViewText(getImpersonationTokenStatusLabel(token)),
    },
    { label: "Expires", value: formatViewDate(token.expires_at) },
    { label: "Used", value: formatViewDate(token.used_at) },
    { label: "Created", value: formatViewDate(token.created_at) },
    { label: "Updated", value: formatViewDate(token.updated_at) },
  ]
}

export function getUsageRecordViewFields(record: UsageRecord): RecordViewField[] {
  return [
    {
      label: "Metric",
      value: formatViewText(
        usageMetricLabels[record.metric as UsageMetric] ?? String(record.metric),
      ),
    },
    { label: "Tenant", value: formatViewText(record.tenant?.name) },
    {
      label: "Subscription",
      value: formatViewText(record.subscription_id ?? "—"),
    },
    { label: "Quantity", value: formatViewText(String(record.quantity)) },
    { label: "Recorded", value: formatViewDate(record.recorded_at) },
    { label: "Created", value: formatViewDate(record.created_at) },
    { label: "Updated", value: formatViewDate(record.updated_at) },
  ]
}

export function getTenantMetricViewFields(metric: TenantMetric): RecordViewField[] {
  return [
    { label: "Tenant", value: formatViewText(metric.tenant?.name) },
    { label: "Date", value: formatViewDate(metric.metric_date) },
    { label: "Orders", value: formatViewText(String(metric.total_orders)) },
    { label: "Revenue", value: formatViewText(String(metric.total_revenue)) },
    { label: "Products", value: formatViewText(String(metric.total_products)) },
    { label: "Customers", value: formatViewText(String(metric.total_customers)) },
    {
      label: "Storage (MB)",
      value: formatViewText(String(metric.storage_used_mb)),
    },
    {
      label: "Bandwidth (MB)",
      value: formatViewText(String(metric.bandwidth_used_mb)),
    },
    { label: "API calls", value: formatViewText(String(metric.api_calls)) },
    { label: "Created", value: formatViewDate(metric.created_at) },
    { label: "Updated", value: formatViewDate(metric.updated_at) },
  ]
}
