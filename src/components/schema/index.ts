import { z } from "zod";

// Define the form validation schema
export const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  contactNumber: z
    .string()
    .min(1, { message: "Contract number is required" })
    .optional(),
  address: z.string().min(1, { message: "Address is required" }).optional(),
});

// Define the form validation schema
export const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Define the schema for admin profile update
export const adminProfileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contactNumber: z.string().min(5, {
    message: "Contact number must be at least 5 characters.",
  }),
  profilePhoto: z.string().optional().nullable(),
});
