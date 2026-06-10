"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { ImpersonationTokenFormDialog } from "@/components/central/impersonation-token/impersonation-token-form-dialog"
import { ImpersonationTokenSecretDialog } from "@/components/central/impersonation-token/impersonation-token-secret-dialog"
import { ImpersonationTokensDataTable } from "@/components/central/impersonation-token/impersonation-tokens-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { ImpersonationToken } from "@/types/central/impersonation-token"

export function ImpersonationTokensPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [secretOpen, setSecretOpen] = React.useState(false)
  const [createdToken, setCreatedToken] = React.useState<ImpersonationToken | null>(
    null,
  )

  const handleCreated = React.useCallback((token: ImpersonationToken) => {
    setCreatedToken(token)
    setSecretOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Impersonation tokens"
        description="Issue and manage one-time tokens for secure tenant impersonation."
      >
        <Can permission={Permissions.impersonation.use}>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusIcon />
            Issue token
          </Button>
        </Can>
      </PageHeader>

      <ImpersonationTokensDataTable />

      <ImpersonationTokenFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />

      <ImpersonationTokenSecretDialog
        token={createdToken}
        open={secretOpen}
        onOpenChange={setSecretOpen}
      />
    </>
  )
}
