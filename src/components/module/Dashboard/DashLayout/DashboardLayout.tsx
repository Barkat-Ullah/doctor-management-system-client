"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Settings,
  Activity,
  Stethoscope,
  Calendar,
  FileText,
  Users,
  UserCog,
  HeartPulse,
  LifeBuoy,
  UserCheck,
  Pill,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/services/Auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setIsLoading } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsLoading(true);
  };

  // Get dashboard routes based on user role
  const getDashboardRoutes = (role: string) => {
    const rolePath = role.toLowerCase().replace("_", "-");
    // For SUPER_ADMIN, use 'super-admin', for others use the second part if there's a hyphen
    const routePrefix = `/dashboard/${
      rolePath.includes("-") ? rolePath.split("-")[1].toLowerCase() : rolePath
    }`;

    const routes = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      // { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    switch (role) {
      case "SUPER_ADMIN":
        return [
          ...routes,
          {
            name: "Profile",
            href: `${routePrefix}/profile`,
            icon: Users,
          },
          {
            name: "Users Management",
            href: `${routePrefix}/users`,
            icon: Users,
          },
          {
            name: "Doctors Management",
            href: `${routePrefix}/doctors`,
            icon: Stethoscope,
          },
          {
            name: "System Settings",
            href: `${routePrefix}/settings`,
            icon: Settings,
          },
          {
            name: "Analytics",
            href: `${routePrefix}/analytics`,
            icon: Activity,
          },
        ];
      case "ADMIN":
        return [
          ...routes,
          {
            name: "Profile",
            href: `${routePrefix}/profile`,
            icon: Users,
          },
          {
            name: "Users Management",
            href: `${routePrefix}/users`,
            icon: UserCog,
          },
          {
            name: "Specialties",
            href: `${routePrefix}/specialties`,
            icon: HeartPulse,
          },
          {
            name: "Schedule Management",
            href: `${routePrefix}/schedule`,
            icon: CalendarClock,
          },
          {
            name: "Doctors Management",
            href: `${routePrefix}/doctors`,
            icon: Stethoscope,
          },
          {
            name: "Patient Management",
            href: `${routePrefix}/patients`,
            icon: UserCheck,
          },
          {
            name: "Appointments",
            href: `${routePrefix}/appointments`,
            icon: Calendar,
          },
          {
            name: "Prescriptions",
            href: `${routePrefix}/prescriptions`,
            icon: FileText,
          },
          {
            name: "Medicine Management",
            href: `${routePrefix}/medicines`,
            icon: Pill,
          },
          {
            name: "Support System",
            href: `${routePrefix}/support`,
            icon: LifeBuoy,
          },
        ];
      case "DOCTOR":
        return [
          ...routes,
          {
            name: "Profile",
            href: `${routePrefix}/profile`,
            icon: Users,
          },
          {
            name: "Available Schedules",
            href: `${routePrefix}/available`,
            icon: Calendar,
          },
          {
            name: "My Schedules",
            href: `${routePrefix}/my-schedules`,
            icon: CalendarClock,
          },
          {
            name: "Appointments",
            href: `${routePrefix}/appointments`,
            icon: Calendar,
          },
          // { name: "Patients", href: `${routePrefix}/patients`, icon: Users },
          // {
          //   name: "Prescriptions",
          //   href: `${routePrefix}/prescriptions`,
          //   icon: FileText,
          // },
        ];
      case "PATIENT":
        return [
          ...routes,
          {
            name: "Profile",
            href: `${routePrefix}/profile`,
            icon: Users,
          },
          {
            name: "Appointments",
            href: `${routePrefix}/appointments`,
            icon: Calendar,
          },

          {
            name: "Prescriptions",
            href: `${routePrefix}/prescription`,
            icon: FileText,
          },
        ];
      default:
        return routes;
    }
  };

  const dashboardRoutes = user ? getDashboardRoutes(user.role) : [];

  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-64 bg-white border-r transition-all duration-300`}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-green-600">Nov</span>
            <span className="text-xl font-bold">ena</span>
          </Link>
        </div>

        <div className="px-4 py-5">
          <div className="flex items-center mb-6">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.profilePhoto || ""} alt={user.name} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          </div>

          <nav className="space-y-1">
            {dashboardRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <div
                  className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                    pathname === route.href
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <route.icon className="mr-3 h-5 w-5" />
                  {route.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 border-t px-4 py-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Header */}
        <header className="bg-white border-b h-16 flex items-center px-6 justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-4"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-xl font-semibold">
              {pathname === "/dashboard"
                ? "Dashboard"
                : dashboardRoutes.find((route) => route.href === pathname)
                    ?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
