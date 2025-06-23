/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllAppointments } from "@/services/Appointment";

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
  };
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    designation: string;
  };
  schedule: {
    startDateTime: string;
    endDateTime: string;
  };
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const result = await getAllAppointments({
        page: currentPage,
        limit: itemsPerPage,
        ...(activeTab !== "all" && { status: activeTab.toUpperCase() }),
      });

      if (result.success) {
        const appointmentsData = result.data?.data || result.data || [];
        setAppointments(
          Array.isArray(appointmentsData) ? appointmentsData : []
        );
        setTotalPages(
          Math.ceil((result.data?.meta?.total || 0) / itemsPerPage)
        );
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
        year: "numeric",
        month: "short",
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

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const statusCounts = getStatusCounts();

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All Appointments
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage all system appointments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by patient name, doctor name, or appointment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full overflow-x-auto">
          <TabsList className="grid grid-cols-5 w-full min-w-[500px] sm:min-w-0">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs sm:text-sm">
              Scheduled ({statusCounts.scheduled})
            </TabsTrigger>
            <TabsTrigger value="inprogress" className="text-xs sm:text-sm">
              In Progress ({statusCounts.inprogress})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Completed ({statusCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="canceled" className="text-xs sm:text-sm">
              Canceled ({statusCounts.canceled})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4 sm:mt-6">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading appointments...</span>
              </CardContent>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No appointments found
                </h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm
                    ? "No appointments match your search criteria."
                    : "No appointments available."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Appointments ({filteredAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile Cards View */}
                <div className="block sm:hidden space-y-4">
                  {filteredAppointments.map((appointment) => {
                    const { date, time } = formatDateTime(
                      appointment.appointmentDateTime
                    );
                    return (
                      <Card key={appointment.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={
                                    appointment.patient.profilePhoto ||
                                    "/placeholder.svg"
                                  }
                                  alt={appointment.patient.name}
                                />
                                <AvatarFallback>
                                  {appointment.patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {appointment.patient.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {appointment.patient.email}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">
                                Doctor:
                              </span>
                              <p className="font-medium">
                                {appointment.doctor.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Date:
                              </span>
                              <p className="font-medium">{date}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Time:
                              </span>
                              <p className="font-medium">{time}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Fee:
                              </span>
                              <p className="font-medium">
                                ${appointment.appointmentFee}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {getStatusBadge(appointment.status)}
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                              {appointment.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => {
                        const { date, time } = formatDateTime(
                          appointment.appointmentDateTime
                        );
                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      appointment.patient.profilePhoto ||
                                      "/placeholder.svg"
                                    }
                                    alt={appointment.patient.name}
                                  />
                                  <AvatarFallback>
                                    {appointment.patient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">
                                    {appointment.patient.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {appointment.patient.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={
                                      appointment.doctor.profilePhoto ||
                                      "/placeholder.svg"
                                    }
                                    alt={appointment.doctor.name}
                                  />
                                  <AvatarFallback>
                                    {appointment.doctor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">
                                    {appointment.doctor.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {appointment.doctor.designation}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{date}</p>
                                <p className="text-xs text-muted-foreground">
                                  {time}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(appointment.status)}
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(appointment.paymentStatus)}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                ${appointment.appointmentFee}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAppointments;
