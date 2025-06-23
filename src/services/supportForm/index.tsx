"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type {
  SupportQueryParams,
  CreateSupportRequestData,
  UpdateSupportRequestData,
} from "@/types/support";

export const createSupport = async (data: CreateSupportRequestData) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/support-request`;
    console.log("Creating support request at:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to create support request: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the support requests cache
    revalidateTag("SUPPORT_REQUESTS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Support request created successfully",
    };
  } catch (error) {
    console.error("Error creating support request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create support request",
    };
  }
};

export const getSupport = async (params: SupportQueryParams = {}) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.patientName)
      queryParams.append("patientName", params.patientName);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/support-request${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["SUPPORT_REQUESTS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return { data: [], meta: { page: 1, limit: 10, total: 0 } };
    }

    const result = await res.json();
    return {
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0 },
    };
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0 } };
  }
};

export const getSupportById = async (id: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/support-request/${id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["SUPPORT_REQUESTS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return null;
    }

    const result = await res.json();

    return result.data || null;
  } catch (error) {
    console.error("Error fetching support request:", error);
    return null;
  }
};

export const updateSupport = async (
  id: string,
  data: UpdateSupportRequestData
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/support-request/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to update support request: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the support requests cache
    revalidateTag("SUPPORT_REQUESTS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Support request updated successfully",
    };
  } catch (error) {
    console.error("Error updating support request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update support request",
    };
  }
};

export const deleteSupport = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/support-request/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to delete support request: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the support requests cache
    revalidateTag("SUPPORT_REQUESTS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Support request deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting support request:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete support request",
    };
  }
};
