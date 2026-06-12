"use client"

import { formatDistanceToNow } from "date-fns"
import { CheckIcon, FileIcon, ImageIcon, UploadIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import type { MediaItem } from "@/types/tenant/media"
import { Checkbox } from "@/components/ui/checkbox"

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface MediaGridProps {
  items: MediaItem[]
  mode: "manage" | "picker"
  selectedIds: number[]
  pickerValue?: number | null
  onToggleSelect?: (id: number) => void
  onPick?: (item: MediaItem) => void
}

export function MediaGrid({
  items,
  mode,
  selectedIds,
  pickerValue,
  onToggleSelect,
  onPick,
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div
        data-media-empty
        className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"
      >
        <UploadIcon className="mb-3 size-8 text-muted-foreground/70" />
        <p className="font-medium text-foreground">No files in this folder yet</p>
        <p className="mt-1 max-w-xs">
          Drag and drop files here, or use the Upload button to add images and
          documents.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => {
        const isImage = item.mime_type?.startsWith("image/")
        const isSelected =
          mode === "picker"
            ? pickerValue === item.id
            : selectedIds.includes(item.id)

        return (
          <button
            key={item.id}
            type="button"
            data-media-item
            className={cn(
              "group relative overflow-hidden rounded-lg border bg-card text-left transition-colors hover:border-primary/40",
              isSelected && "border-primary ring-2 ring-primary/20",
            )}
            onClick={() => {
              if (mode === "picker") {
                onPick?.(item)
                return
              }

              onToggleSelect?.(item.id)
            }}
          >
            <div className="relative aspect-square bg-muted/40">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.alt_text ?? item.title ?? item.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <FileIcon className="size-10 text-muted-foreground" />
                </div>
              )}

              {mode === "manage" ? (
                <div className="absolute start-2 top-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect?.(item.id)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`Select ${item.title ?? item.name}`}
                  />
                </div>
              ) : null}

              {mode === "picker" && isSelected ? (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <CheckIcon className="size-4" />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-medium">
                {item.title ?? item.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isImage ? <ImageIcon className="size-3.5" /> : null}
                <span>{formatFileSize(item.size)}</span>
                {item.created_at ? (
                  <span className="truncate">
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
