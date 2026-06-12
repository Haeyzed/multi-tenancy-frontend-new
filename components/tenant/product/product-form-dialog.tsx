"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import { OptionsCombobox } from "@/components/central/form/options-combobox"
import {
  formStateFromProduct,
  formStateToPayload,
  productStatusOptions,
  productTypeOptions,
  productVisibilityOptions,
  slugifyName,
  type ProductFormState,
} from "@/components/tenant/product/product-form-utils"
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
import { brandService } from "@/services/tenant/brand.service"
import { categoryService } from "@/services/tenant/category.service"
import { productService } from "@/services/tenant/product.service"
import type { Product } from "@/types/tenant/product"

interface ProductFormDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductFormDialog({ product, open, onOpenChange }: ProductFormDialogProps) {
  const isEditing = product !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<ProductFormState>(() => formStateFromProduct(product))
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [slugTouched, setSlugTouched] = React.useState(false)

  const brandsQuery = useQuery({
    queryKey: tenantQueryKeys.brands.options(),
    queryFn: () => brandService.getOptions(),
    enabled: open,
  })

  const categoriesQuery = useQuery({
    queryKey: tenantQueryKeys.categories.options(),
    queryFn: () => categoryService.getOptions(),
    enabled: open,
  })

  const brandOptions = React.useMemo(() => {
    const noneOption = { value: "", label: "No brand" }
    const items = (brandsQuery.data ?? []).map((option) => ({
      value: String(option.value),
      label: option.label,
    }))

    return [noneOption, ...items]
  }, [brandsQuery.data])

  const categoryOptions = React.useMemo(() => {
    const noneOption = { value: "", label: "No category" }
    const items = (categoriesQuery.data ?? []).map((option) => ({
      value: option.value,
      label: option.label,
    }))

    return [noneOption, ...items]
  }, [categoriesQuery.data])

  React.useEffect(() => {
    if (open) {
      setForm(formStateFromProduct(product))
      setErrorMessage(null)
      setSlugTouched(Boolean(product))
    }
  }, [open, product])

  const mutation = useMutation({
    mutationFn: async (state: ProductFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && product) {
        return productService.update(product.id, payload)
      }

      return productService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        isEditing ? "Product updated successfully." : "Product created successfully.",
      )
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.products.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K],
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

      setErrorMessage("Unable to save product. Please try again.")
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit product" : "Create product"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update product details, pricing, and catalog settings."
              : "Add a new product to your catalog."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form id="product-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-name">Name</FieldLabel>
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Wireless Headphones"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-slug">Slug</FieldLabel>
                <Input
                  id="product-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    updateField("slug", event.target.value)
                  }}
                  placeholder="wireless-headphones"
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
                <Input
                  id="product-sku"
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  placeholder="WH-001"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-price">Price</FieldLabel>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-brand">Brand</FieldLabel>
                {brandsQuery.isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <OptionsCombobox
                    id="product-brand"
                    items={brandOptions}
                    value={form.brandId}
                    onValueChange={(value) => updateField("brandId", value)}
                    placeholder="Select brand"
                  />
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                {categoriesQuery.isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <OptionsCombobox
                    id="product-category"
                    items={categoryOptions}
                    value={form.categoryId}
                    onValueChange={(value) => updateField("categoryId", value)}
                    placeholder="Select category"
                  />
                )}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="product-type">Type</FieldLabel>
                <OptionsCombobox
                  id="product-type"
                  items={[...productTypeOptions]}
                  value={form.type}
                  onValueChange={(value) =>
                    updateField("type", value as ProductFormState["type"])
                  }
                  placeholder="Select type"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-status">Status</FieldLabel>
                <OptionsCombobox
                  id="product-status"
                  items={[...productStatusOptions]}
                  value={form.status}
                  onValueChange={(value) =>
                    updateField("status", value as ProductFormState["status"])
                  }
                  placeholder="Select status"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-visibility">Visibility</FieldLabel>
                <OptionsCombobox
                  id="product-visibility"
                  items={[...productVisibilityOptions]}
                  value={form.visibility}
                  onValueChange={(value) =>
                    updateField("visibility", value as ProductFormState["visibility"])
                  }
                  placeholder="Select visibility"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="product-short-description">Short description</FieldLabel>
              <Input
                id="product-short-description"
                value={form.shortDescription}
                onChange={(event) => updateField("shortDescription", event.target.value)}
                placeholder="Premium noise-cancelling headphones"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Full product description"
                rows={4}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="product-compare-price">Compare price</FieldLabel>
                <Input
                  id="product-compare-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(event) => updateField("comparePrice", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-cost-price">Cost price</FieldLabel>
                <Input
                  id="product-cost-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.costPrice}
                  onChange={(event) => updateField("costPrice", event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-low-stock">Low stock threshold</FieldLabel>
                <Input
                  id="product-low-stock"
                  type="number"
                  min={0}
                  value={form.lowStockThreshold}
                  onChange={(event) => updateField("lowStockThreshold", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field orientation="horizontal">
                <Switch
                  id="product-is-featured"
                  checked={form.isFeatured}
                  onCheckedChange={(checked) => updateField("isFeatured", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="product-is-featured">Featured</FieldLabel>
                </div>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="product-requires-shipping"
                  checked={form.requiresShipping}
                  onCheckedChange={(checked) => updateField("requiresShipping", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="product-requires-shipping">Requires shipping</FieldLabel>
                </div>
              </Field>
              <Field orientation="horizontal">
                <Switch
                  id="product-allow-backorders"
                  checked={form.allowBackorders}
                  onCheckedChange={(checked) => updateField("allowBackorders", checked)}
                />
                <div className="flex flex-col gap-1">
                  <FieldLabel htmlFor="product-allow-backorders">Allow backorders</FieldLabel>
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
          <Button type="submit" form="product-form" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create product"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
