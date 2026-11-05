import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

/**
 * Session refresher & network boundary proxy handler.
 * Implements dual-cookie synchronization across request and response headers.
 */
export async function updateSession(
  request: NextRequest,
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // 1. Dual-Cookie Sync: Synchronize to request cookies (for downstream Server Components)
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );

        // 2. Refresh response object with updated request
        supabaseResponse = NextResponse.next({
          request,
        });

        // 3. Dual-Cookie Sync: Synchronize to response cookies (for client browser Set-Cookie headers)
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: MUST call getUser() instead of getSession() for server-verified authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Protected routes check: /dashboard, /tasks, and /analytics
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/analytics");

  // Auth routes check: /login
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Rule 1: Redirect unauthenticated user from protected route to /login?next=<path>
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  // Rule 2: Redirect authenticated user from auth routes to intended route or /dashboard
  if (user && isAuthRoute) {
    const nextDestination = request.nextUrl.searchParams.get("next");
    const targetPath =
      nextDestination && nextDestination.startsWith("/")
        ? nextDestination
        : "/dashboard";

    const redirectUrl = new URL(targetPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
