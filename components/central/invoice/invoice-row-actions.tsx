"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  BanIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  EyeIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { RecordViewDialog } from "@/components/central/record-view-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePermissions } from "@/hooks/use-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { Permissions } from "@/lib/central/auth/permissions"
import { getInvoiceViewFields } from "@/lib/central/view/view-fields"
import { queryKeys } from "@/lib/central/query/keys"
import { invoiceService } from "@/services/central/invoice.service"
import { InvoiceStatuses, type Invoice } from "@/types/central/invoice"

interface InvoiceRowActionsProps {
  invoice: Invoice
}

export function InvoiceRowActions({ invoice }: InvoiceRowActionsProps) {
  const queryClient = useQueryClient()
  const { can } = usePermissions()
  const [viewOpen, setViewOpen] = React.useState(false)
  const [markPaidOpen, setMarkPaidOpen] = React.useState(false)
  const [voidOpen, setVoidOpen] = React.useState(false)

  const canView = can(Permissions.billing.view)
  const canManage = can(Permissions.billing.manage)
  const canMarkPaid = canManage && invoice.status === InvoiceStatuses.Open
  const canVoid =
    canManage &&
    (invoice.status === InvoiceStatuses.Open ||
      invoice.status === InvoiceStatuses.Draft)

  async function handleMarkPaid() {
    const result = await invoiceService.markAsPaid(invoice.id)
    toastApiMessage(result.message, "Invoice marked as paid.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
    await queryClient.invalidateQueries({ queryKey: queryKeys.payments.all })
  }

  async function handleVoid() {
    const result = await invoiceService.void(invoice.id)
    toastApiMessage(result.message, "Invoice voided.")
    await queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all })
  }

  if (!canView && !canManage) {
    return null
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {canView ? (
            <DropdownMenuItem onClick={() => setViewOpen(true)}>
              <EyeIcon />
              View
            </DropdownMenuItem>
          ) : null}
          {canView && invoice.pdf_url ? (
            <DropdownMenuItem
              onClick={() => window.open(invoice.pdf_url!, "_blank", "noreferrer")}
            >
              <ExternalLinkIcon />
              Download PDF
            </DropdownMenuItem>
          ) : null}
          {canMarkPaid ? (
            <DropdownMenuItem onClick={() => setMarkPaidOpen(true)}>
              <CheckCircle2Icon />
              Mark as paid
            </DropdownMenuItem>
          ) : null}
          {canVoid ? (
            <DropdownMenuItem onClick={() => setVoidOpen(true)}>
              <BanIcon />
              Void
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canView ? (
        <RecordViewDialog
          open={viewOpen}
          onOpenChange={setViewOpen}
          title={invoice.invoice_number}
          description={invoice.tenant?.name ?? "Invoice details"}
          fields={getInvoiceViewFields(invoice)}
        />
      ) : null}

      {canMarkPaid ? (
        <DeleteConfirmDialog
          open={markPaidOpen}
          onOpenChange={setMarkPaidOpen}
          title="Mark invoice as paid?"
          description={
            <>
              This will mark{" "}
              <span className="font-medium text-foreground">
                {invoice.invoice_number}
              </span>{" "}
              as fully paid for{" "}
              <span className="font-medium text-foreground">
                {invoice.tenant?.name ?? "this tenant"}
              </span>
              .
            </>
          }
          confirmLabel="Mark as paid"
          onConfirm={handleMarkPaid}
        />
      ) : null}

      {canVoid ? (
        <DeleteConfirmDialog
          open={voidOpen}
          onOpenChange={setVoidOpen}
          title="Void invoice?"
          description={
            <>
              This will void{" "}
              <span className="font-medium text-foreground">
                {invoice.invoice_number}
              </span>
              . This action cannot be undone.
            </>
          }
          confirmLabel="Void invoice"
          onConfirm={handleVoid}
        />
      ) : null}
    </>
  )
}
