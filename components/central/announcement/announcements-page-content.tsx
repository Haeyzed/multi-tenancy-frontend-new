"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { AnnouncementFormDialog } from "@/components/central/announcement/announcement-form-dialog"
import { AnnouncementMetricCards } from "@/components/central/announcement/announcement-metric-cards"
import { AnnouncementsDataTable } from "@/components/central/announcement/announcements-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { PlatformAnnouncement } from "@/types/central/announcement"

export function AnnouncementsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingAnnouncement, setEditingAnnouncement] =
    React.useState<PlatformAnnouncement | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingAnnouncement(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((announcement: PlatformAnnouncement) => {
    setEditingAnnouncement(announcement)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Create and manage platform-wide messages for tenants and admins."
      >
        <Can permission={Permissions.platform.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create announcement
          </Button>
        </Can>
      </PageHeader>

      <AnnouncementMetricCards />

      <AnnouncementsDataTable onEdit={openEdit} />

      <AnnouncementFormDialog
        announcement={editingAnnouncement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
