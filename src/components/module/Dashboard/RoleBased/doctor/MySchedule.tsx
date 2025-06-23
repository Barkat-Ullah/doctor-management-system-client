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
import { Calendar, Search, Trash2, RefreshCw } from "lucide-react";
import { getMySchedules, removeDoctorSchedule } from "@/services/Schedule";
import type { DoctorSchedule } from "@/types/doctorSchedule";
import { toast } from "sonner";

export default function MySchedules() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
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
      const result = await getMySchedules({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      console.log("API Response:", result); // Debug করার জন্য
      console.log("Schedules Data:", result.data?.data); // Debug করার জন্য

      if (result.success) {
        setSchedules(result.data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: result.data.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching my schedules:", error);
      toast.error("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [pagination.page, filters]);

  const handleRemoveSchedule = async (scheduleId: string) => {
    try {
      const result = await removeDoctorSchedule(scheduleId);
      if (result.success) {
        toast.success("Schedule removed successfully");
        fetchSchedules();
      } else {
        toast.error(result.message || "Failed to remove schedule");
      }
    } catch (error) {
      console.error("Error removing schedule:", error);
      toast.error("Failed to remove schedule");
    }
  };

  // Improved date formatting with proper error handling
  const formatDateTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "N/A";

    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Improved time formatting with proper error handling
  const formatTime = (dateTime: string | null | undefined) => {
    if (!dateTime) return "N/A";

    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) return "Invalid Time";

      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Time formatting error:", error);
      return "Invalid Time";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Schedules</h1>
          <p className="text-muted-foreground">
            Manage your assigned schedules
          </p>
        </div>
        <Button variant="outline" onClick={fetchSchedules}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
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
                <option value="false">Available</option>
                <option value="true">Booked</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() =>
                  setFilters({
                    startDate: "",
                    endDate: "",
                    isBooked: undefined,
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

      <Card>
        <CardHeader>
          <CardTitle>My Schedules ({pagination.total})</CardTitle>
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
              <p className="text-muted-foreground">
                You haven&apos;t assigned any schedules yet
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule, index) => {
                    // Debug individual schedule data
                    console.log(`Schedule ${index}:`, schedule);
                    console.log(`Schedule.schedule:`, schedule.schedule);

                    return (
                      <TableRow
                        key={`${schedule.id}-${schedule.scheduleId}-${index}`}
                      >
                        <TableCell>
                          {formatDateTime(schedule.schedule?.startDateTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(schedule.schedule?.startDateTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(schedule.schedule?.endDateTime)}
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
                          {!schedule.isBooked && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remove Schedule
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this
                                    schedule? This will make it available for
                                    other doctors.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemoveSchedule(schedule.scheduleId)
                                    }
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} schedules
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
