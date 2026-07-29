import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Serves the admin panel off its own subdomain: requests to
// admin.<domain> are rewritten to /admin/* so the app/admin routes
// respond there, while the rest of the site keeps living at the
// root domain. Paths that don't exist under app/admin 404 normally,
// so the subdomain can't be used to browse the public site.
const ADMIN_HOST_PREFIX = "admin.";

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];

  if (!hostname.startsWith(ADMIN_HOST_PREFIX)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/admin${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
