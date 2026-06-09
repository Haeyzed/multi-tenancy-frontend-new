"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import * as React from "react"

import { DeleteConfirmDialog } from "@/components/central/delete-confirm-dialog"
import { Badge } from "@/components/ui/badge"
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
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { OptionsCombobox } from "@/components/central/form/options-combobox"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError } from "@/lib/central/api/errors"
import { toastApiMessage } from "@/lib/central/api/toast"
import { queryKeys } from "@/lib/central/query/keys"
import { planFeatureService } from "@/services/central/plan-feature.service"
import type { Plan } from "@/types/central/plan"
import {
  FeatureTypes,
  featureTypeLabels,
  type FeatureType,
  type PlanFeature,
} from "@/types/central/plan-feature"

interface PlanFeaturesDialogProps {
  plan: Plan
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FeatureFormState {
  featureKey: string
  featureValue: string
  featureType: FeatureType
}

const defaultFormState: FeatureFormState = {
  featureKey: "",
  featureValue: "",
  featureType: FeatureTypes.Integer,
}

const featureTypeOptions = Object.values(FeatureTypes).map((type) => ({
  value: type,
  label: featureTypeLabels[type],
}))

const booleanFeatureValueOptions = [
  { value: "true", label: "true" },
  { value: "false", label: "false" },
]

function featureToFormState(feature: PlanFeature): FeatureFormState {
  return {
    featureKey: feature.feature_key,
    featureValue: feature.feature_value,
    featureType: feature.feature_type,
  }
}

function FeatureTypeBadge({ type }: { type: FeatureType }) {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {featureTypeLabels[type]}
    </Badge>
  )
}

export function PlanFeaturesDialog({
  plan,
  open,
  onOpenChange,
}: PlanFeaturesDialogProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<FeatureFormState>(defaultFormState)
  const [editingFeature, setEditingFeature] = React.useState<PlanFeature | null>(
    null,
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [deletingFeature, setDeletingFeature] = React.useState<PlanFeature | null>(
    null,
  )

  const featuresQuery = useQuery({
    queryKey: queryKeys.planFeatures.byPlan(plan.id),
    queryFn: () => planFeatureService.getByPlan(plan.id),
    enabled: open,
  })

  const features = featuresQuery.data?.data ?? []

  React.useEffect(() => {
    if (open) {
      setForm(defaultFormState)
      setEditingFeature(null)
      setErrorMessage(null)
      setDeletingFeature(null)
    }
  }, [open, plan.id])

  const invalidate = React.useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.planFeatures.byPlan(plan.id),
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all }),
    ])
  }, [plan.id, queryClient])

  const saveMutation = useMutation({
    mutationFn: async (state: FeatureFormState) => {
      const payload = {
        plan_id: plan.id,
        feature_key: state.featureKey.trim(),
        feature_value: state.featureValue.trim(),
        feature_type: state.featureType,
      }

      if (editingFeature) {
        return planFeatureService.update(editingFeature.id, payload)
      }

      return planFeatureService.create(payload)
    },
    onSuccess: async (result) => {
      toastApiMessage(
        result.message,
        editingFeature ? "Feature updated successfully." : "Feature created successfully.",
      )
      await invalidate()
      setForm(defaultFormState)
      setEditingFeature(null)
      setErrorMessage(null)
    },
  })

  function updateForm<K extends keyof FeatureFormState>(
    key: K,
    value: FeatureFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleDeleteFeature() {
    if (!deletingFeature) {
      return
    }

    const featureId = deletingFeature.id

    const result = await planFeatureService.delete(featureId)
    toastApiMessage(result.message, "Feature deleted successfully.")
    await invalidate()

    if (editingFeature?.id === featureId) {
      setEditingFeature(null)
      setForm(defaultFormState)
    }

    setDeletingFeature(null)
  }

  function startEdit(feature: PlanFeature) {
    setEditingFeature(feature)
    setForm(featureToFormState(feature))
    setErrorMessage(null)
  }

  function cancelEdit() {
    setEditingFeature(null)
    setForm(defaultFormState)
    setErrorMessage(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await saveMutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save plan feature. Please try again.")
    }
  }

  const isSaving = saveMutation.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Plan features</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Manage enforceable limits and flags for{" "}
              <span className="font-medium text-foreground">{plan.name}</span>.
              These control middleware, quotas, and entitlements.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {errorMessage ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <FieldGroup>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {editingFeature ? "Edit feature" : "Add feature"}
                </p>
                {editingFeature ? (
                  <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                    Cancel edit
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="feature-key">Feature key</FieldLabel>
                  <Input
                    id="feature-key"
                    value={form.featureKey}
                    onChange={(event) =>
                      updateForm("featureKey", event.target.value)
                    }
                    placeholder="max_products"
                    required
                  />
                  <FieldDescription>
                    Machine-readable key, e.g. max_staff, api_access
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="feature-type">Type</FieldLabel>
                  <OptionsCombobox
                    id="feature-type"
                    items={featureTypeOptions}
                    value={form.featureType}
                    onValueChange={(value) =>
                      updateForm("featureType", value as FeatureType)
                    }
                    placeholder="Select type"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="feature-value">Value</FieldLabel>
                {form.featureType === FeatureTypes.Boolean ? (
                  <OptionsCombobox
                    id="feature-value"
                    items={booleanFeatureValueOptions}
                    value={form.featureValue}
                    onValueChange={(value) => updateForm("featureValue", value)}
                    placeholder="Select value"
                  />
                ) : (
                  <Input
                    id="feature-value"
                    value={form.featureValue}
                    onChange={(event) =>
                      updateForm("featureValue", event.target.value)
                    }
                    placeholder={
                      form.featureType === FeatureTypes.Integer
                        ? "1000"
                        : form.featureType === FeatureTypes.Decimal
                          ? "99.99"
                          : "unlimited"
                    }
                    required
                  />
                )}
                <FieldDescription>
                  Stored as a string; interpreted using the selected type.
                </FieldDescription>
              </Field>

              <Button type="submit" disabled={isSaving} className="w-fit">
                {isSaving ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Saving...
                  </>
                ) : editingFeature ? (
                  "Save changes"
                ) : (
                  <>
                    <PlusIcon />
                    Add feature
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>

          <Separator />

          {featuresQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : features.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No features defined for this plan yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-24 text-end">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-mono text-sm">
                      {feature.feature_key}
                    </TableCell>
                    <TableCell>
                      <FeatureTypeBadge type={feature.feature_type} />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {feature.feature_value}
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(feature)}
                          aria-label={`Edit ${feature.feature_key}`}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingFeature(feature)}
                          aria-label={`Delete ${feature.feature_key}`}
                        >
                          <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <DeleteConfirmDialog
        open={deletingFeature !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setDeletingFeature(null)
          }
        }}
        title="Delete plan feature?"
        description={
          <>
            This will remove{" "}
            <span className="font-mono font-medium text-foreground">
              {deletingFeature?.feature_key}
            </span>{" "}
            from {plan.name}. This action cannot be undone.
          </>
        }
        onConfirm={handleDeleteFeature}
      />
    </>
  )
}
