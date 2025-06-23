/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Plus,
  Search,
  RefreshCw,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import type { DoctorSchedule } from "@/types/doctorSchedule";
import { toast } from "sonner";
import Link from "next/link";
import { getAllDoctorSchedules } from "@/services/Schedule";

export default function AllSchedulesList() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    isBooked: undefined as boolean | undefined,
    doctorId: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getAllDoctorSchedules({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (result.success) {
        setSchedules(result.data.data);
        setPagination((prev) => ({
          ...prev,
          total: result.data.meta.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [pagination.page, filters]);

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Mobile card component for better mobile experience
  const ScheduleCard = ({ schedule }: { schedule: DoctorSchedule }) => (
    <Card className="mb-4 md:hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{schedule.doctor?.name}</h3>
            <p className="text-sm text-muted-foreground">
              Reg: {schedule.doctor?.registrationNumber}
            </p>
          </div>
          <Badge variant={schedule.isBooked ? "destructive" : "default"}>
            {schedule.isBooked ? "Booked" : "Available"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDateTime(schedule.schedule?.startDateTime || "")}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatTime(schedule.schedule?.startDateTime || "")} -{" "}
                {formatTime(schedule.schedule?.endDateTime || "")}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm mb-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{schedule.doctor?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{schedule.doctor?.contactNumber}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            All Doctor Schedules
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View all assigned doctor schedules
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={fetchSchedules}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/admin/schedules/create">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Filter Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Search Doctor</label>
              <Input
                placeholder="Search by doctor name"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Booking Status
              </label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={filters.isBooked?.toString() || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    isBooked:
                      e.target.value === ""
                        ? undefined
                        : e.target.value === "true",
                  }))
                }
              >
                <option value="">All</option>
                <option value="true">Booked</option>
                <option value="false">Available</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Doctor ID</label>
              <Input
                placeholder="Filter by doctor ID"
                value={filters.doctorId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, doctorId: e.target.value }))
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    isBooked: undefined,
                    doctorId: "",
                  })
                }
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Doctor Schedules ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No schedules found</h3>
              <p className="text-muted-foreground mb-4">
                No doctor schedules match your criteria
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="md:hidden">
                {schedules.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Doctor</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">
                        Start Time
                      </TableHead>
                      <TableHead className="min-w-[100px]">End Time</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[200px]">Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {schedule.doctor?.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Reg: {schedule.doctor?.registrationNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDateTime(
                            schedule.schedule?.startDateTime || ""
                          )}
                        </TableCell>
                        <TableCell>
                          {formatTime(schedule.schedule?.startDateTime || "")}
                        </TableCell>
                        <TableCell>
                          {formatTime(schedule.schedule?.endDateTime || "")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              schedule.isBooked ? "destructive" : "default"
                            }
                          >
                            {schedule.isBooked ? "Booked" : "Available"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {schedule.doctor?.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{schedule.doctor?.contactNumber}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} schedules
                </p>
                <div className="flex justify-center sm:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="flex-1 sm:flex-none"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={
                      pagination.page * pagination.limit >= pagination.total
                    }
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
