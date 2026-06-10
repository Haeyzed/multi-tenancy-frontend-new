"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { changelogTypeOptions } from "@/lib/data-table/platform-filter-options"
import { queryKeys } from "@/lib/central/query/keys"
import { changelogService } from "@/services/central/changelog.service"
import {
  ChangelogTypes,
  type ChangelogType,
  type PlatformChangelog,
} from "@/types/central/changelog"

interface ChangelogFormDialogProps {
  entry: PlatformChangelog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ChangelogFormState {
  version: string
  title: string
  description: string
  type: ChangelogType
  isPublished: boolean
  publishedAt: string
}

function entryToFormState(entry: PlatformChangelog | null): ChangelogFormState {
  return {
    version: entry?.version ?? "",
    title: entry?.title ?? "",
    description: entry?.description ?? "",
    type: entry?.type ?? ChangelogTypes.Feature,
    isPublished: entry?.is_published ?? false,
    publishedAt: entry?.published_at?.slice(0, 10) ?? "",
  }
}

export function ChangelogFormDialog({
  entry,
  open,
  onOpenChange,
}: ChangelogFormDialogProps) {
  const isEditing = entry !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<ChangelogFormState>(() =>
    entryToFormState(entry),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setForm(entryToFormState(entry))
      setErrorMessage(null)
    }
  }, [open, entry])

  const mutation = useMutation({
    mutationFn: async (state: ChangelogFormState) => {
      const payload = {
        version: state.version.trim(),
        title: state.title.trim(),
        description: state.description.trim(),
        type: state.type,
        is_published: state.isPublished,
        published_at: state.publishedAt || null,
      }

      if (isEditing && entry) {
        return changelogService.update(entry.id, payload)
      }

      return changelogService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Changelog updated successfully." : "Changelog entry created.",
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.changelog.all })
      onOpenChange(false)
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong.",
      )
    },
  })

  const isPending = mutation.isPending

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit changelog entry" : "Add changelog entry"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Document platform release notes for tenants and internal teams.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate(form)
          }}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="changelog-version">Version</FieldLabel>
                <Input
                  id="changelog-version"
                  value={form.version}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      version: event.target.value,
                    }))
                  }
                  placeholder="1.2.0"
                  disabled={isPending}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="changelog-type">Type</FieldLabel>
                <OptionsCombobox
                  id="changelog-type"
                  items={[...changelogTypeOptions]}
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as ChangelogType,
                    }))
                  }
                  disabled={isPending}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="changelog-title">Title</FieldLabel>
              <Input
                id="changelog-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                disabled={isPending}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="changelog-description">Description</FieldLabel>
              <Textarea
                id="changelog-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={5}
                disabled={isPending}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="changelog-published-at">Publish date</FieldLabel>
              <Input
                id="changelog-published-at"
                type="date"
                value={form.publishedAt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    publishedAt: event.target.value,
                  }))
                }
                disabled={isPending}
              />
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="changelog-published"
                checked={form.isPublished}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    isPublished: checked === true,
                  }))
                }
                disabled={isPending}
              />
              <FieldLabel htmlFor="changelog-published">Published</FieldLabel>
            </Field>
            <FieldDescription>
              Draft entries stay hidden until published.
            </FieldDescription>

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </FieldGroup>

          <ResponsiveDialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending || !form.version || !form.title || !form.description
              }
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : null}
              {isEditing ? "Save changes" : "Add entry"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
