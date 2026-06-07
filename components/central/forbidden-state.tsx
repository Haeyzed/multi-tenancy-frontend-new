import { ShieldXIcon } from "lucide-react"

interface ForbiddenStateProps {
  title?: string
  description?: string
}

export function ForbiddenState({
  title = "Access denied",
  description = "You do not have permission to view this page.",
}: ForbiddenStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <ShieldXIcon className="size-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
