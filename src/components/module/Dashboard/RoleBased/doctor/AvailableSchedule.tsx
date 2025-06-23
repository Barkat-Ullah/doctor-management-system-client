/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Search, Plus } from "lucide-react";
import {
  assignSchedulesToDoctor,
  getAvailableSchedules,
} from "@/services/Schedule";
import type { Schedule } from "@/types/schedule";
import { toast } from "sonner";

export default function AvailableSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const result = await getAvailableSchedules({
        ...filters,
        limit: 50, // Show more schedules for selection
      });

      if (result.success) {
        setSchedules(result.data.data);
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
  }, [filters]);
  console.log(schedules);

  const handleScheduleSelect = (scheduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedSchedules((prev) => [...prev, scheduleId]);
    } else {
      setSelectedSchedules((prev) => prev.filter((id) => id !== scheduleId));
    }
  };

  const handleAssignSchedules = async () => {
    if (selectedSchedules.length === 0) {
      toast.error("Please select at least one schedule");
      return;
    }

    try {
      setAssigning(true);
      const result = await assignSchedulesToDoctor(selectedSchedules);

      if (result.success) {
        toast.success(
          `Successfully assigned ${selectedSchedules.length} schedules`
        );
        setSelectedSchedules([]);
        fetchSchedules(); // Refresh to remove assigned schedules
      } else {
        toast.error(result.message || "Failed to assign schedules");
      }
    } catch (error) {
      console.error("Error assigning schedules:", error);
      toast.error("Failed to assign schedules");
    } finally {
      setAssigning(false);
    }
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupSchedulesByDate = (schedules: Schedule[]) => {
    const grouped: { [key: string]: Schedule[] } = {};
    schedules?.forEach((schedule) => {
      const date = new Date(schedule.startDateTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate(schedules);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Available Schedules</h1>
          <p className="text-muted-foreground">
            Select schedules to assign to yourself
          </p>
        </div>
        {selectedSchedules.length > 0 && (
          <Button onClick={handleAssignSchedules} disabled={assigning}>
            <Plus className="h-4 w-4 mr-2" />
            {assigning
              ? "Assigning..."
              : `Assign ${selectedSchedules.length} Schedule(s)`}
          </Button>
        )}
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
            <div className="flex items-end">
              <Button
                onClick={() => setFilters({ startDate: "", endDate: "" })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : Object.keys(groupedSchedules).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No available schedules</h3>
            <p className="text-muted-foreground">
              All schedules have been assigned or no schedules exist
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <Badge variant="secondary">{daySchedules.length} slots</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedSchedules.includes(schedule.id)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Checkbox
                          checked={selectedSchedules.includes(schedule.id)}
                          onCheckedChange={(checked) =>
                            handleScheduleSelect(
                              schedule.id,
                              checked as boolean
                            )
                          }
                        />
                        <Clock className="h-3 w-3" />
                      </div>
                      <div className="text-sm font-medium">
                        {formatTime(schedule.startDateTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(schedule.endDateTime)}
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        Available
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
