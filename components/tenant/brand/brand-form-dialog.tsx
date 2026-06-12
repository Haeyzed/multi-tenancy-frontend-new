"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import {
  formStateFromBrand,
  formStateToPayload,
  slugifyName,
  type BrandFormState,
} from "@/components/tenant/brand/brand-form-utils"
import { MediaPickerField } from "@/components/tenant/media/media-picker-dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { brandService } from "@/services/tenant/brand.service"
import type { Brand } from "@/types/tenant/brand"
import type { MediaItem } from "@/types/tenant/media"

interface BrandFormDialogProps {
  brand: Brand | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BrandFormDialog({ brand, open, onOpenChange }: BrandFormDialogProps) {
  const isEditing = brand !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<BrandFormState>(() => formStateFromBrand(brand))
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [slugTouched, setSlugTouched] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setForm(formStateFromBrand(brand))
      setErrorMessage(null)
      setSlugTouched(Boolean(brand))
    }
  }, [open, brand])

  const mutation = useMutation({
    mutationFn: async (state: BrandFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && brand) {
        return brandService.update(brand.id, payload)
      }

      return brandService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Brand updated successfully." : "Brand created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.brands.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof BrandFormState>(
    key: K,
    value: BrandFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug:
        !isEditing && !slugTouched
          ? slugifyName(name)
          : current.slug,
    }))
  }

  function handleLogoChange(mediaId: number | null, media?: MediaItem | null) {
    setForm((current) => ({
      ...current,
      logoMediaId: mediaId,
      logoPreviewUrl: media?.url ?? null,
      logoPreviewTitle: media?.title ?? media?.file_name ?? current.name,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save brand. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit brand" : "Create brand"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update brand details, logo, and visibility."
              : "Add a new product brand to your catalog."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="brand-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="brand-name">Name</FieldLabel>
                <Input
                  id="brand-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Acme"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="brand-slug">Slug</FieldLabel>
                <Input
                  id="brand-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    updateField("slug", event.target.value)
                  }}
                  placeholder="acme"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="brand-description">Description</FieldLabel>
              <Textarea
                id="brand-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Premium outdoor gear"
                rows={3}
              />
            </Field>

            <MediaPickerField
              label="Logo"
              value={form.logoMediaId}
              previewUrl={form.logoPreviewUrl}
              previewTitle={form.logoPreviewTitle}
              onChange={handleLogoChange}
              accept="image/*"
            />

            <Field>
              <FieldLabel htmlFor="brand-website">Website URL</FieldLabel>
              <Input
                id="brand-website"
                type="url"
                value={form.websiteUrl}
                onChange={(event) => updateField("websiteUrl", event.target.value)}
                placeholder="https://acme.example.com"
              />
              <FieldDescription>Optional public website for this brand.</FieldDescription>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="brand-sort-order">Sort order</FieldLabel>
                <Input
                  id="brand-sort-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(event) => updateField("sortOrder", event.target.value)}
                />
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="brand-is-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="brand-is-active">Active</FieldLabel>
                  <FieldDescription>
                    Visible in the catalog
                  </FieldDescription>
                </div>
              </Field>
            </div>
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
          <Button type="submit" form="brand-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create brand"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
