/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Loader2, User, Heart, Activity } from "lucide-react";
import type { Patient, UpdatePatientData } from "@/types/patient";
import { updatePatient } from "@/services/Patients/index";

// Role-based schema
const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  age: z.string().optional(),
  patientHealthCare: z
    .object({
      gender: z.enum(["MALE", "FEMALE"]),
      dateOfBirth: z.string().optional(),
      bloodGroup: z
        .enum([
          "A_POSITIVE",
          "B_POSITIVE",
          "O_POSITIVE",
          "AB_POSITIVE",
          "A_NEGATIVE",
          "B_NEGATIVE",
          "O_NEGATIVE",
          "AB_NEGATIVE",
        ])
        .optional(),
      height: z.string().optional(),
      weight: z.string().optional(),
      hasAllergies: z.boolean().optional(),
      hasDiabetes: z.boolean().optional(),
      smokingStatus: z.boolean().optional(),
      dietaryPreferences: z.string().optional(),
      pregnancyStatus: z.boolean().optional(),
      mentalHealthHistory: z.string().optional(),
      immunizationStatus: z.string().optional(),
      hasPastSurgeries: z.boolean().optional(),
      recentAnxiety: z.boolean().optional(),
      recentDepression: z.boolean().optional(),
      maritalStatus: z.enum(["MARRIED", "UNMARRIED"]).optional(),
    })
    .optional(),
});

const doctorSchema = z.object({
  patientHealthCare: z
    .object({
      height: z.string().optional(),
      weight: z.string().optional(),
      hasAllergies: z.boolean().optional(),
      hasDiabetes: z.boolean().optional(),
      mentalHealthHistory: z.string().optional(),
    })
    .optional(),
});

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  patientHealthCare: z
    .object({
      height: z.string().optional(),
      weight: z.string().optional(),
      dietaryPreferences: z.string().optional(),
    })
    .optional(),
});

const getSchemaForRole = (userRole: string) => {
  switch (userRole) {
    case "ADMIN":
      return adminSchema;
    case "DOCTOR":
      return doctorSchema;
    case "PATIENT":
      return patientSchema;
    default:
      return adminSchema;
  }
};

interface EditPatientFormProps {
  patient: Patient;
  userRole?: "ADMIN" | "DOCTOR" | "PATIENT";
}

const EditPatientForm = ({
  patient,
  userRole = "ADMIN",
}: EditPatientFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const schema = getSchemaForRole(userRole);
  type AdminFormValues = z.infer<typeof adminSchema>;
  type DoctorFormValues = z.infer<typeof doctorSchema>;
  type PatientFormValues = z.infer<typeof patientSchema>;
  type FormValues = AdminFormValues | DoctorFormValues | PatientFormValues;

  const getDefaultValues = (): any => {
    if (userRole === "ADMIN") {
      return {
        name: patient.name || "",
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
        age: patient.age || "",
        patientHealthCare: {
          gender: patient.patientHealthCare?.gender || "MALE",
          dateOfBirth: patient.patientHealthCare?.dateOfBirth || "",
          bloodGroup: patient.patientHealthCare?.bloodGroup || "A_POSITIVE",
          height: patient.patientHealthCare?.height || "",
          weight: patient.patientHealthCare?.weight || "",
          hasAllergies: patient.patientHealthCare?.hasAllergies || false,
          hasDiabetes: patient.patientHealthCare?.hasDiabetes || false,
          smokingStatus: patient.patientHealthCare?.smokingStatus || false,
          dietaryPreferences:
            patient.patientHealthCare?.dietaryPreferences || "",
          pregnancyStatus: patient.patientHealthCare?.pregnancyStatus || false,
          mentalHealthHistory:
            patient.patientHealthCare?.mentalHealthHistory || "",
          immunizationStatus:
            patient.patientHealthCare?.immunizationStatus || "",
          hasPastSurgeries:
            patient.patientHealthCare?.hasPastSurgeries || false,
          recentAnxiety: patient.patientHealthCare?.recentAnxiety || false,
          recentDepression:
            patient.patientHealthCare?.recentDepression || false,
          maritalStatus:
            patient.patientHealthCare?.maritalStatus || "UNMARRIED",
        },
      };
    } else if (userRole === "DOCTOR") {
      return {
        patientHealthCare: {
          height: patient.patientHealthCare?.height || "",
          weight: patient.patientHealthCare?.weight || "",
          hasAllergies: patient.patientHealthCare?.hasAllergies || false,
          hasDiabetes: patient.patientHealthCare?.hasDiabetes || false,
          mentalHealthHistory:
            patient.patientHealthCare?.mentalHealthHistory || "",
        },
      };
    } else {
      // PATIENT
      return {
        name: patient.name || "",
        contactNumber: patient.contactNumber || "",
        address: patient.address || "",
        patientHealthCare: {
          height: patient.patientHealthCare?.height || "",
          weight: patient.patientHealthCare?.weight || "",
          dietaryPreferences:
            patient.patientHealthCare?.dietaryPreferences || "",
        },
      };
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data: FormValues) => {
    startTransition(async () => {
      try {
        const updateData: UpdatePatientData = data as UpdatePatientData;

        const result = await updatePatient(patient.id, updateData);

        if (result.success) {
          toast.success(result.message || "Patient updated successfully!");
          if (userRole === "ADMIN") {
            router.push(`/dashboard/admin/patients/${patient.id}`);
          } else if (userRole === "PATIENT") {
            router.push(`/dashboard/patient/profile`);
          } else {
            router.back();
          }
        } else {
          toast.error(result.message || "Failed to update patient");
        }
      } catch (error) {
        console.error("Error updating patient:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const canEditField = (fieldPath: string): boolean => {
    const permissions: Record<string, string[]> = {
      ADMIN: ["name", "contactNumber", "address", "age", "patientHealthCare"],
      DOCTOR: [
        "patientHealthCare.height",
        "patientHealthCare.weight",
        "patientHealthCare.hasAllergies",
        "patientHealthCare.hasDiabetes",
        "patientHealthCare.mentalHealthHistory",
      ],
      PATIENT: [
        "name",
        "contactNumber",
        "address",
        "patientHealthCare.height",
        "patientHealthCare.weight",
        "patientHealthCare.dietaryPreferences",
      ],
    };

    return (
      permissions[userRole]?.some((field) => fieldPath.startsWith(field)) ||
      false
    );
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
            {userRole === "PATIENT" ? "Edit Your Profile" : "Edit Patient"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "PATIENT"
              ? "Update your personal information"
              : userRole === "DOCTOR"
              ? "Update patient medical information"
              : "Update patient information and health records"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information - Admin & Patient only */}
          {(userRole === "ADMIN" || userRole === "PATIENT") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canEditField("name") && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Patient name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {canEditField("contactNumber") && (
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
                )}

                {canEditField("age") && userRole === "ADMIN" && (
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Age"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {canEditField("address") && (
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Health Information
              </CardTitle>
              <CardDescription>
                {userRole === "DOCTOR"
                  ? "Medical assessment and health metrics"
                  : "Patient's health metrics and medical conditions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Health Metrics - All roles can edit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canEditField("patientHealthCare.height") && (
                  <FormField
                    control={form.control}
                    name={`patientHealthCare.height` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 170 cm"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {canEditField("patientHealthCare.weight") && (
                  <FormField
                    control={form.control}
                    name={`patientHealthCare.weight` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 70 kg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Admin-only fields */}
              {userRole === "ADMIN" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`patientHealthCare.gender` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || "MALE"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`patientHealthCare.bloodGroup` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || "A_POSITIVE"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A_POSITIVE">A+</SelectItem>
                              <SelectItem value="B_POSITIVE">B+</SelectItem>
                              <SelectItem value="O_POSITIVE">O+</SelectItem>
                              <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                              <SelectItem value="A_NEGATIVE">A-</SelectItem>
                              <SelectItem value="B_NEGATIVE">B-</SelectItem>
                              <SelectItem value="O_NEGATIVE">O-</SelectItem>
                              <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`patientHealthCare.dateOfBirth` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`patientHealthCare.maritalStatus` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || "UNMARRIED"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MARRIED">Married</SelectItem>
                              <SelectItem value="UNMARRIED">
                                Unmarried
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Medical Conditions - Admin only */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Medical Conditions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`patientHealthCare.hasAllergies` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Has Allergies</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`patientHealthCare.hasDiabetes` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Has Diabetes</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`patientHealthCare.smokingStatus` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Smoker</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`patientHealthCare.hasPastSurgeries` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Past Surgeries</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`patientHealthCare.recentAnxiety` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Recent Anxiety</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`patientHealthCare.recentDepression` as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Recent Depression</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("patientHealthCare.gender" as any) ===
                        "FEMALE" && (
                        <FormField
                          control={form.control}
                          name={`patientHealthCare.pregnancyStatus` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value || false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Pregnant</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Doctor-specific fields */}
              {(userRole === "DOCTOR" || userRole === "ADMIN") && (
                <>
                  {canEditField("patientHealthCare.hasAllergies") &&
                    userRole === "DOCTOR" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`patientHealthCare.hasAllergies` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value || false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Has Allergies</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`patientHealthCare.hasDiabetes` as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value || false}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Has Diabetes</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                  {canEditField("patientHealthCare.mentalHealthHistory") && (
                    <FormField
                      control={form.control}
                      name={`patientHealthCare.mentalHealthHistory` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mental Health History</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Mental health history and notes..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {/* Patient-specific fields */}
              {(userRole === "PATIENT" || userRole === "ADMIN") && (
                <>
                  {canEditField("patientHealthCare.dietaryPreferences") && (
                    <FormField
                      control={form.control}
                      name={`patientHealthCare.dietaryPreferences` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dietary Preferences</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Dietary preferences and restrictions..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {userRole === "ADMIN" && (
                    <FormField
                      control={form.control}
                      name={`patientHealthCare.immunizationStatus` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Immunization Status</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Vaccination history and immunization status..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update {userRole === "PATIENT" ? "Profile" : "Patient"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditPatientForm;
