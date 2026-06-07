"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import * as React from "react"

import {
  formStateFromAnnouncement,
  formStateToPayload,
  type AnnouncementFormState,
} from "@/components/central/announcement/announcement-form-utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/central/api/errors"
import { queryKeys } from "@/lib/central/query/keys"
import { announcementService } from "@/services/central/announcement.service"
import { planService } from "@/services/central/plan.service"
import {
  announcementTargetAudienceLabels,
  announcementTypeLabels,
  AnnouncementTargetAudiences,
  AnnouncementTypes,
  type PlatformAnnouncement,
} from "@/types/central/announcement"

interface AnnouncementFormDialogProps {
  announcement: PlatformAnnouncement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnnouncementFormDialog({
  announcement,
  open,
  onOpenChange,
}: AnnouncementFormDialogProps) {
  const isEditing = announcement !== null
  const queryClient = useQueryClient()
  const [form, setForm] = React.useState<AnnouncementFormState>(() =>
    formStateFromAnnouncement(announcement),
  )
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const plansQuery = useQuery({
    queryKey: [...queryKeys.plans.all, "all-options"],
    queryFn: () => planService.getPaginated({ per_page: 500 }),
    enabled: open,
  })

  const plans = plansQuery.data?.data ?? []

  React.useEffect(() => {
    if (open) {
      setForm(formStateFromAnnouncement(announcement))
      setErrorMessage(null)
    }
  }, [open, announcement])

  const mutation = useMutation({
    mutationFn: async (state: AnnouncementFormState) => {
      const payload = formStateToPayload(state)

      if (isEditing && announcement) {
        return announcementService.update(announcement.id, payload)
      }

      return announcementService.create(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all })
      onOpenChange(false)
    },
  })

  function updateField<K extends keyof AnnouncementFormState>(
    key: K,
    value: AnnouncementFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function togglePlanSlug(slug: string, checked: boolean) {
    setForm((current) => ({
      ...current,
      targetPlanSlugs: checked
        ? current.targetPlanSlugs.includes(slug)
          ? current.targetPlanSlugs
          : [...current.targetPlanSlugs, slug]
        : current.targetPlanSlugs.filter((value) => value !== slug),
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (
      form.targetAudience === AnnouncementTargetAudiences.PlanSpecific &&
      form.targetPlanSlugs.length === 0
    ) {
      setErrorMessage("Select at least one plan for plan-specific announcements.")
      return
    }

    try {
      await mutation.mutateAsync(form)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.firstFieldError ?? error.message)
        return
      }

      setErrorMessage("Unable to save announcement. Please try again.")
    }
  }

  const showPlanSelection =
    form.targetAudience === AnnouncementTargetAudiences.PlanSpecific

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit announcement" : "Create announcement"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? "Update the announcement content, audience, and visibility schedule."
              : "Publish a platform-wide message for tenants or administrators."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="announcement-form"
          className="flex max-h-[min(65vh,640px)] flex-col gap-6 overflow-y-auto pe-1"
          onSubmit={handleSubmit}
        >
          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="announcement-title">Title</FieldLabel>
              <Input
                id="announcement-title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Scheduled maintenance"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="announcement-body">Body</FieldLabel>
              <Textarea
                id="announcement-body"
                value={form.body}
                onChange={(event) => updateField("body", event.target.value)}
                placeholder="Describe the announcement in detail..."
                rows={5}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="announcement-type">Type</FieldLabel>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  updateField("type", value as AnnouncementFormState["type"])
                }
              >
                <SelectTrigger id="announcement-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AnnouncementTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {announcementTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="announcement-audience">Audience</FieldLabel>
              <Select
                value={form.targetAudience}
                onValueChange={(value) =>
                  updateField(
                    "targetAudience",
                    value as AnnouncementFormState["targetAudience"],
                  )
                }
              >
                <SelectTrigger id="announcement-audience" className="w-full">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AnnouncementTargetAudiences).map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {announcementTargetAudienceLabels[audience]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {showPlanSelection ? (
              <Field>
                <FieldLabel>Target plans</FieldLabel>
                <FieldDescription>
                  Select plans that should see this announcement (
                  {form.targetPlanSlugs.length} selected)
                </FieldDescription>
                {plansQuery.isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                  </div>
                ) : plans.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No plans available.
                  </p>
                ) : (
                  <ScrollArea className="h-40 rounded-md border pe-3">
                    <div className="flex flex-col gap-2 p-3">
                      {plans.map((plan) => (
                        <label
                          key={plan.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={form.targetPlanSlugs.includes(plan.slug)}
                            onCheckedChange={(checked) =>
                              togglePlanSlug(plan.slug, checked === true)
                            }
                          />
                          <span>{plan.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {plan.slug}
                          </span>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </Field>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="announcement-starts-at">Starts at</FieldLabel>
                <Input
                  id="announcement-starts-at"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) => updateField("startsAt", event.target.value)}
                />
                <FieldDescription>Leave empty to show immediately</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="announcement-ends-at">Ends at</FieldLabel>
                <Input
                  id="announcement-ends-at"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) => updateField("endsAt", event.target.value)}
                />
                <FieldDescription>Leave empty for no end date</FieldDescription>
              </Field>
            </div>

            <Field orientation="horizontal">
              <Switch
                id="announcement-active"
                checked={form.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="announcement-active">Active</FieldLabel>
                <FieldDescription>
                  Inactive announcements are hidden from tenants
                </FieldDescription>
              </div>
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
          <Button
            type="submit"
            form="announcement-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save changes"
            ) : (
              "Create announcement"
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
