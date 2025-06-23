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
import { Calendar, Plus, Search } from "lucide-react";
import { getAllSchedule } from "@/services/Schedule";
import { toast } from "sonner";
import Link from "next/link";

interface DoctorSchedule {
  id: string;
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  doctor: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    registrationNumber: string;
  };
  schedule: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
}

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    isBooked: undefined as boolean | undefined,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getAllSchedule({
        page: pagination.page,
        limit: pagination.limit,
      });

      console.log("Schedule fetch result:", result);

      if (result.success) {
        setSchedules(result.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.meta?.total || 0,
        }));
      } else {
        toast.error(result.message || "Failed to fetch schedules");
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
  }, [pagination.page]);

  const formatDate = (dateTime: string) => {
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

  // Filter schedules based on search and booking status
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      filters.searchTerm === "" ||
      schedule.doctor.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    const matchesBooking =
      filters.isBooked === undefined || schedule.isBooked === filters.isBooked;

    return matchesSearch && matchesBooking;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage doctor appointment schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/schedule/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Search Doctor
              </label>
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
            <div>
              <label className="block text-sm font-medium mb-2">
                Booking Status
              </label>
              <select
                className="w-full p-2 border rounded-md"
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
            <div className="flex items-end">
              <Button
                onClick={() =>
                  setFilters({ searchTerm: "", isBooked: undefined })
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

      <Card>
        <CardHeader>
          <CardTitle>Doctor Schedules ({filteredSchedules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No schedules found</h3>
              <p className="text-muted-foreground mb-4">
                {schedules.length === 0
                  ? "No doctor schedules available. Doctors need to assign schedules to themselves."
                  : "No schedules match your filter criteria"}
              </p>
              <div className="flex gap-2 justify-center">
                {filters.searchTerm || filters.isBooked !== undefined ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({ searchTerm: "", isBooked: undefined })
                    }
                  >
                    Clear Filters
                  </Button>
                ) : null}
                <Link href="/dashboard/admin/schedule/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Schedule
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {schedule.doctor.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Reg: {schedule.doctor.registrationNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(schedule.schedule.startDateTime)}
                      </TableCell>
                      <TableCell>
                        {formatTime(schedule.schedule.startDateTime)}
                      </TableCell>
                      <TableCell>
                        {formatTime(schedule.schedule.endDateTime)}
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
                        <div className="text-sm">
                          <div>{schedule.doctor.email}</div>
                          <div>{schedule.doctor.contactNumber}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredSchedules.length} of {pagination.total}{" "}
                  schedules
                </p>
                <div className="flex gap-2">
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
