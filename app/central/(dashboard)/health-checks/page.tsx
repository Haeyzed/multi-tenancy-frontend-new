import { HealthCheckMetricCards } from "@/components/central/health-check/health-check-metric-cards"
import { HealthChecksDataTable } from "@/components/central/health-check/health-checks-data-table"
import { PageHeader } from "@/components/layout/page-header"

export default function HealthChecksPage() {
  return (
    <>
      <PageHeader
        title="Health checks"
        description="Review tenant infrastructure probe results, response times, and failure status."
      />
      <HealthCheckMetricCards />
      <HealthChecksDataTable />
    </>
  )
}
