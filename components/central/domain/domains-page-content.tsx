"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Can } from "@/components/central/can"
import { DomainFormDialog } from "@/components/central/domain/domain-form-dialog"
import { DomainsDataTable } from "@/components/central/domain/domains-data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Permissions } from "@/lib/central/auth/permissions"
import type { Domain } from "@/types/central/domain"

export function DomainsPageContent() {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null)

  const openCreate = React.useCallback(() => {
    setEditingDomain(null)
    setDialogOpen(true)
  }, [])

  const openEdit = React.useCallback((domain: Domain) => {
    setEditingDomain(domain)
    setDialogOpen(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Domains"
        description="Manage tenant hostnames, verification status, and primary domain routing."
      >
        <Can permission={Permissions.tenants.create}>
          <Button onClick={openCreate}>
            <PlusIcon />
            Add domain
          </Button>
        </Can>
      </PageHeader>

      <DomainsDataTable onEdit={openEdit} />

      <DomainFormDialog
        domain={editingDomain}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
