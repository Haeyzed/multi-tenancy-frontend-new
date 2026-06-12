"use client"

import * as React from "react"

import { MediaLibraryPanel } from "@/components/tenant/media/media-library-panel"
import { MediaMetricCards } from "@/components/tenant/media/media-metric-cards"
import { PageHeader } from "@/components/layout/page-header"
import type { MediaItem } from "@/types/tenant/media"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: number | null
  onSelect: (item: MediaItem | null) => void
  accept?: string
  title?: string
  description?: string
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  value = null,
  onSelect,
  accept = "image/*",
  title = "Media library",
  description = "Upload a new file or choose an existing one from your library.",
}: MediaPickerDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <MediaLibraryPanel
          mode="picker"
          pickerValue={value}
          accept={accept}
          onPick={(item) => {
            onSelect(item)
            onOpenChange(false)
          }}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

interface MediaPickerFieldProps {
  label?: string
  value: number | null
  previewUrl?: string | null
  previewTitle?: string | null
  onChange: (mediaId: number | null, media?: MediaItem | null) => void
  accept?: string
}

export function MediaPickerField({
  label = "Media",
  value,
  previewUrl,
  previewTitle,
  onChange,
  accept = "image/*",
}: MediaPickerFieldProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-start gap-3 rounded-lg border p-3">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={previewTitle ?? "Selected media"}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No file</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
              onClick={() => setOpen(true)}
            >
              {value ? "Change" : "Choose from library"}
            </button>
            {value ? (
              <button
                type="button"
                className="rounded-md border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                onClick={() => onChange(null, null)}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onSelect={(item) => onChange(item?.id ?? null, item)}
        accept={accept}
      />
    </>
  )
}
