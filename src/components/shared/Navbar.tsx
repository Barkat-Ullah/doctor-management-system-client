"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Bell,
  ShoppingCart,
  Phone,
  Calendar,
  FileText,
  Users,
  Settings,
  Activity,
  Stethoscope,
  UserCog,
  HeartPulse,
  LifeBuoy,
  UserCheck,
  Pill,
  CalendarClock,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/services/Auth";
import { useUser } from "@/context/UserContext";

import HeartbeatLogo from "./HeartBeat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleCart } from "@/redux/slices/cartSlice";
import CartDrawer from "../module/Cart/CartDrawer";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/doctors" },
    { name: "Medicine", href: "/medicine" },
    { name: "Health-Blog", href: "/health-blog" },
    { name: "Services", href: "/services" },
  ];

  const { user, setIsLoading } = useUser();

  const handleLogout = () => {
    logout();
    setIsLoading(true);
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  // Get dashboard routes based on user role - Same as DashboardLayout
  const getDashboardRoutes = (role: string) => {
    const rolePath = role.toLowerCase().replace("_", "-");
    // For SUPER_ADMIN, use 'super-admin', for others use the second part if there's a hyphen
    const routePrefix = `/dashboard/${
      rolePath.includes("-") ? rolePath.split("-")[1].toLowerCase() : rolePath
    }`;

    const routes = [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
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
          { name: "Settings", href: `${routePrefix}/settings`, icon: Settings },
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
            href: `${routePrefix}/prescriptions`,
            icon: FileText,
          },
        ];
      default:
        return routes;
    }
  };

  const dashboardRoutes = user ? getDashboardRoutes(user?.role) : [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-0.5">
            <Link href="/" className="flex items-center">
              <HeartbeatLogo />
              <span className="text-xl font-bold text-green-600">Nov</span>
              <span className="text-xl font-bold">ena</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Contact Button - Always visible */}
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </Link>

            {user ? (
              <>
                {/* Notification Icon */}
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                        3
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger> */}
                {/* <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-y-auto">
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <div>
                          <p className="font-medium">Appointment Confirmed</p>
                          <p className="text-sm text-gray-500">
                            Your appointment with Dr. Smith is confirmed for
                            tomorrow at 10:00 AM.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            2 hours ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <div>
                          <p className="font-medium">Prescription Ready</p>
                          <p className="text-sm text-gray-500">
                            Your prescription is ready for pickup at the
                            pharmacy.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Yesterday
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-3 cursor-pointer">
                        <div>
                          <p className="font-medium">Lab Results Available</p>
                          <p className="text-sm text-gray-500">
                            Your recent lab results are now available in your
                            patient portal.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            2 days ago
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent> */}
                {/* </DropdownMenu> */}

                {/* Cart Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-1 px-2 hover:bg-green-50"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.profilePhoto || ""}
                          alt={user.name}
                        />
                        <AvatarFallback className="bg-green-300 text-green-800">
                          {user.name}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">
                        {user.role.replace("_", " ")}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {dashboardRoutes.map((route) => (
                        <DropdownMenuItem key={route.href} asChild>
                          <Link
                            href={route.href}
                            className="flex items-center cursor-pointer"
                          >
                            <route.icon className="mr-2 h-4 w-4" />
                            <span>{route.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {user && (
              <>
                {/* Mobile Notification Icon */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* Mobile Cart Icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-500">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-2 pb-4 bg-white border-b">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-foreground/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Contact Link */}
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Us
              </Link>

              {user ? (
                <>
                  <div className="flex items-center py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={user.profilePhoto || ""}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {user.name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200 text-xs">
                        {user.role.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Dashboard Links based on role */}
                  {dashboardRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <route.icon className="mr-2 h-4 w-4" />
                        {route.name}
                      </Button>
                    </Link>
                  ))}

                  <Button
                    variant="destructive"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50 w-full"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-green-600 hover:bg-green-700 w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
