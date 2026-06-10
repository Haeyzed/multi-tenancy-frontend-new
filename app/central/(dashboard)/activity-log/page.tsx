import { ActivityLogDataTable } from "@/components/central/activity-log/activity-log-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function ActivityLogPage() {
  return (
    <>
      <PageHeader
        title="Activity log"
        description="Review platform audit events, model changes, and administrative actions."
      />
      <ActivityLogDataTable />
    </>
  )
}
