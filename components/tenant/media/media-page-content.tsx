"use client"

import { MediaLibraryPanel } from "@/components/tenant/media/media-library-panel"
import { MediaMetricCards } from "@/components/tenant/media/media-metric-cards"
import { PageHeader } from "@/components/layout/page-header"

export function MediaPageContent() {
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload, organize, move, and copy files across folders."
      />

      <MediaMetricCards />

      <MediaLibraryPanel mode="manage" />
    </>
  )
}
