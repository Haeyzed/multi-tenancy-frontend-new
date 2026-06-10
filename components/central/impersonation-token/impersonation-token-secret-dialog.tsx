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
import type { ImpersonationToken } from "@/types/central/impersonation-token"

interface ImpersonationTokenSecretDialogProps {
  token: ImpersonationToken | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImpersonationTokenSecretDialog({
  token,
  open,
  onOpenChange,
}: ImpersonationTokenSecretDialogProps) {
  const plainToken = token?.plain_token

  async function handleCopy() {
    if (!plainToken) {
      return
    }

    await navigator.clipboard.writeText(plainToken)
    toastApiMessage(null, "Impersonation token copied to clipboard.")
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Save impersonation token</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Copy this token now. You will not be able to see it again after
            closing this dialog.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="rounded-md border bg-muted/40 p-3">
          <p className="break-all font-mono text-sm">{plainToken ?? "—"}</p>
        </div>

        <ResponsiveDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
          <Button type="button" onClick={handleCopy} disabled={!plainToken}>
            Copy token
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
