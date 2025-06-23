/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateReviewData {
  appointmentId: string;
  rating: number;
  comment: string;
}

export interface ReviewQueryParams {
  patientEmail?: string;
  doctorEmail?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  appointment: {
    id: string;
    status: string;
    createdAt: string;
  };
}

// Create new review
export const createReview = async (data: CreateReviewData) => {
  try {
    const response = await fetch(`${API_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create review");
    }

    // Revalidate related data
    revalidateTag("reviews");
    revalidateTag("doctors");

    return {
      success: true,
      message: result.message || "Review created successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create review",
      data: null,
    };
  }
};

// Get all reviews with filters
export const getAllReview = async (params: ReviewQueryParams = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_URL}/review?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        next: { tags: ["reviews"] },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch reviews");
    }

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { total: 0, page: 1, limit: 10 },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch reviews",
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
};
