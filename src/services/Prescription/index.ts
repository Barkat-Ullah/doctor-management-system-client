/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreatePrescriptionData {
  appointmentId: string;
  instructions: string;
  followUpDate?: string;
}

export interface PrescriptionQueryParams {
  patientEmail?: string;
  doctorEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    designation: string;
    qualification: string;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  appointment: {
    id: string;
    appointmentDateTime: string;
    status: string;
  };
}

// Create new prescription (Doctor only)
export const createPrescription = async (data: CreatePrescriptionData) => {
  try {
    const response = await fetch(`${API_URL}/prescription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create prescription");
    }

    // Revalidate related data
    revalidateTag("prescriptions");
    revalidateTag("appointments");

    return {
      success: true,
      message: result.message || "Prescription created successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create prescription",
      data: null,
    };
  }
};

// Get patient's prescriptions (Patient only)
export const getMyPrescriptions = async (
  params: PrescriptionQueryParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/prescription/my-prescription?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["prescriptions"] },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch prescriptions");
    }

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { total: 0, page: 1, limit: 10 },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch prescriptions",
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
};

// Get all prescriptions (Admin only)
export const getAllPrescriptions = async (
  params: PrescriptionQueryParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/prescription?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["prescriptions"] },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch prescriptions");
    }

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { total: 0, page: 1, limit: 10 },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch prescriptions",
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
};
