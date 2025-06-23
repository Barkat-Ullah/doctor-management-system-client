"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import {
  PlusCircle,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import registerImg from "@/assets/register.jpg";
import { registerFormSchema } from "@/components/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function Register() {
  const router = useRouter();
  const { isLoading, setIsLoading, updateUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const onSubmit = async (userData: RegisterFormValues) => {
    try {
      setIsLoading(true);

      // Create FormData object to handle file upload
      const formData = new FormData();

      // Create the patient data structure as expected by your API
      const patientData = {
        email: userData.email,
        name: userData.name,
        contactNumber: userData.contactNumber,
        address: userData.address,
      };

      const payload = {
        password: userData.password,
        patient: patientData,
      };

      // Add the JSON data to the FormData with the key "data"
      formData.append("data", JSON.stringify(payload));

      // Add the profile image if it exists
      if (profileImage) {
        formData.append("profile", profileImage);
      }

      console.log("Sending data:", JSON.stringify(payload));

      // Make the API request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`,
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header, browser will set it with boundary for FormData
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Registration failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("result", result);

      if (result.success) {
        // Set cookies on client side
        document.cookie = `accessToken=${result.data.accessToken}; path=/;`;
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/;`;
        await updateUser();
        toast.success(result.message || "Registration successful!");
        router.push("/");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="text-green-500">
              <PlusCircle className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
            Patient Register
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="email"
                            placeholder="Email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Contact Number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Address"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Profile Photo Upload (Optional) */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {profileImage
                      ? "Change Profile Photo"
                      : "Upload Profile Photo (Optional)"}
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setProfileImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {profileImage && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {profileImage.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "REGISTER"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <p>
              Do you already have an account?{" "}
              <Link
                href="/login"
                className="text-green-500 hover:text-green-600 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-green-50 relative">
          <Image
            src={registerImg || ""}
            alt="Healthcare registration"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
