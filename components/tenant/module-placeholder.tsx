import { PageHeader } from "@/components/layout/page-header"

export function TenantModulePlaceholder({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        This module will be wired to the tenant API next.
      </div>
    </>
  )
}
