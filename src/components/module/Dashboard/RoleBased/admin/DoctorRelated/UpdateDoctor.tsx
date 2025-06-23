/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useState, useTransition, useEffect } from "react";
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
import { updateDoctor, getAllSpecialties } from "@/services/Doctors";
import {
  Upload,
  ArrowLeft,
  Loader2,
  User,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import type { Doctor, Specialty } from "@/types/doctor.type";
import { useUser } from "@/context/UserContext";

const updateDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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
  specialties: z.array(
    z.object({
      specialtiesId: z.string(),
      isDeleted: z.boolean(),
    })
  ),
});

type UpdateDoctorFormValues = z.infer<typeof updateDoctorSchema>;

interface EditDoctorFormProps {
  doctor: Doctor;
}

const EditDoctorForm: React.FC<EditDoctorFormProps> = ({ doctor }) => {
  const router = useRouter();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  console.log(profileImage);
  const [imagePreview, setImagePreview] = useState<string | null>(
    doctor.profilePhoto || null
  );
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(
    new Set()
  );

  const form = useForm<UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorSchema),
    defaultValues: {
      name: doctor.name,
      contactNumber: doctor.contactNumber,
      address: doctor.address,
      age: doctor.age || "",
      registrationNumber: doctor.registrationNumber,
      experience: doctor.experience,
      gender: doctor.gender,
      appointmentFee: doctor.appointmentFee,
      qualification: doctor.qualification,
      currentWorkingPlace: doctor.currentWorkingPlace,
      designation: doctor.designation,
      specialties: [],
    },
  });

  // Load specialties and set initial selected specialties
  useEffect(() => {
    const loadSpecialties = async () => {
      const allSpecialties = await getAllSpecialties();
      setSpecialties(allSpecialties);

      // Set initially selected specialties
      const currentSpecialtyIds = new Set(
        doctor.doctorSpecialties?.map((ds) => ds.specialtiesId) || []
      );
      setSelectedSpecialties(currentSpecialtyIds);
    };

    loadSpecialties();
  }, [doctor]);

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

  const handleSpecialtyChange = (specialtyId: string, checked: boolean) => {
    const newSelected = new Set(selectedSpecialties);
    if (checked) {
      newSelected.add(specialtyId);
    } else {
      newSelected.delete(specialtyId);
    }
    setSelectedSpecialties(newSelected);
  };

  const onSubmit = async (data: UpdateDoctorFormValues) => {
    startTransition(async () => {
      try {
        // Get current specialty IDs
        const currentSpecialtyIds = new Set(
          doctor.doctorSpecialties?.map((ds) => ds.specialtiesId) || []
        );

        // Prepare specialties array for backend
        const specialtiesData = [];

        // Add specialties to be deleted
        for (const currentId of currentSpecialtyIds) {
          if (!selectedSpecialties.has(currentId)) {
            specialtiesData.push({
              specialtiesId: currentId,
              isDeleted: true,
            });
          }
        }

        // Add specialties to be created
        for (const selectedId of selectedSpecialties) {
          if (!currentSpecialtyIds.has(selectedId)) {
            specialtiesData.push({
              specialtiesId: selectedId,
              isDeleted: false,
            });
          }
        }

        const updateData = {
          ...data,
          specialties: specialtiesData,
        };

        const result = await updateDoctor(doctor.id, updateData);

        if (result.success) {
          toast.success(result.message || "Doctor updated successfully!");
          if (user?.role === "DOCTOR") {
            router.push("/dashboard/doctor/profile");
          } else if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
            router.push("/dashboard/admin/doctors");
          }
        } else {
          toast.error(result.message || "Failed to update doctor");
        }
      } catch (error) {
        console.error("Error updating doctor:", error);
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Doctor</h1>
          <p className="text-muted-foreground">Update doctor information</p>
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
                    Update doctor's profile picture
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
                    Update the doctor's areas of medical specialization. Changes
                    will be reflected in the DoctorSpecialties junction table.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-base font-medium">
                      Available Specialties
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto border rounded-lg p-4">
                      {specialties && specialties.length > 0 ? (
                        specialties.map((specialty) => (
                          <div
                            key={specialty.id}
                            className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={selectedSpecialties.has(specialty.id)}
                              onCheckedChange={(checked) =>
                                handleSpecialtyChange(
                                  specialty.id,
                                  checked as boolean
                                )
                              }
                            />
                            <div className="space-y-1 leading-none flex-1 min-w-0">
                              <label className="text-sm font-medium cursor-pointer block truncate">
                                {specialty.title}
                              </label>
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
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            No specialties available
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Please create some specialties first.
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedSpecialties.size > 0 && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          Selected Specialties:
                        </p>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                          {Array.from(selectedSpecialties).map(
                            (specialtyId) => {
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
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                  Update Doctor
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditDoctorForm;
