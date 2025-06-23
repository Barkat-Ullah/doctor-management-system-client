"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type { PatientQueryParams, UpdatePatientData } from "@/types/patient";

export const getAllPatients = async (params: PatientQueryParams = {}) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    // Trim search term to remove extra spaces
    if (params.searchTerm) {
      const trimmedSearchTerm = params.searchTerm.trim();
      if (trimmedSearchTerm) {
        queryParams.append("searchTerm", trimmedSearchTerm);
      }
    }

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    // Use 'sort' instead of 'sortBy' and 'sortOrder' to match backend
    if (params.sortBy && params.sortOrder) {
      const sortValue =
        params.sortOrder === "desc" ? `-${params.sortBy}` : params.sortBy;
      queryParams.append("sort", sortValue);
    } else if (params.sortBy) {
      queryParams.append("sort", params.sortBy);
    }

    const queryString = queryParams.toString();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/patient${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching patients from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["PATIENTS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 0 } };
    }

    const result = await res.json();
    console.log("Fetched patients result:", result);

    return {
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPage: 0 },
    };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPage: 0 } };
  }
};

export const getSinglePatient = async (id: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/patient/${id}`;
    console.log("Fetching single patient from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["PATIENTS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return null;
    }

    const result = await res.json();
    console.log("Fetched single patient result:", result);

    return result.data || result || null;
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};

export const getMyPatientProfile = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/patient/patient-profile`;
    console.log("Fetching patient profile from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["PATIENT_PROFILE"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return null;
    }

    const result = await res.json();
    console.log("Fetched patient profile result:", result);

    return result.data || result || null;
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return null;
  }
};

export const updatePatient = async (id: string, data: UpdatePatientData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/${id}`,
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
      throw new Error(`Failed to update patient: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the patients cache
    revalidateTag("PATIENTS");
    revalidateTag("PATIENT_PROFILE");

    return {
      success: true,
      data: result.data || result,
      message: "Patient updated successfully",
    };
  } catch (error) {
    console.error("Error updating patient:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update patient",
    };
  }
};

export const deletePatient = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/${id}`,
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
      throw new Error(`Failed to delete patient: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the patients cache
    revalidateTag("PATIENTS");

    return {
      success: true,
      data: result.data || result,
      message: "Patient deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting patient:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete patient",
    };
  }
};

export const softDeletePatient = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/soft/${id}`,
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
      throw new Error(`Failed to soft delete patient: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the patients cache
    revalidateTag("PATIENTS");

    return {
      success: true,
      data: result.data || result,
      message: "Patient soft deleted successfully",
    };
  } catch (error) {
    console.error("Error soft deleting patient:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to soft delete patient",
    };
  }
};

// Add medical report/attachment to patient
export const updatePatientAttachment = async (
  patientId: string,
  formData: FormData
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/patient/${patientId}/medical-report`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to upload medical report",
        data: null,
      };
    }

    // Revalidate the patients cache
    revalidateTag("PATIENTS");
    revalidateTag("PATIENT_PROFILE");

    return {
      success: true,
      message: data.message || "Medical report uploaded successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error uploading medical report:", error);
    return {
      success: false,
      message: "Network error occurred",
      data: null,
    };
  }
};

export const updateMyProfileWithImage = async (
  data: UpdatePatientData,
  imageFile?: File
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // Create FormData for file upload support
    const formData = new FormData();

    // Add image file if provided
    if (imageFile) {
      formData.append("profile", imageFile);
    }

    // Wrap the data under "data" key as expected by backend
    const dataToSend = {
      name: data.name,
      contactNumber: data.contactNumber,
      address: data.address,
      age: data.age,
    };

    // Remove undefined values
    Object.keys(dataToSend).forEach((key) => {
      if (dataToSend[key as keyof typeof dataToSend] === undefined) {
        delete dataToSend[key as keyof typeof dataToSend];
      }
    });

    // Add the data object as a JSON string
    formData.append("data", JSON.stringify(dataToSend));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-my-profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: accessToken || "",
        },
        body: formData,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to update profile: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the cache
    revalidateTag("PATIENTS");
    revalidateTag("PATIENT_PROFILE");

    return {
      success: true,
      data: result.data || result,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};
