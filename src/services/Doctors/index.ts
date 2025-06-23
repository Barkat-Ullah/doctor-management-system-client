"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type {
  DoctorQueryParams,
  CreateSpecialtyData,
  UpdateDoctorData,
} from "@/types/doctor.type";

export const getAllDoctors = async (params: DoctorQueryParams = {}) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.doctorSpecialties)
      queryParams.append("doctorSpecialties", params.doctorSpecialties);
    if (params.gender) queryParams.append("gender", params.gender);
    if (params.experience) queryParams.append("experience", params.experience);

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/doctor${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["DOCTORS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 0 } };
    }

    const result = await res.json();
    return {
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPage: 0 },
    };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 0 } };
  }
};

export const getSingleDoctorById = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["DOCTORS"],
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
    console.error("Error fetching doctor:", error);
    return null;
  }
};

export const createDoctor = async (formData: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create-doctor`,
      {
        method: "POST",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to create doctor: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the doctors cache
    revalidateTag("DOCTORS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Doctor created successfully",
    };
  } catch (error) {
    console.error("Error creating doctor:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create doctor",
    };
  }
};

export const updateDoctor = async (id: string, data: UpdateDoctorData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to update doctor: ${errorText}`);
    }

    const result = await res.json();
    console.log(result);

    // Revalidate the doctors cache
    revalidateTag("DOCTORS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Doctor updated successfully",
    };
  } catch (error) {
    console.error("Error updating doctor:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update doctor",
    };
  }
};

export const deleteDoctor = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to delete doctor: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the doctors cache
    revalidateTag("DOCTORS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Doctor deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete doctor",
    };
  }
};

export const softDeleteDoctor = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctor/soft/${id}`,
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
      throw new Error(`Failed to soft delete doctor: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the doctors cache
    revalidateTag("DOCTORS");

    return {
      success: true,
      data: result.data,
      message: result.message || "Doctor soft deleted successfully",
    };
  } catch (error) {
    console.error("Error soft deleting doctor:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to soft delete doctor",
    };
  }
};

export const getAllSpecialties = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["SPECIALTIES"],
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch specialties");
      return [];
    }

    const result = await res.json();

    return result.data || [];
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return [];
  }
};

export const createSpecialty = async (
  data: CreateSpecialtyData,
  iconFile?: File
) => {
  try {
    // Create FormData for file upload and data
    const formData = new FormData();

    // Add icon file if provided
    if (iconFile) {
      formData.append("icon", iconFile);
    }

    // Add the data as JSON string (as expected by parseBody middleware)
    formData.append("data", JSON.stringify(data));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties`, {
      method: "POST",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to create specialty: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the specialties cache
    revalidateTag("SPECIALTIES");

    return {
      success: true,
      data: result.data,
      message: result.message || "Specialty created successfully",
    };
  } catch (error) {
    console.error("Error creating specialty:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create specialty",
    };
  }
};

export const deleteSpecialty = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/specialties/${id}`,
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
      throw new Error(`Failed to delete specialty: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the specialties cache
    revalidateTag("SPECIALTIES");

    return {
      success: true,
      data: result.data,
      message: result.message || "Specialty deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting specialty:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete specialty",
    };
  }
};

// Admin view with all actions
// <DoctorDetails doctor={doctor} userRole="admin" showActions={true} />

// Patient view with limited actions
// <DoctorDetails doctor={doctor} userRole="patient" showActions={false} />

// Doctor's own profile view
// <DoctorDetails doctor={doctor} userRole="doctor" showActions={true} />
