import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/Auth";

type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

const authRoutes = ["/login", "/register"];

// Define which routes are accessible to which roles with nested route structure
const roleBasedPrivateRoutes = {
  SUPER_ADMIN: [
    /^\/dashboard$/,
    /^\/dashboard\/super-admin\/profile$/,
    /^\/dashboard\/super-admin\/users$/,
    /^\/dashboard\/super-admin\/doctors$/,
    /^\/dashboard\/super-admin\/settings$/,
    /^\/dashboard\/super-admin\/analytics$/,
  ],
  ADMIN: [
    /^\/dashboard$/,
    /^\/dashboard\/admin\/profile$/,
    /^\/dashboard\/admin\/profile\/[^\/]+$/,
    /^\/dashboard\/admin\/users$/,
    /^\/dashboard\/admin\/users\/[^/]+\/?$/,
    /^\/dashboard\/admin\/specialties$/,
    /^\/dashboard\/admin\/schedule$/,
    /^\/dashboard\/admin\/schedule\/all$/,
    /^\/dashboard\/admin\/schedule\/create$/,
    /^\/dashboard\/admin\/doctors$/,
    /^\/dashboard\/admin\/doctors\/[^/]+\/?$/,
    /^\/dashboard\/admin\/doctors\/create-doctor$/,
    /^\/dashboard\/admin\/doctors\/edit\/[^/]+\/?$/,
    /^\/dashboard\/admin\/patients$/,
    /^\/dashboard\/admin\/patients\/[^/]+\/?$/,
    /^\/dashboard\/admin\/patients\/[^/]+\/edit\/?$/,
    /^\/dashboard\/admin\/medicines$/,
    /^\/dashboard\/admin\/medicines\/[^/]+\/?$/,
    /^\/dashboard\/admin\/medicines\/create$/,
    /^\/dashboard\/admin\/medicines\/edit\/[^/]+\/?$/,
    /^\/dashboard\/admin\/medicine-orders$/,
    /^\/dashboard\/admin\/medicine-orders\/[^/]+\/?$/,
    /^\/dashboard\/admin\/medicine-stats$/,
    /^\/dashboard\/admin\/prescriptions$/,
    /^\/dashboard\/admin\/appointments$/,
    /^\/dashboard\/admin\/support$/,
    /^\/dashboard\/admin\/settings$/,
  ],
  DOCTOR: [
    /^\/dashboard$/,
    /^\/dashboard\/doctor\/profile$/,
    /^\/dashboard\/doctor\/profile\/edit\/[^/]+$/,
    /^\/dashboard\/doctor\/schedules$/,
    /^\/dashboard\/doctor\/available$/,
    /^\/dashboard\/doctor\/my-schedules$/,
    /^\/dashboard\/doctor\/appointments$/,
    /^\/dashboard\/doctor\/appointments\/[^/]+\/?$/,
    /^\/dashboard\/doctor\/video-call\/[^/]+\/?$/,
    /^\/dashboard\/doctor\/patients$/,
    /^\/dashboard\/doctor\/patients\/[^/]+\/?$/,
    /^\/dashboard\/doctor\/prescriptions$/,
    /^\/dashboard\/doctor\/prescriptions\/[^/]+\/?$/,
    /^\/dashboard\/admin\/settings$/,
  ],
  PATIENT: [
    /^\/dashboard$/,
    /^\/dashboard\/patient\/profile$/,
    /^\/dashboard\/patient\/profile\/edit\/[^/]+\/?$/,
    /^\/dashboard\/patient\/appointments$/,
    /^\/dashboard\/patient\/appointments\/[^/]+\/?$/,
    /^\/dashboard\/patient\/video-call\/[^/]+\/?$/,
    /^\/dashboard\/patient\/records$/,
    /^\/dashboard\/patient\/records\/[^/]+\/?$/,
    /^\/dashboard\/patient\/prescription$/,
    /^\/dashboard\/patient\/prescription\/[^/]+\/?$/,
    /^\/dashboard\/admin\/settings$/,
  ],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Get the current user
  const userInfo = await getCurrentUser();

  // Handle auth routes (login/register)
  if (authRoutes.includes(pathname)) {
    // If user is already logged in, redirect to dashboard
    if (userInfo) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Otherwise allow access to auth routes
    return NextResponse.next();
  }

  if (pathname.startsWith("/payment-success")) {
    return NextResponse.next();
  }

  // If not logged in and trying to access protected route, redirect to login
  if (!userInfo && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url)
    );
  }

  // For dashboard routes, check role-based access
  if (pathname.startsWith("/dashboard") && userInfo) {
    const role = userInfo.role as Role;

    // If role doesn't exist in our mapping (should never happen but just in case)
    if (!roleBasedPrivateRoutes[role]) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Basic routes that everyone can access
    if (pathname === "/dashboard" || pathname === "/dashboard/profile") {
      return NextResponse.next();
    }

    // For nested routes, check if the URL matches the user's role pattern
    // e.g., /dashboard/admin/* for ADMIN, /dashboard/doctor/* for DOCTOR, etc.
    const rolePath = role.toLowerCase().replace("_", "-");
    const rolePrefix = `/dashboard/${
      rolePath.includes("-") ? rolePath.split("-")[1].toLowerCase() : rolePath
    }/`;

    if (pathname.startsWith(rolePrefix)) {
      // Additionally check if this specific nested route is allowed for the role
      const allowedRoutes = roleBasedPrivateRoutes[role];
      if (allowedRoutes.some((route) => route.test(pathname))) {
        return NextResponse.next();
      }
    }

    // If trying to access another role's dashboard route, redirect to user's dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For any other routes, just proceed
  return NextResponse.next();
};

export const config = {
  matcher: ["/login", "/register", "/dashboard", "/dashboard/:path*"],
};
