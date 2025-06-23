/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Shield,
  Loader2,
  Droplets,
  Weight,
  Ruler,
  Heart,
  AlertCircle,
  FileText,
  Plus,
  Download,
  Activity,
  Cigarette,
  Baby,
  Brain,
  Syringe,
  Scissors,
  Frown,
} from "lucide-react";
import type { Patient } from "@/types/patient";
import {
  softDeletePatient,
  deletePatient,
  updatePatientAttachment,
} from "@/services/Patients/index";

interface PatientDetailsProps {
  patient: Patient;
  userRole?: "ADMIN" | "DOCTOR" | "PATIENT";
  showActions?: boolean;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  userRole = "PATIENT",
  showActions = true,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteType, setDeleteType] = useState<"soft" | "hard" | null>(null);
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportName: "",
    description: "",
    file: null as File | null,
  });

  // Safe function to get initials from name
  const getInitials = (name: string | null | undefined): string => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Role-based field visibility check
  const canViewField = (fieldPath: string): boolean => {
    if (userRole === "ADMIN") return true;

    const permissions = {
      DOCTOR: [
        "name",
        "email",
        "contactNumber",
        "address",
        "age",
        "profilePhoto",
        "patientHealthCare",
        "medicalReport",
      ],
      PATIENT: [
        "name",
        "email",
        "contactNumber",
        "address",
        "age",
        "profilePhoto",
        "patientHealthCare",
        "medicalReport",
      ],
    };

    return (
      permissions[userRole]?.some((field) => fieldPath.startsWith(field)) ||
      false
    );
  };

  const handleDelete = async (type: "soft" | "hard") => {
    setDeleteType(type);
    startTransition(async () => {
      try {
        const result =
          type === "soft"
            ? await softDeletePatient(patient.id)
            : await deletePatient(patient.id);

        if (result.success) {
          toast.success(
            result.message ||
              `Patient ${
                type === "soft" ? "deactivated" : "deleted"
              } successfully!`
          );
          router.push("/dashboard/admin/patients");
        } else {
          toast.error(
            result.message ||
              `Failed to ${type === "soft" ? "deactivate" : "delete"} patient`
          );
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setDeleteType(null);
      }
    });
  };

  const handleEdit = () => {
    if (userRole === "ADMIN") {
      router.push(`/dashboard/admin/patients/${patient.id}/edit`);
    } else if (userRole === "PATIENT") {
      router.push(`/dashboard/patient/profile/edit/${patient.id}`);
    }
  };

  const handleAddReport = async () => {
    if (!reportForm.reportName || !reportForm.file) {
      toast.error("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("reportName", reportForm.reportName);
        formData.append("description", reportForm.description);

        if (reportForm.file) {
          formData.append("reportFile", reportForm.file);
        } else {
          toast.error("Please select a file to upload");
          return;
        }

        const result = await updatePatientAttachment(patient.id, formData);

        if (result.success) {
          toast.success("Medical report added successfully!");
          setIsAddReportDialogOpen(false);
          setReportForm({ reportName: "", description: "", file: null });
          window.location.reload();
        } else {
          toast.error(result.message || "Failed to add medical report");
        }
      } catch (error) {
        console.error("Error adding medical report:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const handleDownloadReport = (reportLink: string, reportName: string) => {
    window.open(reportLink, "_blank");
    toast.success(`Downloading ${reportName}...`);
  };

  // Safe display function for any field
  const safeDisplay = (
    value: string | null | undefined,
    fallback = "Not provided"
  ): string => {
    return value && value.trim() ? value : fallback;
  };

  // Blood group display helper
  const formatBloodGroup = (bloodGroup: string | null | undefined): string => {
    if (!bloodGroup) return "Not provided";
    return bloodGroup.replace(/_/g, "");
  };

  // Boolean field display helper
  const formatBooleanField = (
    value: boolean | null | undefined,
    trueText: string,
    falseText: string
  ): string => {
    if (value === null || value === undefined) return "Not provided";
    return value ? trueText : falseText;
  };

  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Patient not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The patient you're looking for doesn't exist or has been removed.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Patient Details
            </h1>
            <p className="text-muted-foreground">
              {userRole === "PATIENT"
                ? "Your personal health information"
                : userRole === "DOCTOR"
                ? "View patient health information"
                : "Manage patient information"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && userRole === "ADMIN" && (
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
                  <AlertDialogTitle>Soft Delete Patient</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate the patient account. The patient will
                    be marked as inactive but data will be preserved. This
                    action can be reversed.
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
                  <AlertDialogTitle>
                    Permanently Delete Patient
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the patient account and remove all associated data from our
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

        {/* Patient Actions */}
        {userRole === "PATIENT" && (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}

        {/* Doctor Actions */}
        {userRole === "DOCTOR" && (
          <Button onClick={() => setIsAddReportDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Medical Report
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
                  src={patient.profilePhoto || "/placeholder.svg"}
                  alt={patient.name || "Patient"}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {safeDisplay(patient.name, "Unknown Patient")}
            </CardTitle>
            <div className="flex justify-center mt-2">
              <Badge variant={patient.isDeleted ? "destructive" : "default"}>
                {patient.isDeleted ? "Inactive" : "Active"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {canViewField("email") && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{safeDisplay(patient.email)}</span>
                </div>
              )}
              {canViewField("contactNumber") && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {safeDisplay(patient.contactNumber)}
                  </span>
                </div>
              )}
              {canViewField("address") && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {safeDisplay(patient.address)}
                  </span>
                </div>
              )}
              {canViewField("age") && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Age: {safeDisplay(patient.age)}
                  </span>
                </div>
              )}
              {patient.patientHealthCare?.dateOfBirth &&
                canViewField("patientHealthCare") && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      DOB: {formatDate(patient.patientHealthCare.dateOfBirth)}
                    </span>
                  </div>
                )}
              {patient.patientHealthCare?.gender &&
                canViewField("patientHealthCare") && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {patient.patientHealthCare.gender}
                    </span>
                  </div>
                )}
              {patient.patientHealthCare?.bloodGroup &&
                canViewField("patientHealthCare") && (
                  <div className="flex items-center gap-3">
                    <Droplets className="h-4 w-4 text-red-500" />
                    <span className="text-sm">
                      Blood Group:{" "}
                      {formatBloodGroup(patient.patientHealthCare.bloodGroup)}
                    </span>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Information */}
          {canViewField("patientHealthCare") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Health Information
                </CardTitle>
                <CardDescription>
                  Patient's health metrics and conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patient.patientHealthCare ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Physical Metrics */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Height
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {safeDisplay(patient.patientHealthCare.height)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Weight
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {safeDisplay(patient.patientHealthCare.weight)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Marital Status
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {patient.patientHealthCare.maritalStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Allergies
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">
                            {formatBooleanField(
                              patient.patientHealthCare.hasAllergies,
                              "Yes",
                              "No"
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Diabetes
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Activity className="h-4 w-4 text-red-500" />
                          <span className="text-sm">
                            {formatBooleanField(
                              patient.patientHealthCare.hasDiabetes,
                              "Yes",
                              "No"
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Smoking Status
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <Cigarette className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {formatBooleanField(
                              patient.patientHealthCare.smokingStatus,
                              "Smoker",
                              "Non-smoker"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Health Info */}
                    {patient.patientHealthCare.dietaryPreferences && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Dietary Preferences
                        </label>
                        <div className="flex items-start gap-2 mt-1">
                          <Heart className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">
                            {patient.patientHealthCare.dietaryPreferences}
                          </span>
                        </div>
                      </div>
                    )}

                    {patient.patientHealthCare.mentalHealthHistory && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Mental Health History
                        </label>
                        <div className="flex items-start gap-2 mt-1">
                          <Brain className="h-4 w-4 text-purple-500 mt-0.5" />
                          <span className="text-sm">
                            {patient.patientHealthCare.mentalHealthHistory}
                          </span>
                        </div>
                      </div>
                    )}

                    {patient.patientHealthCare.immunizationStatus && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Immunization Status
                        </label>
                        <div className="flex items-start gap-2 mt-1">
                          <Syringe className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">
                            {patient.patientHealthCare.immunizationStatus}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Medical History Flags */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <Scissors className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                        <p className="text-xs text-muted-foreground">
                          Past Surgeries
                        </p>
                        <p className="text-sm font-medium">
                          {formatBooleanField(
                            patient.patientHealthCare.hasPastSurgeries,
                            "Yes",
                            "No"
                          )}
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <Frown className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                        <p className="text-xs text-muted-foreground">
                          Recent Anxiety
                        </p>
                        <p className="text-sm font-medium">
                          {formatBooleanField(
                            patient.patientHealthCare.recentAnxiety,
                            "Yes",
                            "No"
                          )}
                        </p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <Frown className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <p className="text-xs text-muted-foreground">
                          Recent Depression
                        </p>
                        <p className="text-sm font-medium">
                          {formatBooleanField(
                            patient.patientHealthCare.recentDepression,
                            "Yes",
                            "No"
                          )}
                        </p>
                      </div>
                      {patient.patientHealthCare.gender === "FEMALE" && (
                        <div className="text-center p-3 border rounded-lg">
                          <Baby className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                          <p className="text-xs text-muted-foreground">
                            Pregnancy
                          </p>
                          <p className="text-sm font-medium">
                            {formatBooleanField(
                              patient.patientHealthCare.pregnancyStatus,
                              "Yes",
                              "No"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No health information recorded
                    </p>
                    {(userRole === "ADMIN" || userRole === "PATIENT") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleEdit}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Add Health Information
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Medical Reports */}
          {canViewField("medicalReport") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Medical Reports
                </CardTitle>
                <CardDescription>
                  Patient's medical reports and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patient.medicalReport && patient.medicalReport.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medicalReport.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{report.reportName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(report.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDownloadReport(
                              report.reportLink,
                              report.reportName
                            )
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No medical reports available
                    </p>
                    {userRole === "DOCTOR" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setIsAddReportDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medical Report
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Information - Only for Admin */}
          {userRole === "ADMIN" && (
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
                      Patient ID
                    </label>
                    <p className="text-sm mt-1 font-mono">{patient.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={patient.isDeleted ? "destructive" : "default"}
                      >
                        {patient.isDeleted ? "Inactive" : "Active"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created At
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(patient.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-sm mt-1">
                      {formatDate(patient.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Medical Report Dialog - Only for Doctors */}
      {userRole === "DOCTOR" && (
        <Dialog
          open={isAddReportDialogOpen}
          onOpenChange={setIsAddReportDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Medical Report</DialogTitle>
              <DialogDescription>
                Upload a new medical report for this patient.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <FormLabel>Report Name *</FormLabel>
                <Input
                  placeholder="e.g., Blood Test Results"
                  value={reportForm.reportName}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      reportName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Brief description of the report..."
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Report File *</FormLabel>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddReportDialogOpen(false);
                  setReportForm({
                    reportName: "",
                    description: "",
                    file: null,
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddReport}
                disabled={
                  isPending || !reportForm.reportName || !reportForm.file
                }
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PatientDetails;
