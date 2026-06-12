"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  CopyIcon,
  FolderPlusIcon,
  Loader2Icon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { MediaFolderTree } from "@/components/tenant/media/media-folder-tree"
import { MediaGrid } from "@/components/tenant/media/media-grid"
import { MediaFolderFormDialog } from "@/components/tenant/media/media-folder-form-dialog"
import { MediaMoveDialog } from "@/components/tenant/media/media-move-dialog"
import { MediaUploadTrigger, MediaUploadZone } from "@/components/tenant/media/media-upload-zone"
import { TenantCan } from "@/components/tenant/can"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useTenantPermissions } from "@/hooks/use-tenant-permissions"
import { toastApiMessage } from "@/lib/central/api/toast"
import { TenantPermissions } from "@/lib/tenant/auth/permissions"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { mediaFolderService } from "@/services/tenant/media-folder.service"
import { mediaService } from "@/services/tenant/media.service"
import type { MediaItem } from "@/types/tenant/media"

function ActionToolbar({
  mode,
  selectedCount,
  uploadPending,
  onMove,
  onCopy,
  onDelete,
  canUpload,
}: {
  mode: "manage" | "picker"
  selectedCount: number
  uploadPending: boolean
  onMove: () => void
  onCopy: () => void
  onDelete: () => void
  canUpload: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {mode === "manage" && selectedCount > 0 ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={onMove}>
            Move ({selectedCount})
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCopy}>
            <CopyIcon />
            Copy
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            <Trash2Icon />
            Delete
          </Button>
        </>
      ) : null}

      {canUpload ? (
        <MediaUploadTrigger>
          {uploadPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <UploadIcon />
          )}
          Upload
        </MediaUploadTrigger>
      ) : null}
    </div>
  )
}

interface MediaLibraryPanelProps {
  mode?: "manage" | "picker"
  pickerValue?: number | null
  onPick?: (item: MediaItem) => void
  accept?: string
  className?: string
}

export function MediaLibraryPanel({
  mode = "manage",
  pickerValue = null,
  onPick,
  accept,
  className,
}: MediaLibraryPanelProps) {
  const queryClient = useQueryClient()
  const { can } = useTenantPermissions()
  const canUpload = can(TenantPermissions.settings.manage)
  const [folderId, setFolderId] = React.useState<number | null>(null)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [folderDialogOpen, setFolderDialogOpen] = React.useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = React.useState(false)
  const [copyDialogOpen, setCopyDialogOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const perPage = 20

  const treeQuery = useQuery({
    queryKey: tenantQueryKeys.mediaFolders.tree(),
    queryFn: () => mediaFolderService.getTree(),
  })

  const mediaQuery = useQuery({
    queryKey: tenantQueryKeys.media.list({
      page,
      perPage,
      search,
      folderId,
      mimeType: accept?.startsWith("image") ? "image" : "",
      rootOnly: folderId === null && mode === "manage",
    }),
    queryFn: () =>
      mediaService.getPaginated({
        page,
        per_page: perPage,
        search: search || undefined,
        folder_id: folderId ?? undefined,
        mime_type: accept?.startsWith("image") ? "image" : undefined,
        root_only: folderId === null && mode === "manage",
      }),
  })

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) =>
      mediaService.bulkUpload(files, { folder_id: folderId }),
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Files uploaded successfully.")
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.media.all })
      await queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.mediaFolders.all,
      })
    },
  })

  const handleFilesSelected = React.useCallback(
    (files: File[]) => {
      uploadMutation.mutate(files)
    },
    [uploadMutation],
  )

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => mediaService.bulkDelete(ids),
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Selected files deleted.")
      setSelectedIds([])
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.media.all })
      await queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.mediaFolders.all,
      })
    },
  })

  const items = mediaQuery.data?.data ?? []
  const pageCount = mediaQuery.data?.meta.last_page ?? 1

  function toggleSelect(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 rounded-lg border bg-card p-3 lg:w-64">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Folders</p>
            <TenantCan permission={TenantPermissions.settings.manage}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFolderDialogOpen(true)}
              >
                <FolderPlusIcon className="size-4" />
                New folder
              </Button>
            </TenantCan>
          </div>
          {treeQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <MediaFolderTree
              tree={treeQuery.data?.tree ?? []}
              selectedFolderId={folderId}
              onSelectFolder={(nextFolderId) => {
                setFolderId(nextFolderId)
                setPage(1)
                setSelectedIds([])
              }}
            />
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <MediaUploadZone
            accept={accept}
            disabled={!canUpload}
            uploadPending={uploadMutation.isPending}
            onFilesSelected={handleFilesSelected}
            className="space-y-4"
            header={
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <SearchIcon className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value)
                      setPage(1)
                    }}
                    placeholder="Search files..."
                    className="ps-9"
                  />
                </div>

                <ActionToolbar
                  mode={mode}
                  selectedCount={selectedIds.length}
                  uploadPending={uploadMutation.isPending}
                  onMove={() => setMoveDialogOpen(true)}
                  onCopy={() => setCopyDialogOpen(true)}
                  onDelete={() => setDeleteOpen(true)}
                  canUpload={canUpload}
                />
              </div>
            }
          >
            {mediaQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : (
              <MediaGrid
                items={items}
                mode={mode}
                selectedIds={selectedIds}
                pickerValue={pickerValue}
                onToggleSelect={toggleSelect}
                onPick={onPick}
              />
            )}
          </MediaUploadZone>

          {pageCount > 1 ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pageCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <MediaFolderFormDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        parentId={folderId}
      />

      <MediaMoveDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        ids={selectedIds}
        mode="move"
        onSuccess={() => {
          setSelectedIds([])
          setMoveDialogOpen(false)
        }}
      />

      <MediaMoveDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        ids={selectedIds}
        mode="copy"
        onSuccess={() => {
          setSelectedIds([])
          setCopyDialogOpen(false)
        }}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete selected files?"
        description={
          <>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {selectedIds.length}
            </span>{" "}
            selected file{selectedIds.length === 1 ? "" : "s"}.
          </>
        }
        onConfirm={async () => {
          await deleteMutation.mutateAsync(selectedIds)
        }}
        confirmLabel={`Delete ${selectedIds.length}`}
      />
    </div>
  )
}
