import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { resolveHostContext } from "@/lib/tenant/domain/resolve-host"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""
  const context = resolveHostContext(host)
  const { pathname } = request.nextUrl

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-app-mode", context.mode)

  if (context.slug) {
    requestHeaders.set("x-tenant-slug", context.slug)
  }

  if (context.mode === "tenant") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    if (
      pathname.startsWith("/central") ||
      pathname.startsWith("/onboard") ||
      pathname.startsWith("/self-onboarding")
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  if (context.mode === "central" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/central/login", request.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
