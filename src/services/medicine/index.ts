/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import type {
  MedicineQueryParams,
  CreateMedicineData,
  UpdateMedicineData,
  UpdateStockData,
  MedicineResponse,
  SingleMedicineResponse,
} from "@/types/medicine";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createMedicine = async (
  data: CreateMedicineData
): Promise<SingleMedicineResponse> => {
  try {
    const url = `${API_URL}/medicine`;
    console.log("Creating medicine at:", url);

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
      throw new Error(`Failed to create medicine: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the medicines cache
    revalidateTag("MEDICINES");

    return {
      success: true,
      message: result.message || "Medicine created successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating medicine:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create medicine",
      data: {} as any,
    };
  }
};

export const getAllMedicine = async (
  params: MedicineQueryParams = {}
): Promise<MedicineResponse> => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.category) queryParams.append("category", params.category);
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.manufacturer)
      queryParams.append("manufacturer", params.manufacturer);
    if (params.dosageForm) queryParams.append("dosageForm", params.dosageForm);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = `${API_URL}/medicine${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["MEDICINES"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: "Failed to fetch medicines",
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Medicines fetched successfully",
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return {
      success: false,
      message: "Failed to fetch medicines",
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  }
};

export const getMedicineById = async (
  id: string
): Promise<SingleMedicineResponse> => {
  try {
    const url = `${API_URL}/medicine/${id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      next: {
        tags: ["MEDICINES"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: "Failed to fetch medicine",
        data: {} as any,
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Medicine fetched successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return {
      success: false,
      message: "Failed to fetch medicine",
      data: {} as any,
    };
  }
};

export const updateMedicine = async (
  id: string,
  data: UpdateMedicineData
): Promise<SingleMedicineResponse> => {
  try {
    const res = await fetch(`${API_URL}/medicine/${id}`, {
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
      throw new Error(`Failed to update medicine: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the medicines cache
    revalidateTag("MEDICINES");

    return {
      success: true,
      message: result.message || "Medicine updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating medicine:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update medicine",
      data: {} as any,
    };
  }
};

export const deleteMedicine = async (
  id: string
): Promise<SingleMedicineResponse> => {
  try {
    const res = await fetch(`${API_URL}/medicine/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to delete medicine: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the medicines cache
    revalidateTag("MEDICINES");

    return {
      success: true,
      message: result.message || "Medicine deleted successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete medicine",
      data: {} as any,
    };
  }
};

export const updateMedicineStock = async (
  id: string,
  data: UpdateStockData
): Promise<SingleMedicineResponse> => {
  try {
    const res = await fetch(`${API_URL}/medicine/${id}/stock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          (await cookies()).get("accessToken")?.value || ""
        }`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to update medicine stock: ${errorText}`);
    }

    const result = await res.json();

    // Revalidate the medicines cache
    revalidateTag("MEDICINES");

    return {
      success: true,
      message: result.message || "Medicine stock updated successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating medicine stock:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update medicine stock",
      data: {} as any,
    };
  }
};

export const getMedicineStats = async () => {
  try {
    const url = `${API_URL}/medicine/stats`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          (await cookies()).get("accessToken")?.value || ""
        }`,
      },
      next: {
        tags: ["MEDICINE_STATS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: "Failed to fetch medicine statistics",
        data: {
          totalMedicines: 0,
          lowStockMedicines: 0,
          outOfStockMedicines: 0,
          totalStockValue: 0,
          categoriesCount: [],
        },
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Medicine statistics fetched successfully",
      data: result.data || {
        totalMedicines: 0,
        lowStockMedicines: 0,
        outOfStockMedicines: 0,
        totalStockValue: 0,
        categoriesCount: [],
      },
    };
  } catch (error) {
    console.error("Error fetching medicine statistics:", error);
    return {
      success: false,
      message: "Failed to fetch medicine statistics",
      data: {
        totalMedicines: 0,
        lowStockMedicines: 0,
        outOfStockMedicines: 0,
        totalStockValue: 0,
        categoriesCount: [],
      },
    };
  }
};

export const getLowStockMedicines = async (threshold = 10) => {
  try {
    const url = `${API_URL}/medicine/low-stock?threshold=${threshold}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          (await cookies()).get("accessToken")?.value || ""
        }`,
      },
      next: {
        tags: ["LOW_STOCK_MEDICINES"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: "Failed to fetch low stock medicines",
        data: [],
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: "Low stock medicines fetched successfully",
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching low stock medicines:", error);
    return {
      success: false,
      message: "Failed to fetch low stock medicines",
      data: [],
    };
  }
};

export const getMedicinesByCategory = async (category: string) => {
  try {
    const url = `${API_URL}/medicine/category/${category}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${
          (await cookies()).get("accessToken")?.value || ""
        }`,
      },
      next: {
        tags: [`MEDICINES_CATEGORY_${category}`],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: `Failed to fetch medicines in category ${category}`,
        data: [],
      };
    }

    const result = await res.json();
    return {
      success: true,
      message: `Medicines in category ${category} fetched successfully`,
      data: result.data || [],
    };
  } catch (error) {
    console.error(`Error fetching medicines in category ${category}:`, error);
    return {
      success: false,
      message: `Failed to fetch medicines in category ${category}`,
      data: [],
    };
  }
};
