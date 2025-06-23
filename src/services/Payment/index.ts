/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PaymentInitData {
  appointmentId: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    paymentUrl: string;
  };
}

export interface PaymentValidationData {
  tran_id: string;
  status: string;
  amount: string;
  [key: string]: any;
}

// Initialize payment with SSLCommerz
export const initializePayment = async (
  appointmentId: string
): Promise<PaymentResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/payment/init-payment/${appointmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to initialize payment");
    }

    return {
      success: true,
      message: result.message || "Payment initialized successfully",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return {
      success: false,
      message: error.message || "Failed to initialize payment",
    };
  }
};

// Validate payment (called by SSLCommerz IPN)
// Update the validatePayment function
// export const validatePayment = async (payload?: any) => {
//   try {
//     const response = await fetch(`${API_URL}/payment/ipn`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: (await cookies()).get("accessToken")?.value || "",
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Payment validation failed");
//     }

//     return {
//       success: true,
//       message: result.message || "Payment validated successfully",
//       data: result.data,
//     };
//   } catch (error: any) {
//     console.error("Payment validation error:", error);
//     return {
//       success: false,
//       message: error.message || "Payment validation failed",
//       data: null,
//     };
//   }
// };

export const validatePayment = async (payload: any) => {
  try {
    console.log("Sending payment validation request:", payload);

    const response = await fetch(`${API_URL}/payment/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Payment validation response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Payment validation failed");
    }

    return {
      success: result.success || true,
      message: result.message || "Payment validated successfully",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Payment validation error:", error);
    return {
      success: false,
      message: error.message || "Payment validation failed",
      data: null,
    };
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId: string) => {
  try {
    const response = await fetch(`${API_URL}/payment/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch payment");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Payment fetched successfully",
    };
  } catch (error: any) {
    console.error("Get payment error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch payment",
      data: null,
    };
  }
};

// Get all payments (admin only)
export const getAllPayments = async (params?: Record<string, any>) => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_URL}/payment?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch payments");
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Payments fetched successfully",
    };
  } catch (error: any) {
    console.error("Get payments error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch payments",
      data: [],
    };
  }
};
