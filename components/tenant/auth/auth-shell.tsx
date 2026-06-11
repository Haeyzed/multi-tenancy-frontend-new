import Link from "next/link"
import { GalleryVerticalEndIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function TenantAuthShell({
  children,
  companyName,
  logoUrl,
  contentClassName,
}: {
  children: React.ReactNode
  companyName: string
  logoUrl?: string | null
  contentClassName?: string
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/admin/login" className="flex items-center gap-2 font-medium">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={companyName}
                className="size-8 rounded-md object-cover"
              />
            ) : (
              <div className="app-brand-mark flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
            )}
            {companyName}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={cn("w-full max-w-sm", contentClassName)}>{children}</div>
        </div>
      </div>
      <div className="app-gradient-auth-panel relative hidden overflow-hidden lg:block">
        <div className="app-glow absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-10 text-primary-foreground">
          <div className="max-w-md space-y-4">
            <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
              Store administration
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Manage {companyName} from one place
            </h2>
            <p className="text-primary-foreground/85">
              Products, orders, inventory, and staff — configured for your store.
            </p>
          </div>
          <p className="text-sm text-primary-foreground/70">
            Secure · Multi-store · Tenant isolated
          </p>
        </div>
      </div>
    </div>
  )
}
