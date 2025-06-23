/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateAppointmentData {
  doctorId: string;
  scheduleId: string;
}

export interface AppointmentQueryParams {
  status?: string;
  paymentStatus?: string;
  patientEmail?: string;
  doctorEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId: string;
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    appointmentFee: number;
    qualification: string;
    designation: string;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
  payment?: {
    id: string;
    amount: number;
    transactionId: string;
    status: "PAID" | "UNPAID";
  };
}

// Create new appointment
export const createAppointment = async (data: CreateAppointmentData) => {
  try {
    const response = await fetch(`${API_URL}/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create appointment");
    }

    return {
      success: true,
      message: result.message || "Appointment created successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create appointment",
      data: null,
    };
  }
};

// Get patient's appointments for a specific doctor
export const getPatientAppointmentsForDoctor = async (doctorId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/appointment/my-appointments?doctorId=${doctorId}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch appointments");
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch appointments",
      data: [],
    };
  }
};

// Get all appointments (admin)
export const getAllAppointments = async (
  params: AppointmentQueryParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/appointment?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch appointments");
    }

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch appointments",
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
};

// Get my appointments (patient/doctor)
export const getMyAppointments = async (
  params: AppointmentQueryParams = {}
) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/appointment/my-appointments?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch my appointments");
    }

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch my appointments",
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
};

// Change appointment status
export const changeAppointmentStatus = async (
  appointmentId: string,
  status: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/appointment/status/${appointmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to change appointment status");
    }

    return {
      success: true,
      message: result.message || "Appointment status changed successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to change appointment status",
      data: null,
    };
  }
};

// Get appointment by ID
export const getAppointmentById = async (appointmentId: string) => {
  try {
    const response = await fetch(`${API_URL}/appointment/${appointmentId}`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch appointment");
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch appointment",
      data: null,
    };
  }
};
