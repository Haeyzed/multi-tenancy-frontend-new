import { type SVGProps } from "react"

export function IconThemeSystem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" fill="currentColor" className="text-muted" />
      <rect x="8" y="8" width="32" height="40" rx="4" className="fill-background" />
      <rect x="44" y="8" width="36" height="8" rx="2" className="fill-background" />
      <rect x="44" y="20" width="36" height="28" rx="2" className="fill-background" />
      <rect x="0" y="0" width="44" height="56" rx="6" className="fill-foreground/10" />
      <rect x="44" y="0" width="44" height="56" rx="6" className="fill-foreground/70" />
    </svg>
  )
}

export function IconThemeLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="8" y="8" width="20" height="40" rx="3" className="fill-background" />
      <rect x="32" y="8" width="48" height="8" rx="2" className="fill-background" />
      <rect x="32" y="20" width="48" height="28" rx="2" className="fill-background" />
    </svg>
  )
}

export function IconThemeDark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-foreground/80" />
      <rect x="8" y="8" width="20" height="40" rx="3" className="fill-foreground/30" />
      <rect x="32" y="8" width="48" height="8" rx="2" className="fill-foreground/30" />
      <rect x="32" y="20" width="48" height="28" rx="2" className="fill-foreground/30" />
    </svg>
  )
}

export function IconSidebarInset(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="6" y="6" width="24" height="44" rx="4" className="fill-background" />
      <rect x="34" y="6" width="48" height="44" rx="4" className="fill-background shadow-sm" />
    </svg>
  )
}

export function IconSidebarFloating(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="6" y="10" width="22" height="36" rx="4" className="fill-background shadow-sm" />
      <rect x="32" y="6" width="50" height="44" rx="4" className="fill-background" />
    </svg>
  )
}

export function IconSidebarSidebar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="0" y="0" width="26" height="56" rx="6" className="fill-background" />
      <rect x="32" y="8" width="48" height="8" rx="2" className="fill-background" />
      <rect x="32" y="20" width="48" height="28" rx="2" className="fill-background" />
    </svg>
  )
}

export function IconLayoutDefault(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="6" y="6" width="22" height="44" rx="3" className="fill-background" />
      <rect x="32" y="6" width="50" height="8" rx="2" className="fill-background" />
      <rect x="32" y="18" width="50" height="32" rx="2" className="fill-background" />
    </svg>
  )
}

export function IconLayoutCompact(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="6" y="6" width="10" height="44" rx="3" className="fill-background" />
      <rect x="20" y="6" width="62" height="8" rx="2" className="fill-background" />
      <rect x="20" y="18" width="62" height="32" rx="2" className="fill-background" />
    </svg>
  )
}

export function IconLayoutFull(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 88 56" fill="none" aria-hidden="true" {...props}>
      <rect width="88" height="56" rx="6" className="fill-muted" />
      <rect x="6" y="6" width="76" height="8" rx="2" className="fill-background" />
      <rect x="6" y="18" width="76" height="32" rx="2" className="fill-background" />
    </svg>
  )
}
