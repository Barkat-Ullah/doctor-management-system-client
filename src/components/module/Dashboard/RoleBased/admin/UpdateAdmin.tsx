/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, Loader2, Upload, User } from "lucide-react";

// Assuming these are imported from elsewhere in your project
import { adminProfileSchema } from "@/components/schema";
import { updateMyProfile } from "@/services/Auth";
import { useRouter } from "next/navigation";

export type Profile = {
  name: string;
  email: string;
  contactNumber?: string;
  profilePhoto?: string;
  role: string;
  updatedAt?: string;
};

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;
const AdminProfile = ({ profile }: { profile: Profile }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize the form with existing profile data
  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      name: profile.name || "",
      contactNumber: profile.contactNumber || "",
      profilePhoto: profile.profilePhoto || "",
    },
  });

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    form.setValue("profilePhoto", URL.createObjectURL(file));
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const onSubmit = async (data: AdminProfileFormValues) => {
    try {
      setIsLoading(true);

      // Create FormData object for multipart/form-data
      const formData = new FormData();

      // Create a data object with all form fields
      const dataObj = {
        name: data.name,
        contactNumber: data.contactNumber || "",
      };

      // Add the data object as a JSON string under the "data" key as required by the backend
      formData.append("data", JSON.stringify(dataObj));

      // Only append file if a new one was selected
      if (selectedFile) {
        formData.append("profile", selectedFile);
      } else if (profile.profilePhoto) {
        // Keep existing photo if no new one was selected
        formData.append("profilePhoto", profile.profilePhoto);
      }

      // Send the request
      const result = await updateMyProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully");
        router.push("/dashboard/admin/profile");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast.error("An error occurred while updating profile");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="flex flex-col items-center bg-green-50 rounded-t-lg pb-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            {form.watch("profilePhoto") ? (
              <AvatarImage
                src={form.watch("profilePhoto") || "/placeholder.svg"}
                alt={profile.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                {profile.name?.charAt(0) || <User />}
              </AvatarFallback>
            )}
          </Avatar>
          <div
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all cursor-pointer"
            onClick={triggerFileInput}
          >
            <Camera className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-xl text-green-700 mt-4">
          {profile.name}
        </CardTitle>
        <CardDescription className="flex flex-col items-center gap-2 mt-1">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {profile.role}
          </span>
          <span className="text-gray-600">{profile.email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhoto"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                      />
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : "No file selected"}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminProfile;
