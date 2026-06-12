"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FolderPlusIcon, Loader2Icon } from "lucide-react"
import * as React from "react"

import { MediaFolderFormDialog } from "@/components/tenant/media/media-folder-form-dialog"
import { MediaFolderTree } from "@/components/tenant/media/media-folder-tree"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { mediaFolderService } from "@/services/tenant/media-folder.service"
import { mediaService } from "@/services/tenant/media.service"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaMoveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  mode: "move" | "copy"
  onSuccess?: () => void
}

export function MediaMoveDialog({
  open,
  onOpenChange,
  ids,
  mode,
  onSuccess,
}: MediaMoveDialogProps) {
  const queryClient = useQueryClient()
  const [targetFolderId, setTargetFolderId] = React.useState<number | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const treeQuery = useQuery({
    queryKey: tenantQueryKeys.mediaFolders.tree(),
    queryFn: () => mediaFolderService.getTree(),
    enabled: open,
  })

  React.useEffect(() => {
    if (open) {
      setTargetFolderId(null)
      setErrorMessage(null)
    }
  }, [open])

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "move") {
        return mediaService.move(ids, targetFolderId)
      }

      return mediaService.copy(ids, targetFolderId)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        mode === "move" ? "Files moved successfully." : "Files copied successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.media.all })
      await queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.mediaFolders.all,
      })
      onSuccess?.()
      onOpenChange(false)
    },
  })

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await mutation.mutateAsync()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to complete this action. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {mode === "move" ? "Move files" : "Copy files"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose a destination folder for {ids.length} selected file
            {ids.length === 1 ? "" : "s"}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="media-move-form" className="space-y-4" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          {treeQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading folders...</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">Destination</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFolderDialogOpen(true)}
                >
                  <FolderPlusIcon className="size-4" />
                  New folder
                </Button>
              </div>
              <MediaFolderTree
                tree={treeQuery.data?.tree ?? []}
                selectedFolderId={targetFolderId}
                onSelectFolder={setTargetFolderId}
              />
            </div>
          )}
        </form>

        <MediaFolderFormDialog
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          parentId={targetFolderId}
          onCreated={(folder) => setTargetFolderId(folder.id)}
        />

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="media-move-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Working...
              </>
            ) : mode === "move" ? (
              "Move files"
            ) : (
              "Copy files"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
