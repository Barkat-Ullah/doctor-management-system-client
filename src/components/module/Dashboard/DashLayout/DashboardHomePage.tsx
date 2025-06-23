"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  FileText,
  User,
  Users,
  Stethoscope,
  Heart,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  fetchDashboardMetaData,
  type DashboardMetaData,
} from "@/services/Meta";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardPage() {
  const { user } = useUser();
  const [metaData, setMetaData] = useState<DashboardMetaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMetaData();
    }
  }, [user]);

  const fetchMetaData = async () => {
    try {
      const result = await fetchDashboardMetaData();
      if (result.success && result.data) {
        setMetaData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching meta data:", error);
      toast.error("Something went wrong while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Different dashboard stats based on user role
  const getDashboardStats = (role: string, data: DashboardMetaData) => {
    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return [
          {
            title: "Total Appointments",
            value: data.appointmentCount?.toString() || "0",
            icon: Calendar,
            color: "bg-blue-100 text-blue-700",
          },
          {
            title: "Total Patients",
            value: data.patientCount?.toString() || "0",
            icon: Users,
            color: "bg-green-100 text-green-700",
          },
          {
            title: "Total Doctors",
            value: data.doctorCount?.toString() || "0",
            icon: Stethoscope,
            color: "bg-purple-100 text-purple-700",
          },
          {
            title: "Total Revenue",
            value: `$${data.totalRevenue?._sum?.amount || 0}`,
            icon: DollarSign,
            color: "bg-yellow-100 text-yellow-700",
          },
        ];
      case "DOCTOR":
        return [
          {
            title: "Total Appointments",
            value: data.appointmentCount?.toString() || "0",
            icon: Calendar,
            color: "bg-blue-100 text-blue-700",
          },
          {
            title: "Total Patients",
            value: data.patientCount?.toString() || "0",
            icon: Users,
            color: "bg-green-100 text-green-700",
          },
          {
            title: "Total Reviews",
            value: data.reviewCount?.toString() || "0",
            icon: Heart,
            color: "bg-purple-100 text-purple-700",
          },
          {
            title: "Total Revenue",
            value: `$${data.totalRevenue?._sum?.amount || 0}`,
            icon: DollarSign,
            color: "bg-pink-100 text-pink-700",
          },
        ];
      case "PATIENT":
        return [
          {
            title: "My Appointments",
            value: data.appointmentCount?.toString() || "0",
            icon: Calendar,
            color: "bg-blue-100 text-blue-700",
          },
          {
            title: "My Prescriptions",
            value: data.prescriptionCount?.toString() || "0",
            icon: FileText,
            color: "bg-green-100 text-green-700",
          },
          {
            title: "My Reviews",
            value: data.reviewCount?.toString() || "0",
            icon: Heart,
            color: "bg-purple-100 text-purple-700",
          },
          {
            title: "Health Score",
            value: "85%",
            icon: TrendingUp,
            color: "bg-pink-100 text-pink-700",
          },
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  const stats = metaData ? getDashboardStats(user.role, metaData) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.name}!
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your{" "}
          {user.role.toLowerCase().replace("_", " ")} dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart - Appointment Status Distribution */}
        {(metaData?.pieCharData ||
          metaData?.formattedAppointmentStatusDistribution) && (
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={
                      metaData.pieCharData ||
                      metaData.formattedAppointmentStatusDistribution
                    }
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count, percent }) =>
                      `${status}: ${count} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(
                      metaData.pieCharData ||
                      metaData.formattedAppointmentStatusDistribution ||
                      []
                    ).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Bar Chart - Monthly Appointments (Admin/Super Admin only) */}
        {metaData?.barChartData &&
          (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metaData.barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      }
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === "PATIENT" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm">
                      Your prescription was updated yesterday
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-sm">Lab results uploaded by Dr. Smith</p>
                  </div>
                </>
              )}

              {user.role === "DOCTOR" && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm">
                      You updated Sarah Johnson&apos;s prescription
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-sm">New referral from Dr. Martinez</p>
                  </div>
                </>
              )}

              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm">
                      New doctor registration: Dr. Emily Chen
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-sm">
                      System update scheduled for next week
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {user.role === "PATIENT" ? "Quick Actions" : "To-Do Items"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === "PATIENT" && (
                <>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <p className="text-sm">Schedule a new appointment</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="text-sm">View your lab results</p>
                  </div>
                </>
              )}

              {user.role === "DOCTOR" && (
                <>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mr-3">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="text-sm">Review 3 pending lab results</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center mr-3">
                      <User className="h-4 w-4" />
                    </div>
                    <p className="text-sm">Follow up with patient #4587</p>
                  </div>
                </>
              )}

              {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="text-sm">
                      Approve 5 user registration requests
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-3">
                      <Activity className="h-4 w-4" />
                    </div>
                    <p className="text-sm">Review monthly system report</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
