"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { SupportTicketAssignDialog } from "@/components/central/support-ticket/support-ticket-assign-dialog"
import { SupportTicketFormDialog } from "@/components/central/support-ticket/support-ticket-form-dialog"
import { SupportTicketMessagesDialog } from "@/components/central/support-ticket/support-ticket-messages-dialog"
import { SupportTicketMetricCards } from "@/components/central/support-ticket/support-ticket-metric-cards"
import { SupportTicketsDataTable } from "@/components/central/support-ticket/support-tickets-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { SupportTicket } from "@/types/central/support-ticket"

export function SupportTicketsPageContent() {
  const [formOpen, setFormOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [conversationOpen, setConversationOpen] = React.useState(false)
  const [editingTicket, setEditingTicket] = React.useState<SupportTicket | null>(null)
  const [assigningTicket, setAssigningTicket] = React.useState<SupportTicket | null>(
    null,
  )
  const [conversationTicket, setConversationTicket] =
    React.useState<SupportTicket | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingTicket(null)
    setFormOpen(true)
  }, [])

  const openEdit = React.useCallback((ticket: SupportTicket) => {
    setEditingTicket(ticket)
    setFormOpen(true)
  }, [])

  const openAssign = React.useCallback((ticket: SupportTicket) => {
    setAssigningTicket(ticket)
    setAssignOpen(true)
  }, [])

  const openConversation = React.useCallback((ticket: SupportTicket) => {
    setConversationTicket(ticket)
    setConversationOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Support tickets"
        description="Track tenant support requests, assign agents, and manage conversations."
      >
        <Can permission={Permissions.support.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create ticket
          </Button>
        </Can>
      </PageHeader>

      <SupportTicketMetricCards />

      <SupportTicketsDataTable
        onEdit={openEdit}
        onAssign={openAssign}
        onOpenConversation={openConversation}
      />

      <SupportTicketFormDialog
        ticket={editingTicket}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <SupportTicketAssignDialog
        ticket={assigningTicket}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />

      <SupportTicketMessagesDialog
        ticket={conversationTicket}
        open={conversationOpen}
        onOpenChange={setConversationOpen}
      />
    </>
  )
}
