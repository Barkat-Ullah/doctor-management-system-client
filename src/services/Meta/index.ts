/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface DashboardMetaData {
  appointmentCount?: number;
  patientCount?: number;
  doctorCount?: number;
  adminCount?: number;
  paymentCount?: number;
  prescriptionCount?: number;
  reviewCount?: number;
  totalRevenue?: {
    _sum: {
      amount: number | null;
    };
  };
  barChartData?: Array<{
    month: string;
    count: number;
  }>;
  pieCharData?: Array<{
    status: string;
    count: number;
  }>;
  formattedAppointmentStatusDistribution?: Array<{
    status: string;
    count: number;
  }>;
}

// Fetch dashboard meta data based on user role
export const fetchDashboardMetaData = async (): Promise<{
  success: boolean;
  data?: DashboardMetaData;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/meta`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: { tags: ["dashboard-meta"] },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch dashboard meta data");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch dashboard meta data",
    };
  }
};
