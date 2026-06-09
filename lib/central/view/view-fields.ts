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
import type { Domain } from "@/types/central/domain"
import type { TenantConfig } from "@/types/central/tenant-config"
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
