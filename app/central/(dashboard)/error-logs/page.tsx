import { ErrorLogMetricCards } from "@/components/central/error-log/error-log-metric-cards"
import { ErrorLogsDataTable } from "@/components/central/error-log/error-logs-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function ErrorLogsPage() {
  return (
    <>
      <PageHeader
        title="Error logs"
        description="Investigate platform and tenant errors, filter by severity, and resolve incidents."
      />
      <ErrorLogMetricCards />
      <ErrorLogsDataTable />
    </>
  )
}
