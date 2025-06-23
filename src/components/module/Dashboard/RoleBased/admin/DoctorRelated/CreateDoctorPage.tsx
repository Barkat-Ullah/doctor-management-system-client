/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "sonner";
import { createDoctor } from "@/services/Doctors";
import {
  Upload,
  ArrowLeft,
  Loader2,
  User,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import type { Specialty } from "@/types/doctor.type";

const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  age: z.string().optional(),
  registrationNumber: z.string().min(3, "Registration number is required"),
  experience: z.number().min(0, "Experience must be 0 or greater"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  appointmentFee: z.number().min(1, "Appointment fee must be greater than 0"),
  qualification: z.string().min(2, "Qualification is required"),
  currentWorkingPlace: z.string().min(2, "Current working place is required"),
  designation: z.string().min(2, "Designation is required"),
  doctorSpecialties: z
    .array(z.string())
    .min(1, "At least one specialty must be selected"),
});

type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;

interface CreateDoctorFormProps {
  specialties: Specialty[];
}

const CreateDoctorForm: React.FC<CreateDoctorFormProps> = ({ specialties }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contactNumber: "",
      address: "",
      age: "",
      registrationNumber: "",
      experience: 0,
      gender: "MALE",
      appointmentFee: 0,
      qualification: "",
      currentWorkingPlace: "",
      designation: "",
      doctorSpecialties: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateDoctorFormValues) => {
    console.log("1. Frontend form data:", data);
    console.log("2. Selected doctorSpecialties:", data.doctorSpecialties);

    startTransition(async () => {
      try {
        // Create FormData for file upload
        const formData = new FormData();

        // Add profile image if selected
        if (profileImage) {
          formData.append("profile", profileImage);
        }

        // Prepare doctor data
        const doctorData = {
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address,
          age: data.age,
          registrationNumber: data.registrationNumber,
          experience: data.experience,
          gender: data.gender,
          appointmentFee: data.appointmentFee,
          qualification: data.qualification,
          currentWorkingPlace: data.currentWorkingPlace,
          designation: data.designation,
        };

        // Create the request data structure that matches your backend expectation
        const requestData = {
          doctor: doctorData,
          password: data.password,
          doctorSpecialties: data.doctorSpecialties, // Array of specialty IDs for junction table
        };

        console.log("3. Request data being sent to backend:", requestData);

        // Add the data as a JSON string
        formData.append("data", JSON.stringify(requestData));

        // Log what's actually in the FormData
        console.log("4. FormData contents:");
        for (const [key, value] of formData.entries()) {
          if (key === "data") {
            console.log(`${key}:`, JSON.parse(value as string));
          } else {
            console.log(`${key}:`, value);
          }
        }

        const result = await createDoctor(formData);
        console.log("5. Backend response:", result);

        if (result.success) {
          toast.success(result.message || "Doctor created successfully!");
          router.push("/dashboard/admin/doctors");
        } else {
          toast.error(result.message || "Failed to create doctor");
          console.error("Backend error:", result);
        }
      } catch (error) {
        console.error("Frontend error creating doctor:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Doctor
          </h1>
          <p className="text-muted-foreground">
            Add a new doctor to the system
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Profile Image Upload - Sidebar */}
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Profile Photo
                  </CardTitle>
                  <CardDescription>
                    Upload doctor's profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Doctor profile preview"
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            Upload Photo
                          </p>
                        </div>
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Form Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
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
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="35" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Main Street, City, State, ZIP"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="REG123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification</FormLabel>
                        <FormControl>
                          <Input placeholder="MBBS, MD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Consultant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentWorkingPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Working Place</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City General Hospital"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (Years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Fee ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Doctor Specialties Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Medical Specialties
                  </CardTitle>
                  <CardDescription>
                    Select the doctor's areas of medical specialization. These
                    will create records in the DoctorSpecialties junction table.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="doctorSpecialties"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Available Specialties
                        </FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 max-h-80 overflow-y-auto border rounded-lg p-4">
                          {specialties && specialties.length > 0 ? (
                            specialties.map((specialty) => (
                              <FormField
                                key={specialty.id}
                                control={form.control}
                                name="doctorSpecialties"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={specialty.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            specialty.id
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  specialty.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== specialty.id
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex-1 min-w-0">
                                        <FormLabel className="text-sm font-medium cursor-pointer block truncate">
                                          {specialty.title}
                                        </FormLabel>
                                        <p className="text-xs text-muted-foreground truncate">
                                          ID: {specialty.id.slice(0, 8)}...
                                        </p>
                                        {specialty.icon && (
                                          <p className="text-xs text-muted-foreground truncate">
                                            {specialty.icon.startsWith("http")
                                              ? "Custom Icon"
                                              : specialty.icon}
                                          </p>
                                        )}
                                      </div>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))
                          ) : (
                            <div className="col-span-full text-center py-8">
                              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">
                                No specialties available
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Please create some specialties first before
                                adding doctors.
                              </p>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                        {form.watch("doctorSpecialties")?.length > 0 && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">
                              Selected Specialties:
                            </p>
                            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                              {form
                                .watch("doctorSpecialties")
                                .map((specialtyId) => {
                                  const specialty = specialties.find(
                                    (s) => s.id === specialtyId
                                  );
                                  return specialty ? (
                                    <span
                                      key={specialtyId}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground"
                                    >
                                      {specialty.title}
                                    </span>
                                  ) : null;
                                })}
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Doctor
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateDoctorForm;
