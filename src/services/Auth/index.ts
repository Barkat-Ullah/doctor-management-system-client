/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

// export const registerUser = async (formData: FormData) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`,
//       {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       }
//     );
//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }

//     const result = await res.json();
//     if (result.success) {
//       (await cookies()).set("accessToken", result?.data?.accessToken);
//       (await cookies()).set("refreshToken", result?.data?.refreshToken);
//     }
//     return result;
//   } catch (error: any) {
//     return Error(error);
//   }
// };

export const loginUser = async (loginData: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const result = await res.json();
    console.log("result", result);

    if (result.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }
    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getMyProfile = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["USERS"],
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const result = await res.json();

    return result.data;
  } catch (error: any) {
    return Error(error);
  }
};
export const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`, {
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
        "Content-Type": "application/json",
      },
      next: {
        tags: ["USERS"],
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const result = await res.json();

    return result.data;
  } catch (error: any) {
    return Error(error);
  }
};
export const updateMyProfile = async (data: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/update-my-profile`,
      {
        method: "PATCH",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: data,
      }
    );

    // Check if response is ok before parsing JSON
    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return { success: false, message: `Server error: ${res.status}` };
    }
    revalidateTag("USERS");
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, message: error.message };
  }
};

export const getAllUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")?.value || "",
      },

      next: {
        tags: ["USERS"],
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return [];
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: (await cookies()).get("accessToken")?.value || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { status } }),
      }
    );
    console.log(res);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to update status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// export const deleteUser = async (userId: string) => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: (await cookies()).get("accessToken")?.value || "",
//         },
//       }
//     );

//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error("API Error Response:", errorText);
//       throw new Error(`Failed to delete user: ${res.status}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     throw error;
//   }
// };

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: `Failed to send reset email: ${res.status}`,
      };
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return { success: false, message: error.message };
  }
};

// Reset Password - Reset with token
export const resetPassword = async (
  token: string,
  userId: string,
  newPassword: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          id: userId,
          password: newPassword,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: `Failed to reset password: ${res.status}`,
      };
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Reset password error:", error);
    return { success: false, message: error.message };
  }
};

// Change Password - For logged in users
export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("accessToken")?.value || "",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      return {
        success: false,
        message: `Failed to change password: ${res.status}`,
      };
    }

    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("Change password error:", error);
    return { success: false, message: error.message };
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  let decodedData = null;
  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};
export const logout = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};
