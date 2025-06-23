"use client";

import DashboardLayout from "@/components/module/Dashboard/DashLayout/DashboardLayout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
