import { AuthShell } from "@/components/central/auth/auth-shell"

export default function CentralAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthShell>{children}</AuthShell>
}
