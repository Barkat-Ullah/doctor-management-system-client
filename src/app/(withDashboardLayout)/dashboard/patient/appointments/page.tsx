"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Calendar,
  Video,
  Star,
  MapPin,
  Stethoscope,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { getMyAppointments } from "@/services/Appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewModal from "@/components/module/Review/ReviewModal";

interface Appointment {
  id: string;
  appointmentDateTime: string;
  appointmentFee: number;
  paymentStatus: "PAID" | "UNPAID";
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELLED";
  videoCallingId: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    designation: string;
    qualification: string;
    currentWorkingPlace: string;
    contactNumber: string;
    appointmentFee: number;
    doctorSpecialties?: Array<{
      specialties: {
        title: string;
      };
    }>;
  };
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  };
}

const PatientAppointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    appointmentId: string;
  }>({
    isOpen: false,
    appointmentId: "",
  });
  const [activeTab, setActiveTab] = useState("all");

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
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "INPROGRESS":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
        );
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "CANCELED":
        return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    return paymentStatus === "PAID" ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Paid
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Unpaid
      </Badge>
    );
  };

  const handleJoinCall = (videoCallingId: string) => {
    router.push(`/dashboard/patient/video-call/${videoCallingId}`);
  };

  const handleReview = (appointmentId: string) => {
    setReviewModal({
      isOpen: true,
      appointmentId,
    });
  };

  const handleReviewSubmitted = () => {
    fetchAppointments(); // Refresh appointments to show updated review status
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
        return appointments.filter((apt) => apt.status === "CANCELLED");
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
      canceled: appointments.filter((apt) => apt.status === "CANCELLED").length,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading appointments...</span>
        </div>
      </div>
    );
  }

  const paidAppointments = appointments.filter(
    (appointment) => appointment.paymentStatus === "PAID"
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground">
          Manage your scheduled appointments and join video calls
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Total appointments: {appointments.length} | Paid appointments:{" "}
          {paidAppointments.length}
        </p>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({getStatusCounts().all})</TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({getStatusCounts().scheduled})
          </TabsTrigger>
          <TabsTrigger value="inprogress">
            In Progress ({getStatusCounts().inprogress})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getStatusCounts().completed})
          </TabsTrigger>
          <TabsTrigger value="canceled">
            Canceled ({getStatusCounts().canceled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Appointments List */}
          {getFilteredAppointments().length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No {activeTab === "all" ? "" : activeTab} appointments found
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  {activeTab === "all"
                    ? "You haven't booked any appointments yet."
                    : `No appointments with ${activeTab} status.`}
                </p>
                {activeTab === "all" && (
                  <Button
                    onClick={() => router.push("/dashboard/patient/doctors")}
                  >
                    Find Doctors
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {getFilteredAppointments().map((appointment) => {
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

                const canReview =
                  appointment.status === "COMPLETED" &&
                  appointment.paymentStatus === "PAID" &&
                  !appointment.review;

                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage
                              src={
                                appointment.doctor?.profilePhoto ||
                                "/placeholder.svg"
                              }
                              alt={appointment.doctor?.name || "Doctor"}
                            />
                            <AvatarFallback>
                              {appointment.doctor?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "DR"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">
                              Dr. {appointment.doctor?.name || "Unknown Doctor"}
                            </CardTitle>
                            <p className="text-muted-foreground">
                              {appointment.doctor?.designation || "Doctor"}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              {getStatusBadge(appointment.status)}
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                              {appointment.review && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Reviewed
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Appointment ID
                          </p>
                          <p className="font-mono text-sm">{appointment.id}</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Doctor Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.doctor?.qualification ||
                                "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.doctor?.currentWorkingPlace ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.doctor?.contactNumber ||
                                "Not available"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {appointment.doctor?.email || "Not available"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Specialties */}
                      {appointment.doctor?.doctorSpecialties &&
                        appointment.doctor.doctorSpecialties.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                              {appointment.doctor.doctorSpecialties.map(
                                (ds, index) => (
                                  <Badge key={index} variant="secondary">
                                    {ds.specialties.title}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <Separator />

                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Appointment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Date:
                              </span>
                              <span className="font-medium">{date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Time:
                              </span>
                              <span className="font-medium">
                                {scheduleStart.time} - {scheduleEnd.time}
                              </span>
                            </div>
                            {appointment.schedule?.startDateTime &&
                              appointment.schedule?.endDateTime && (
                                <div className="flex justify-between">
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
                                    minutes
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Fee:
                              </span>
                              <span className="font-medium">
                                $
                                {appointment.appointmentFee ||
                                  appointment.doctor?.appointmentFee ||
                                  0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Video Call ID:
                              </span>
                              <span className="font-mono text-xs">
                                {appointment.videoCallingId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Show existing review if available */}
                      {appointment.review && (
                        <>
                          <Separator />
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium flex items-center gap-2 mb-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              Your Review
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= appointment.review!.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm font-medium">
                                {appointment.review.rating}/5
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {appointment.review.comment}
                            </p>
                          </div>
                        </>
                      )}

                      <Separator />

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button
                          onClick={() =>
                            handleJoinCall(appointment.videoCallingId)
                          }
                          className="flex-1"
                          disabled={
                            appointment.status === "COMPLETED" ||
                            appointment.status === "CANCELLED" ||
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
                          onClick={() => handleReview(appointment.id)}
                          className="flex-1"
                          disabled={!canReview}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {appointment.review ? "Reviewed" : "Review"}
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

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, appointmentId: "" })}
        appointmentId={reviewModal.appointmentId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default PatientAppointments;
