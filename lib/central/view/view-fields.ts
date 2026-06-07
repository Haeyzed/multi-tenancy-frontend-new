import {
  announcementTargetAudienceLabels,
  announcementTypeLabels,
  type PlatformAnnouncement,
} from "@/types/central/announcement"
import type { Permission } from "@/types/central/permission"
import type { Plan } from "@/types/central/plan"
import type { Role } from "@/types/central/role"
import type { Subscription } from "@/types/central/subscription"
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
  formatViewJson,
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
      label: "Display features",
      value: formatViewJson(plan.display_features),
      mono: true,
      fullWidth: true,
    },
    { label: "Created", value: formatViewDate(plan.created_at) },
    { label: "Updated", value: formatViewDate(plan.updated_at) },
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

export function getSubscriptionViewFields(
  subscription: Subscription,
): RecordViewField[] {
  return [
    { label: "Tenant", value: formatViewText(subscription.tenant?.name) },
    { label: "Plan", value: formatViewText(subscription.plan?.name) },
    { label: "Status", value: formatViewText(subscription.status) },
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
      value: formatViewText(announcement.target_plans?.join(", ") || "—"),
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
