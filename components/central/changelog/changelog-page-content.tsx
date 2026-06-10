"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { ChangelogDataTable } from "@/components/central/changelog/changelog-data-table"
import { ChangelogFormDialog } from "@/components/central/changelog/changelog-form-dialog"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { PlatformChangelog } from "@/types/central/changelog"

export function ChangelogPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingEntry, setEditingEntry] = React.useState<PlatformChangelog | null>(
    null,
  )

  const openCreate = React.useCallback(() => {
    setEditingEntry(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((entry: PlatformChangelog) => {
    setEditingEntry(entry)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Changelog"
        description="Publish release notes and track platform version history."
      >
        <Can permission={Permissions.platform.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Add entry
          </Button>
        </Can>
      </PageHeader>

      <ChangelogDataTable onEdit={openEdit} />

      <ChangelogFormDialog
        entry={editingEntry}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
