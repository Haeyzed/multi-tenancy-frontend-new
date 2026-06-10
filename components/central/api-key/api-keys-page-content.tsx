"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { ApiKeyFormDialog } from "@/components/central/api-key/api-key-form-dialog"
import { ApiKeyMetricCards } from "@/components/central/api-key/api-key-metric-cards"
import { ApiKeySecretDialog } from "@/components/central/api-key/api-key-secret-dialog"
import { ApiKeysDataTable } from "@/components/central/api-key/api-keys-data-table"
import { Can } from "@/components/central/can"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { ApiKey } from "@/types/central/api-key"

export function ApiKeysPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [secretOpen, setSecretOpen] = React.useState(false)
  const [editingApiKey, setEditingApiKey] = React.useState<ApiKey | null>(null)
  const [createdApiKey, setCreatedApiKey] = React.useState<ApiKey | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingApiKey(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((apiKey: ApiKey) => {
    setEditingApiKey(apiKey)
    setDialogOpen(true)
  }, [])

  const handleCreated = React.useCallback((apiKey: ApiKey) => {
    setCreatedApiKey(apiKey)
    setSecretOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="API keys"
        description="Manage tenant programmatic access keys, expiration, and revocation."
      >
        <Can permission={Permissions.apiKeys.manage}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Create key
          </Button>
        </Can>
      </PageHeader>

      <ApiKeyMetricCards />
      <ApiKeysDataTable onEdit={openEdit} />

      <ApiKeyFormDialog
        apiKey={editingApiKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />

      <ApiKeySecretDialog
        apiKey={createdApiKey}
        open={secretOpen}
        onOpenChange={setSecretOpen}
      />
    </>
  )
}
