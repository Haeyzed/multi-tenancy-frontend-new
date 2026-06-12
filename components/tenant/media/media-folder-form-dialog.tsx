"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { mediaFolderService } from "@/services/tenant/media-folder.service"
import type { MediaFolder } from "@/types/tenant/media"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

interface MediaFolderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentId?: number | null
  onCreated?: (folder: MediaFolder) => void
}

export function MediaFolderFormDialog({
  open,
  onOpenChange,
  parentId = null,
  onCreated,
}: MediaFolderFormDialogProps) {
  const queryClient = useQueryClient()
  const [name, setName] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setName("")
      setErrorMessage(null)
    }
  }, [open])

  const mutation = useMutation({
    mutationFn: () =>
      mediaFolderService.create({
        name: name.trim(),
        parent_id: parentId,
      }),
    onSuccess: async (result) => {
      toastApiMessage(result.message, "Folder created successfully.")
      await queryClient.invalidateQueries({
        queryKey: tenantQueryKeys.mediaFolders.all,
      })
      onCreated?.(result.data)
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

      setErrorMessage("Unable to create folder. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create folder</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Organize your media library with folders.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="media-folder-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="media-folder-name">Folder name</FieldLabel>
              <Input
                id="media-folder-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Product photos"
                required
              />
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="media-folder-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create folder"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
