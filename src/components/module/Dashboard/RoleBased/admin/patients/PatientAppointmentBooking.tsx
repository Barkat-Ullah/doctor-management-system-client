/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createAppointment } from "@/services/Appointment";
import { initializePayment } from "@/services/Payment";
import type { Doctor, DoctorSchedule } from "@/types/doctor.type";

interface PatientAppointmentBookingProps {
  doctor: Doctor;
}

const PatientAppointmentBooking: React.FC<PatientAppointmentBookingProps> = ({
  doctor,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [selectedSchedule, setSelectedSchedule] =
    useState<DoctorSchedule | null>(null);
  const [step, setStep] = useState<"select" | "confirm" | "payment">("select");
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Get available schedules only
  const availableSchedules =
    doctor.doctorSchedules?.filter((ds) => !ds.isBooked) || [];

  // Group schedules by date
  const schedulesByDate = availableSchedules.reduce((acc, ds) => {
    const date = new Date(ds.schedule.startDateTime).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(ds);
    return acc;
  }, {} as Record<string, DoctorSchedule[]>);

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

  const handleContinueToConfirm = () => {
    if (!selectedSchedule) {
      toast.error("Please select a schedule");
      return;
    }
    setStep("confirm");
  };

  const handleCreateAppointment = () => {
    if (!selectedSchedule) return;

    startTransition(async () => {
      try {
        const result = await createAppointment({
          doctorId: doctor.id,
          scheduleId: selectedSchedule.scheduleId,
        });

        if (result.success) {
          setAppointmentData(result.data);
          setStep("payment");
          toast.success("Appointment created successfully!");
        } else {
          toast.error(result.message || "Failed to create appointment");
        }
      } catch (error) {
        console.error("Appointment creation error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const handlePayment = () => {
    if (!appointmentData?.id) {
      toast.error("No appointment found for payment");
      return;
    }

    startTransition(async () => {
      try {
        const result = await initializePayment(appointmentData.id);

        if (result.success && result.data?.paymentUrl) {
          // Redirect to SSLCommerz payment gateway
          window.location.href = result.data.paymentUrl;
        } else {
          toast.error(result.message || "Failed to initialize payment");
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        toast.error("Something went wrong with payment. Please try again.");
      }
    });
  };

  if (!user || user.role !== "PATIENT") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground text-center mb-4">
            Only patients can book appointments.
          </p>
          <Button onClick={() => router.push("/auth/login")}>
            Login as Patient
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            Book Appointment
          </h1>
          <p className="text-muted-foreground">
            {step === "select" && "Select your preferred appointment time"}
            {step === "confirm" && "Confirm your appointment details"}
            {step === "payment" && "Complete payment to confirm appointment"}
          </p>
        </div>
      </div>

      {/* Progress Steps - Only 3 steps now */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === "select"
                ? "bg-green-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium">Select Schedule</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300"></div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === "confirm" || step === "payment"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium">Confirm</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-300"></div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === "payment"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            3
          </div>
          <span className="ml-2 text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Information Sidebar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={doctor.profilePhoto || "/placeholder.svg"}
                  alt={doctor.name}
                />
                <AvatarFallback>
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">Dr. {doctor.name}</CardTitle>
                <CardDescription className="text-base">
                  {doctor.designation}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.qualification}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.currentWorkingPlace}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{doctor.email}</span>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Consultation Fee
                </span>
                <span className="font-semibold text-green-600">
                  ${doctor.appointmentFee}
                </span>
              </div>

              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-lg text-green-600">
                  ${doctor.appointmentFee}
                </span>
              </div>
            </div>

            {/* Specialties */}
            {doctor.doctorSpecialties &&
              doctor.doctorSpecialties.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.doctorSpecialties.map((ds) => (
                        <Badge key={ds.specialtiesId} variant="secondary">
                          {ds.specialties.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === "select" && <Calendar className="h-5 w-5" />}
              {step === "confirm" && <CheckCircle className="h-5 w-5" />}
              {step === "payment" && <CreditCard className="h-5 w-5" />}
              {step === "select" && "Select Appointment Time"}
              {step === "confirm" && "Confirm Appointment"}
              {step === "payment" && "Payment"}
            </CardTitle>
            <CardDescription>
              {step === "select" && "Choose from available time slots"}
              {step === "confirm" && "Review your appointment details"}
              {step === "payment" && "Complete payment via SSLCommerz"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Schedule Selection */}
            {step === "select" && (
              <div className="space-y-4">
                {availableSchedules.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg font-medium mb-2">
                      No available slots
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The doctor doesn&apos;t have any available appointment
                      slots at the moment.
                    </p>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedSchedule?.scheduleId || ""}
                    onValueChange={(value: string) => {
                      const schedule = availableSchedules.find(
                        (s) => s.scheduleId === value
                      );
                      if (schedule) setSelectedSchedule(schedule);
                    }}
                  >
                    <div className="space-y-4">
                      {Object.entries(schedulesByDate).map(
                        ([date, schedules]) => (
                          <div key={date} className="space-y-3">
                            <h4 className="font-medium text-gray-900">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {schedules
                                .sort(
                                  (a, b) =>
                                    new Date(
                                      a.schedule.startDateTime
                                    ).getTime() -
                                    new Date(b.schedule.startDateTime).getTime()
                                )
                                .map((schedule) => {
                                  const { time } = formatDateTime(
                                    schedule.schedule.startDateTime
                                  );
                                  const endTime = formatDateTime(
                                    schedule.schedule.endDateTime
                                  ).time;

                                  return (
                                    <div
                                      key={schedule.scheduleId}
                                      className="flex items-center space-x-3"
                                    >
                                      <RadioGroupItem
                                        value={schedule.scheduleId}
                                        id={schedule.scheduleId}
                                      />
                                      <Label
                                        htmlFor={schedule.scheduleId}
                                        className="flex-1 cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <div className="font-medium">
                                              {time} - {endTime}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              Duration:{" "}
                                              {Math.round(
                                                (new Date(
                                                  schedule.schedule.endDateTime
                                                ).getTime() -
                                                  new Date(
                                                    schedule.schedule.startDateTime
                                                  ).getTime()) /
                                                  (1000 * 60)
                                              )}{" "}
                                              minutes
                                            </div>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-green-600 border-green-600"
                                          >
                                            Available
                                          </Badge>
                                        </div>
                                      </Label>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </RadioGroup>
                )}

                {availableSchedules.length > 0 && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleContinueToConfirm}
                      disabled={!selectedSchedule}
                    >
                      Continue to Confirm
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === "confirm" && selectedSchedule && (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Appointment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {
                          formatDateTime(
                            selectedSchedule.schedule.startDateTime
                          ).date
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {
                          formatDateTime(
                            selectedSchedule.schedule.startDateTime
                          ).time
                        }{" "}
                        -{" "}
                        {
                          formatDateTime(selectedSchedule.schedule.endDateTime)
                            .time
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">Dr. {doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Amount:
                      </span>
                      <span className="font-medium text-green-600">
                        ${doctor.appointmentFee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    Patient Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep("select")}>
                    Back to Schedule
                  </Button>
                  <Button
                    onClick={handleCreateAppointment}
                    disabled={isPending}
                    className="flex-1"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Appointment...
                      </>
                    ) : (
                      "Create Appointment"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === "payment" && appointmentData && (
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">
                      Payment Required
                    </h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your appointment has been created. Please complete the
                    payment to confirm your booking.
                  </p>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Appointment ID:</span>
                      <span className="font-mono">{appointmentData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Video Call ID:</span>
                      <span className="font-mono">
                        {appointmentData.videoCallingId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consultation Fee:</span>
                      <span>${doctor.appointmentFee}</span>
                    </div>

                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">
                        ${doctor.appointmentFee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-800">
                      Secure Payment with SSLCommerz
                    </h4>
                  </div>
                  <p className="text-sm text-green-700">
                    You will be redirected to SSLCommerz secure payment gateway
                    to complete your payment.
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isPending}
                  className="w-full"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting to Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${doctor.appointmentFee} with SSLCommerz
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAppointmentBooking;
