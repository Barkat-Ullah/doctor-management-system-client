"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Import your user context
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  DollarSign,
  Clock,
  User,
  Stethoscope,
  Shield,
  Loader2,
} from "lucide-react";

import { softDeleteDoctor, deleteDoctor } from "@/services/Doctors";
import { Doctor } from "@/types/doctor.type";
import ReviewsList from "@/components/module/Review/ReviewList";

interface DoctorDetailsProps {
  doctor: Doctor | null;
  userRole?: "ADMIN" | "PATIENT" | "DOCTOR" | "SUPER_ADMIN";
  showActions?: boolean;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({
  doctor,
  userRole,
  showActions = true,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteType, setDeleteType] = useState<"soft" | "hard" | null>(null);

  // Auto-detect user role if not provided
  const { user } = useUser();
  const currentUserRole = userRole || user?.role || "PATIENT";
  console.log(doctor);
  if (!doctor) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Doctor not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The doctor you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getSpecialties = () => {
    return doctor.doctorSpecialties?.map((ds) => ds.specialties.title) || [];
  };

  const handleDelete = async (type: "soft" | "hard") => {
    setDeleteType(type);
    startTransition(async () => {
      try {
        const result =
          type === "soft"
            ? await softDeleteDoctor(doctor.id)
            : await deleteDoctor(doctor.id);

        if (result.success) {
          toast.success(
            result.message ||
              `Doctor ${
                type === "soft" ? "deactivated" : "deleted"
              } successfully!`
          );
          // Role-based navigation after delete
          const redirectPath =
            currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN"
              ? "/dashboard/admin/doctors"
              : "/dashboard";
          router.push(redirectPath);
        } else {
          toast.error(
            result.message ||
              `Failed to ${type === "soft" ? "deactivate" : "delete"} doctor`
          );
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setDeleteType(null);
      }
    });
  };

  const handleEdit = () => {
    // Role-based edit navigation
    if (currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN") {
      router.push(`/dashboard/admin/doctors/edit/${doctor.id}`);
    } else if (currentUserRole === "DOCTOR") {
      // If doctor is viewing their own profile, go to profile edit
      if (user?.email === doctor.email) {
        router.push(`/dashboard/doctor/profile/edit/${doctor.id}`);
      } else {
        toast.error("You can only edit your own profile");
      }
    }
  };

  const handleBookAppointment = () => {
    router.push(`/dashboard/patient/appointments/${doctor.id}`);
  };

  // Check if user can perform admin actions
  const canPerformAdminActions =
    (currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN") &&
    showActions;

  // Check if doctor can edit (only their own profile)
  const canDoctorEdit =
    currentUserRole === "DOCTOR" && user?.email === doctor.email && showActions;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentUserRole === "DOCTOR" && user?.email === doctor.email
                ? "My Profile"
                : "Doctor Details"}
            </h1>
            <p className="text-muted-foreground">
              {currentUserRole === "PATIENT"
                ? "View doctor information and book appointments"
                : currentUserRole === "DOCTOR"
                ? user?.email === doctor.email
                  ? "Manage your profile information"
                  : "Doctor profile information"
                : "Manage doctor information"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {canPerformAdminActions && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Soft Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Soft Delete Doctor</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate the doctor account. The doctor will be
                    marked as inactive but data will be preserved. This action
                    can be reversed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete("soft")}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={isPending && deleteType === "soft"}
                  >
                    {isPending && deleteType === "soft" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Soft Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Permanently Delete Doctor</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the doctor account and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete("hard")}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isPending && deleteType === "hard"}
                  >
                    {isPending && deleteType === "hard" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Doctor Edit Button (for own profile) */}
        {canDoctorEdit && (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}

        {/* Patient Actions */}
        {currentUserRole === "PATIENT" && (
          <Button onClick={handleBookAppointment}>
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={doctor.profilePhoto || "/placeholder.svg"}
                  alt={doctor.name}
                />
                <AvatarFallback className="text-2xl">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{doctor.name}</CardTitle>
            <CardDescription className="text-base">
              {doctor.designation}
            </CardDescription>
            <div className="flex justify-center mt-2">
              <Badge variant={doctor.isDeleted ? "destructive" : "default"}>
                {doctor.isDeleted ? "Inactive" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.contactNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{doctor.currentWorkingPlace}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Registration Number
                    </label>
                    <p className="text-sm mt-1">{doctor.registrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Qualification
                    </label>
                    <p className="text-sm mt-1">{doctor.qualification}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Gender
                    </label>
                    <p className="text-sm mt-1">{doctor.gender}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Experience
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.experience} years</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Appointment Fee
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {doctor.appointmentFee}
                      </span>
                    </div>
                  </div>
                  {doctor.age && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Age
                      </label>
                      <p className="text-sm mt-1">{doctor.age} years</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Medical Specialties
              </CardTitle>
              <CardDescription>Areas of medical expertise</CardDescription>
            </CardHeader>
            <CardContent>
              {getSpecialties().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getSpecialties().map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    No specialties assigned
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Specialties can be added when editing the doctor profile.
                  </p>
                  {(canPerformAdminActions || canDoctorEdit) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleEdit}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Add Specialties
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Schedules
              </CardTitle>
              <CardDescription>
                Doctor&rsquo;s available appointment times
              </CardDescription>
            </CardHeader>
            <CardContent>
              {doctor?.doctorSchedules && doctor?.doctorSchedules.length > 0 ? (
                <div className="space-y-4">
                  {/* Group schedules by date */}
                  {Object.entries(
                    doctor?.doctorSchedules.reduce((acc, ds) => {
                      const date = new Date(
                        ds?.schedule?.startDateTime
                      ).toDateString();
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(ds);
                      return acc;
                    }, {} as Record<string, typeof doctor.doctorSchedules>)
                  ).map(([date, schedules]) => (
                    <div
                      key={date}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {schedules
                          .sort(
                            (a, b) =>
                              new Date(a.schedule.startDateTime).getTime() -
                              new Date(b.schedule.startDateTime).getTime()
                          )
                          .map((ds) => (
                            <div
                              key={ds.scheduleId}
                              className={`flex items-center justify-center p-2 border rounded-md transition-colors ${
                                ds.isBooked
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-green-50 border-green-200 text-green-700"
                              }`}
                            >
                              <div className="text-center">
                                <div className="text-sm font-medium">
                                  {new Date(
                                    ds.schedule.startDateTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </div>
                                <div className="text-xs opacity-75">
                                  {new Date(
                                    ds.schedule.endDateTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </div>
                                <div className="text-xs mt-1">
                                  {ds.isBooked ? "Booked" : "Available"}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}

                  {/* Schedule Summary */}
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm">
                      <span className="font-medium text-blue-800">
                        Total Schedules: {doctor.doctorSchedules.length}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-700">
                        Available:{" "}
                        {
                          doctor.doctorSchedules.filter((ds) => !ds.isBooked)
                            .length
                        }
                      </span>
                      <span className="text-red-700">
                        Booked:{" "}
                        {
                          doctor.doctorSchedules.filter((ds) => ds.isBooked)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    No schedules available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Doctor hasn&apos;t set up any appointment schedules yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <ReviewsList doctorEmail={doctor.email} limit={20} />

          {/* Account Information - Only for Admin/Super Admin */}
          {(currentUserRole === "ADMIN" ||
            currentUserRole === "SUPER_ADMIN") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Doctor ID
                    </label>
                    <p className="text-sm mt-1 font-mono">{doctor.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={doctor.isDeleted ? "destructive" : "default"}
                      >
                        {doctor.isDeleted ? "Inactive" : "Active"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm mt-1">
                      {new Date(doctor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm mt-1">
                      {new Date(doctor.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
