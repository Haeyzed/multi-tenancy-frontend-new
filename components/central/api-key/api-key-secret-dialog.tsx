"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { toastApiMessage } from "@/lib/central/api/toast"
import type { ApiKey } from "@/types/central/api-key"

interface ApiKeySecretDialogProps {
  apiKey: ApiKey | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeySecretDialog({
  apiKey,
  open,
  onOpenChange,
}: ApiKeySecretDialogProps) {
  const plainKey = apiKey?.plain_key

  async function handleCopy() {
    if (!plainKey) {
      return
    }

    await navigator.clipboard.writeText(plainKey)
    toastApiMessage(null, "API key copied to clipboard.")
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Save your API key</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Copy this key now. You will not be able to see it again after closing
            this dialog.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="rounded-md border bg-muted/40 p-3">
          <p className="break-all font-mono text-sm">{plainKey ?? "—"}</p>
        </div>

        <ResponsiveDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
          <Button type="button" onClick={handleCopy} disabled={!plainKey}>
            Copy key
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
