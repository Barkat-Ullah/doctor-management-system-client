"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileText,
  Calendar,
  Stethoscope,
  Download,
  Loader2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { getMyPrescriptions, type Prescription } from "@/services/Prescription";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const result = await getMyPrescriptions({
        limit: 50,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (result.success) {
        setPrescriptions(result.data);
      } else {
        setPrescriptions([]);
        toast.error(result.message || "Failed to fetch prescriptions");
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions([]);
      toast.error("Something went wrong while fetching prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = (prescriptionId: string) => {
    console.log(prescriptionId);
    // Placeholder for download functionality
    toast.info("Download functionality will be implemented soon");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading prescriptions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
        <p className="text-muted-foreground">
          View and manage your medical prescriptions
        </p>
      </div>

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No prescriptions found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              You don&apos;t have any prescriptions yet. Complete an appointment
              to receive prescriptions from your doctor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={
                          prescription.doctor?.profilePhoto ||
                          "/placeholder.svg"
                        }
                        alt={prescription.doctor?.name || "Doctor"}
                      />
                      <AvatarFallback>
                        {prescription.doctor?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        Dr. {prescription.doctor?.name || "Unknown Doctor"}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {prescription.doctor?.designation || "Doctor"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {prescription.doctor?.qualification}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Prescription ID
                    </p>
                    <p className="font-mono text-sm">{prescription.id}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Prescription Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Prescription Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {formatDateTime(prescription.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Appointment Date:
                        </span>
                        <span className="font-medium">
                          {formatDateTime(
                            prescription.appointment.appointmentDateTime
                          )}
                        </span>
                      </div>
                      {prescription.followUpDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Follow-up Date:
                          </span>
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {formatDate(prescription.followUpDate)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Appointment Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Appointment ID:
                        </span>
                        <span className="font-mono text-xs">
                          {prescription.appointmentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {prescription.appointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Instructions */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Medical Instructions & Prescription
                  </h4>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div
                      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: prescription.instructions,
                      }}
                    />
                  </div>
                </div>

                {/* Follow-up Alert */}
                {prescription.followUpDate && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-blue-800">
                        Follow-up Reminder
                      </h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      You have a follow-up appointment scheduled for{" "}
                      <strong>{formatDate(prescription.followUpDate)}</strong>.
                      Please contact your doctor to confirm the appointment.
                    </p>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(prescription.id)}
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
