"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import {
  formStateFromCategory,
  formStateToPayload,
  slugifyName,
  type CategoryFormState,
} from "@/components/tenant/category/category-form-utils"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { tenantQueryKeys } from "@/lib/tenant/query/keys"
import { categoryService } from "@/services/tenant/category.service"
import type { Category } from "@/types/tenant/category"
import type { MediaItem } from "@/types/tenant/media"

interface CategoryFormDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryFormDialog({
  category,
  open,
  onOpenChange,
}: CategoryFormDialogProps) {
  const isEditing = category !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<CategoryFormState>(() =>
    formStateFromCategory(category),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [slugTouched, setSlugTouched] = React.useState(false)

  const optionsQuery = useQuery({
    queryKey: tenantQueryKeys.categories.options(),
    queryFn: () => categoryService.getOptions(),
    enabled: open,
  })

  const parentOptions = React.useMemo(() => {
    const noneOption = { value: "", label: "None (root category)" }
    const items = (optionsQuery.data ?? [])
      .filter((option) => option.value !== category?.id)
      .map((option) => ({ value: option.value, label: option.label }))

    return [noneOption, ...items]
  }, [optionsQuery.data, category?.id])

  React.useEffect(() => {
    if (open) {
      setForm(formStateFromCategory(category))
      setErrorMessage(null)
      setSlugTouched(Boolean(category))
    }
  }, [open, category])

  const mutation = useMutation({
    mutationFn: async (state: CategoryFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && category) {
        return categoryService.update(category.id, payload)
      }

      return categoryService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Category updated successfully." : "Category created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.categories.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof CategoryFormState>(
    key: K,
    value: CategoryFormState[K],
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

  function handleBannerChange(mediaId: number | null, media?: MediaItem | null) {
    setForm((current) => ({
      ...current,
      bannerMediaId: mediaId,
      bannerPreviewUrl: media?.url ?? null,
      bannerPreviewTitle: media?.title ?? media?.file_name ?? current.name,
    }))
  }

  function handleIconChange(mediaId: number | null, media?: MediaItem | null) {
    setForm((current) => ({
      ...current,
      iconMediaId: mediaId,
      iconPreviewUrl: media?.url ?? null,
      iconPreviewTitle: media?.title ?? media?.file_name ?? current.name,
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

      setErrorMessage("Unable to save category. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit category" : "Create category"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update category details, hierarchy, and visibility."
              : "Add a new product category to your catalog."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="category-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category-parent">Parent category</FieldLabel>
              {optionsQuery.isLoading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <OptionsCombobox
                  id="category-parent"
                  items={parentOptions}
                  value={form.parentId}
                  onValueChange={(value) => updateField("parentId", value)}
                  placeholder="Select parent category"
                />
              )}
              <FieldDescription>Optional. Leave empty for a root category.</FieldDescription>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="category-name">Name</FieldLabel>
                <Input
                  id="category-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Electronics"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
                <Input
                  id="category-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    updateField("slug", event.target.value)
                  }}
                  placeholder="electronics"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="category-description">Description</FieldLabel>
              <Textarea
                id="category-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Consumer electronics and accessories"
                rows={3}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <MediaPickerField
                label="Banner"
                value={form.bannerMediaId}
                previewUrl={form.bannerPreviewUrl}
                previewTitle={form.bannerPreviewTitle}
                onChange={handleBannerChange}
                accept="image/*"
              />
              <MediaPickerField
                label="Icon"
                value={form.iconMediaId}
                previewUrl={form.iconPreviewUrl}
                previewTitle={form.iconPreviewTitle}
                onChange={handleIconChange}
                accept="image/*"
              />
            </div>

            <Field>
              <FieldLabel htmlFor="category-sort-order">Sort order</FieldLabel>
              <Input
                id="category-sort-order"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) => updateField("sortOrder", event.target.value)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field orientation="horizontal">
                <Switch
                  id="category-is-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="category-is-active">Active</FieldLabel>
                  <FieldDescription>Visible in catalog</FieldDescription>
                </div>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="category-is-featured"
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => updateField("isFeatured", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="category-is-featured">Featured</FieldLabel>
                </div>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="category-show-in-menu"
                  checked={form.showInMenu}
                  onCheckedChange={(checked) => updateField("showInMenu", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="category-show-in-menu">In menu</FieldLabel>
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
          <Button type="submit" form="category-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create category"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
