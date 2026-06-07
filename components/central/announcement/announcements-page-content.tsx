"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { AnnouncementFormDialog } from "@/components/central/announcement/announcement-form-dialog"
import { AnnouncementsDataTable } from "@/components/central/announcement/announcements-data-table"
import { PageBreadcrumb } from "@/components/central/page-breadcrumb"
import { Button } from "@/components/ui/button"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageBreadcrumb
          items={[
            { label: "Central", href: "/central/dashboard" },
            { label: "Announcements" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage platform-wide messages for tenants and admins.
            </p>
          </div>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create announcement
          </Button>
        </div>
      </div>

      <AnnouncementsDataTable onEdit={openEdit} />

      <AnnouncementFormDialog
        announcement={editingAnnouncement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
