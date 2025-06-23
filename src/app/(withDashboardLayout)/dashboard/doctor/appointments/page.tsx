"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Calendar,
  Video,
  FileText,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  User,
} from "lucide-react";
import {
  getMyAppointments,
  changeAppointmentStatus,
} from "@/services/Appointment";
import PrescriptionModal from "@/components/module/Dashboard/RoleBased/doctor/prescription/PrescriptionModal";

interface Appointment {
  id: string;
  appointmentDateTime: string;
  appointmentFee: number;
  paymentStatus: "PAID" | "UNPAID";
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
  videoCallingId: string;
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    age?: string;
    patientHealthCare?: {
      gender: string;
      bloodGroup: string;
      hasAllergies: boolean;
      hasDiabetes: boolean;
    };
  };
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

const DoctorAppointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [prescriptionModal, setPrescriptionModal] = useState<{
    isOpen: boolean;
    appointmentId: string;
    patientName: string;
  }>({
    isOpen: false,
    appointmentId: "",
    patientName: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const result = await getMyAppointments();
      if (result.success) {
        const appointmentsData = result.data?.data || result.data || [];
        if (Array.isArray(appointmentsData)) {
          setAppointments(appointmentsData);
        } else {
          setAppointments([]);
        }
      } else {
        setAppointments([]);
        toast.error(result.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      toast.error("Something went wrong while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    setUpdatingStatus(appointmentId);
    try {
      const result = await changeAppointmentStatus(appointmentId, newStatus);
      if (result.success) {
        toast.success(
          `Appointment status updated to ${newStatus.toLowerCase()}`
        );
        fetchAppointments();
      } else {
        toast.error(result.message || "Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Something went wrong while updating status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">Scheduled</Badge>
        );
      case "INPROGRESS":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Canceled</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    return paymentStatus === "PAID" ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
        <CheckCircle className="h-3 w-3" />
        Paid
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex items-center gap-1 text-xs">
        <XCircle className="h-3 w-3" />
        Unpaid
      </Badge>
    );
  };

  const handleJoinCall = (videoCallingId: string) => {
    console.log("Joining call with ID:", videoCallingId);
    router.push(`/dashboard/doctor/video-call/${videoCallingId}`);
  };

  const handlePrescription = (appointmentId: string, patientName: string) => {
    setPrescriptionModal({
      isOpen: true,
      appointmentId,
      patientName,
    });
  };

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case "scheduled":
        return appointments.filter((apt) => apt.status === "SCHEDULED");
      case "inprogress":
        return appointments.filter((apt) => apt.status === "INPROGRESS");
      case "completed":
        return appointments.filter((apt) => apt.status === "COMPLETED");
      case "canceled":
        return appointments.filter((apt) => apt.status === "CANCELED");
      default:
        return appointments;
    }
  };

  const getStatusCounts = () => {
    return {
      all: appointments.length,
      scheduled: appointments.filter((apt) => apt.status === "SCHEDULED")
        .length,
      inprogress: appointments.filter((apt) => apt.status === "INPROGRESS")
        .length,
      completed: appointments.filter((apt) => apt.status === "COMPLETED")
        .length,
      canceled: appointments.filter((apt) => apt.status === "CANCELED").length,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-4 sm:py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading appointments...</span>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Appointments
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your patient appointments and consultations
        </p>
      </div>

      {/* Tabs for filtering - Mobile Responsive */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Mobile: Scrollable tabs */}
        <div className="w-full overflow-x-auto">
          <TabsList className="grid grid-cols-5 w-full min-w-[500px] sm:min-w-0">
            <TabsTrigger
              value="all"
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">All</span>
              <span className="sm:hidden">All</span>
              <span className="ml-1">({statusCounts.all})</span>
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Scheduled</span>
              <span className="sm:hidden">Sched</span>
              <span className="ml-1">({statusCounts.scheduled})</span>
            </TabsTrigger>
            <TabsTrigger
              value="inprogress"
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Progress</span>
              <span className="ml-1">({statusCounts.inprogress})</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
              <span className="ml-1">({statusCounts.completed})</span>
            </TabsTrigger>
            <TabsTrigger
              value="canceled"
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Canceled</span>
              <span className="sm:hidden">Cancel</span>
              <span className="ml-1">({statusCounts.canceled})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                  No {activeTab === "all" ? "" : activeTab} appointments found
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base px-4">
                  {activeTab === "all"
                    ? "You don't have any appointments yet."
                    : `No appointments with ${activeTab} status.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredAppointments.map((appointment) => {
                const appointmentDate =
                  appointment.appointmentDateTime ||
                  appointment.schedule?.startDateTime;
                const { date } = appointmentDate
                  ? formatDateTime(appointmentDate)
                  : { date: "Date not available" };

                const scheduleStart = appointment.schedule?.startDateTime
                  ? formatDateTime(appointment.schedule.startDateTime)
                  : { time: "Time not available" };
                const scheduleEnd = appointment.schedule?.endDateTime
                  ? formatDateTime(appointment.schedule.endDateTime)
                  : { time: "Time not available" };

                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardHeader className="pb-3 sm:pb-4">
                      {/* Mobile: Stack vertically, Desktop: Side by side */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                            <AvatarImage
                              src={
                                appointment.patient?.profilePhoto ||
                                "/placeholder.svg"
                              }
                              alt={appointment.patient?.name || "Patient"}
                            />
                            <AvatarFallback>
                              {appointment.patient?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "PT"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg sm:text-xl truncate">
                              {appointment.patient?.name || "Unknown Patient"}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm truncate">
                              {appointment.patient?.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {getStatusBadge(appointment.status)}
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Appointment ID
                          </p>
                          <p className="font-mono text-xs sm:text-sm break-all sm:break-normal">
                            {appointment.id}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 sm:space-y-6">
                      {/* Patient Details - Mobile: Single column, Desktop: Two columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">
                              {appointment.patient?.age
                                ? `${appointment.patient.age} years old`
                                : "Age not specified"}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-sm break-words">
                              {appointment.patient?.address ||
                                "Address not provided"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">
                              {appointment.patient?.contactNumber ||
                                "Not available"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate text-sm">
                              {appointment.patient?.email || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Health Information */}
                      {appointment.patient?.patientHealthCare && (
                        <div>
                          <h4 className="font-medium mb-2 text-sm sm:text-base">
                            Health Information
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Badge
                              variant="outline"
                              className="text-xs justify-center"
                            >
                              {appointment.patient.patientHealthCare.gender}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs justify-center"
                            >
                              {appointment.patient.patientHealthCare.bloodGroup}
                            </Badge>
                            {appointment.patient.patientHealthCare
                              .hasAllergies && (
                              <Badge
                                variant="outline"
                                className="text-red-600 border-red-600 text-xs justify-center"
                              >
                                Allergies
                              </Badge>
                            )}
                            {appointment.patient.patientHealthCare
                              .hasDiabetes && (
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-600 text-xs justify-center"
                              >
                                Diabetes
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Appointment Details - Mobile: Single column, Desktop: Two columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                            <Calendar className="h-4 w-4" />
                            Appointment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-muted-foreground">
                                Date:
                              </span>
                              <span className="font-medium text-right break-words">
                                {date}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-muted-foreground">
                                Time:
                              </span>
                              <span className="font-medium text-right">
                                {scheduleStart.time} - {scheduleEnd.time}
                              </span>
                            </div>
                            {appointment.schedule?.startDateTime &&
                              appointment.schedule?.endDateTime && (
                                <div className="flex justify-between items-start">
                                  <span className="text-muted-foreground">
                                    Duration:
                                  </span>
                                  <span className="font-medium">
                                    {Math.round(
                                      (new Date(
                                        appointment.schedule.endDateTime
                                      ).getTime() -
                                        new Date(
                                          appointment.schedule.startDateTime
                                        ).getTime()) /
                                        (1000 * 60)
                                    )}{" "}
                                    min
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                            <CreditCard className="h-4 w-4" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-start">
                              <span className="text-muted-foreground">
                                Fee:
                              </span>
                              <span className="font-medium">
                                ${appointment.appointmentFee || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-muted-foreground">
                                Video Call ID:
                              </span>
                              <span className="font-mono text-xs break-all text-right max-w-[120px]">
                                {appointment.videoCallingId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Status Management */}
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                          <Clock className="h-4 w-4" />
                          Status Management
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {appointment.status === "SCHEDULED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(appointment.id, "INPROGRESS")
                              }
                              disabled={updatingStatus === appointment.id}
                              className="text-xs sm:text-sm"
                            >
                              {updatingStatus === appointment.id ? (
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              ) : null}
                              <span className="hidden sm:inline">
                                Start Consultation
                              </span>
                              <span className="sm:hidden">Start</span>
                            </Button>
                          )}
                          {appointment.status === "INPROGRESS" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatusChange(appointment.id, "COMPLETED")
                              }
                              disabled={updatingStatus === appointment.id}
                              className="text-xs sm:text-sm"
                            >
                              {updatingStatus === appointment.id ? (
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              ) : null}
                              <span className="hidden sm:inline">
                                Mark Complete
                              </span>
                              <span className="sm:hidden">Complete</span>
                            </Button>
                          )}
                          {(appointment.status === "SCHEDULED" ||
                            appointment.status === "INPROGRESS") && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleStatusChange(appointment.id, "CANCELED")
                              }
                              disabled={updatingStatus === appointment.id}
                              className="text-xs sm:text-sm"
                            >
                              {updatingStatus === appointment.id ? (
                                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                              ) : null}
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Action Buttons - Mobile: Stack vertically, Desktop: Side by side */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                          onClick={() =>
                            handleJoinCall(appointment.videoCallingId)
                          }
                          className="flex-1 text-sm"
                          disabled={
                            appointment.status === "COMPLETED" ||
                            appointment.status === "CANCELED" ||
                            appointment.paymentStatus !== "PAID"
                          }
                        >
                          <Video className="mr-2 h-4 w-4" />
                          {appointment.paymentStatus === "PAID"
                            ? "Join Call"
                            : "Payment Required"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePrescription(
                              appointment.id,
                              appointment.patient?.name || "Unknown Patient"
                            )
                          }
                          className="flex-1 text-sm"
                          disabled={appointment.status !== "COMPLETED"}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Prescription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={prescriptionModal.isOpen}
        onClose={() =>
          setPrescriptionModal({
            isOpen: false,
            appointmentId: "",
            patientName: "",
          })
        }
        appointmentId={prescriptionModal.appointmentId}
        patientName={prescriptionModal.patientName}
        onPrescriptionCreated={fetchAppointments}
      />
    </div>
  );
};

export default DoctorAppointments;
