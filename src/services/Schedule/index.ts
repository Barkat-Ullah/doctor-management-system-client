/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createSchedule = async (scheduleData: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(scheduleData),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("schedules");
    }

    return result;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

// ADMIN will use DoctorSchedule endpoint to view all schedules
export const getAllSchedule = async (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/schedule?${searchParams.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["schedules"] },
      }
    );

    const result = await response.json();
    console.log("Schedule API Response:", result);
    return result;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

// For doctors to get available schedules (not assigned to any doctor)
export const getAvailableSchedules = async (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/schedule?${searchParams.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["available-schedules"] },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching available schedules:", error);
    throw error;
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/schedule/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("schedules");
    }

    return result;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

//doctor schedule

export const assignSchedulesToDoctor = async (scheduleIds: string[]) => {
  try {
    const response = await fetch(`${API_URL}/doctor-schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify({ scheduleIds }),
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("doctor-schedules");
      revalidateTag("schedules");
    }

    return result;
  } catch (error) {
    console.error("Error assigning schedules:", error);
    throw error;
  }
};

// Updated getMySchedules to fetch schedule details separately
export const getMySchedules = async (params?: {
  startDate?: string;
  endDate?: string;
  isBooked?: boolean;
  page?: number;
  limit?: number;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);
    if (params?.isBooked !== undefined)
      searchParams.append("isBooked", params.isBooked.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/doctor-schedule/my-schedule?${searchParams.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["doctor-schedules"] },
      }
    );

    const result = await response.json();

    // If successful, fetch schedule details for each schedule
    if (result.success && result.data?.data) {
      const schedulesWithDetails = await Promise.all(
        result.data.data.map(async (doctorSchedule: any) => {
          try {
            const scheduleDetails = await getScheduleById(
              doctorSchedule.scheduleId
            );
            return {
              ...doctorSchedule,
              schedule: scheduleDetails.success ? scheduleDetails.data : null,
            };
          } catch (error) {
            console.error(
              `Error fetching schedule ${doctorSchedule.scheduleId}:`,
              error
            );
            return {
              ...doctorSchedule,
              schedule: null,
            };
          }
        })
      );

      return {
        ...result,
        data: {
          ...result.data,
          data: schedulesWithDetails,
        },
      };
    }

    return result;
  } catch (error) {
    console.error("Error fetching my schedules:", error);
    throw error;
  }
};

export const getAllDoctorSchedules = async (params?: {
  searchTerm?: string;
  isBooked?: boolean;
  doctorId?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.searchTerm)
      searchParams.append("searchTerm", params.searchTerm);
    if (params?.isBooked !== undefined)
      searchParams.append("isBooked", params.isBooked.toString());
    if (params?.doctorId) searchParams.append("doctorId", params.doctorId);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${API_URL}/doctor-schedule?${searchParams.toString()}`,
      {
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["doctor-schedules"] },
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    throw error;
  }
};

export const removeDoctorSchedule = async (scheduleId: string) => {
  try {
    const response = await fetch(`${API_URL}/doctor-schedule/${scheduleId}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    const result = await response.json();

    if (result.success) {
      revalidateTag("doctor-schedules");
      revalidateTag("schedules");
    }

    return result;
  } catch (error) {
    console.error("Error removing schedule:", error);
    throw error;
  }
};
