"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { UsageRecordFormDialog } from "@/components/central/usage-record/usage-record-form-dialog"
import { UsageRecordsDataTable } from "@/components/central/usage-record/usage-records-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { UsageRecord } from "@/types/central/usage-record"

export function UsageRecordsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingRecord, setEditingRecord] = React.useState<UsageRecord | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingRecord(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((record: UsageRecord) => {
    setEditingRecord(record)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Usage records"
        description="Track metered usage against subscriptions and plan limits."
      >
        <Can permission={Permissions.billing.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Record usage
          </Button>
        </Can>
      </PageHeader>

      <UsageRecordsDataTable onEdit={openEdit} />

      <UsageRecordFormDialog
        record={editingRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
