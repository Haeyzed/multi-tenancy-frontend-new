"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatViewDate } from "@/lib/central/view/formatters"
import type { DashboardRecent } from "@/types/central/dashboard"

function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className="capitalize">
      {value.replace(/_/g, " ")}
    </Badge>
  )
}

function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="app-data-table-shell">{children}</div>
}

interface DashboardRecentTablesProps {
  recent: DashboardRecent
  rangeLabel?: string
}

export function DashboardRecentTables({
  recent,
  rangeLabel = "the selected date range",
}: DashboardRecentTablesProps) {
  const sections = [
    recent.tenants?.length
      ? {
          key: "tenants",
          title: "Recent tenants",
          description: `Latest organizations onboarded during ${rangeLabel}`,
          content: (
            <TableShell>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        {tenant.plan ?? "No plan"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {tenant.plan ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={tenant.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatViewDate(tenant.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableShell>
          ),
        }
      : null,
    recent.subscriptions?.length
      ? {
          key: "subscriptions",
          title: "Recent subscriptions",
          description: `Latest subscription activity during ${rangeLabel}`,
          content: (
            <TableShell>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="hidden sm:table-cell">Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Cycle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.tenant ?? "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {subscription.plan ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={subscription.status} />
                    </TableCell>
                    <TableCell className="hidden capitalize md:table-cell">
                      {subscription.billing_cycle}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableShell>
          ),
        }
      : null,
    recent.payments?.length
      ? {
          key: "payments",
          title: "Recent payments",
          description: `Latest payment transactions during ${rangeLabel}`,
          content: (
            <TableShell>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.tenant ?? "—"}
                    </TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge value={payment.status} />
                    </TableCell>
                    <TableCell className="hidden capitalize md:table-cell">
                      {payment.provider}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableShell>
          ),
        }
      : null,
    recent.support_tickets?.length
      ? {
          key: "support_tickets",
          title: "Open support tickets",
          description: `Tickets needing attention during ${rangeLabel}`,
          content: (
            <TableShell>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Tenant</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.support_tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {ticket.tenant ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={ticket.priority} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusBadge value={ticket.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableShell>
          ),
        }
      : null,
    recent.activities?.length
      ? {
          key: "activities",
          title: "Recent activity",
          description: `Latest platform audit events during ${rangeLabel}`,
          content: (
            <TableShell>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Event</TableHead>
                  <TableHead className="hidden md:table-cell">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.description}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {activity.event ?? "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatViewDate(activity.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableShell>
          ),
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string
    title: string
    description: string
    content: React.ReactNode
  }>

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {sections.map((section) => (
        <Card key={section.key} className="min-w-0">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">{section.content}</CardContent>
        </Card>
      ))}
    </div>
  )
}
