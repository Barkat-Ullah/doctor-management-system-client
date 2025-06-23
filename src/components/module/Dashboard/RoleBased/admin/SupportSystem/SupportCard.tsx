"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Phone,
  Mail,
} from "lucide-react";
import type { SupportRequest, UpdateSupportRequestData } from "@/types/support";
import { SupportStatus } from "@/types/support";
import { updateSupport, deleteSupport } from "@/services/supportForm/index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const updateSupportSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  assignedToStaff: z.string().optional(),
  responseNotes: z.string().optional(),
});

type UpdateSupportFormValues = z.infer<typeof updateSupportSchema>;

interface SupportCardProps {
  supportRequests: SupportRequest[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

const SupportCard: React.FC<SupportCardProps> = ({ supportRequests, meta }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<SupportRequest | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("patientName") || ""
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("status") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );

  const form = useForm<UpdateSupportFormValues>({
    resolver: zodResolver(updateSupportSchema),
    defaultValues: {
      status: "PENDING",
      assignedToStaff: "",
      responseNotes: "",
    },
  });

  const getStatusColor = (status: SupportStatus) => {
    switch (status) {
      case SupportStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case SupportStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case SupportStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      case SupportStatus.CLOSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: SupportStatus) => {
    switch (status) {
      case SupportStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case SupportStatus.IN_PROGRESS:
        return <Loader2 className="h-4 w-4" />;
      case SupportStatus.RESOLVED:
        return <CheckCircle className="h-4 w-4" />;
      case SupportStatus.CLOSED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getQueryTypeColor = (queryType: string) => {
    const colors: Record<string, string> = {
      appointment: "bg-blue-100 text-blue-800",
      treatment: "bg-green-100 text-green-800",
      medication: "bg-purple-100 text-purple-800",
      billing: "bg-orange-100 text-orange-800",
      portal: "bg-indigo-100 text-indigo-800",
      app: "bg-pink-100 text-pink-800",
      website: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[queryType] || "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        const result = await deleteSupport(id);

        if (result.success) {
          toast.success(
            result.message || "Support request deleted successfully!"
          );
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          toast.error(result.message || "Failed to delete support request");
        }
      } catch (error) {
        console.error("Error deleting support request:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleEdit = (request: SupportRequest) => {
    setEditingRequest(request);
    form.reset({
      status: request.status,
      assignedToStaff: request.assignedToStaff || "",
      responseNotes: request.responseNotes || "",
    });
    setIsEditDialogOpen(true);
  };

  const onUpdateSubmit = async (data: UpdateSupportFormValues) => {
    if (!editingRequest) return;

    startTransition(async () => {
      try {
        // Convert string status to enum
        const updateData: UpdateSupportRequestData = {
          status: data.status as SupportStatus,
          assignedToStaff: data.assignedToStaff,
          responseNotes: data.responseNotes,
        };

        const result = await updateSupport(editingRequest.id, updateData);

        if (result.success) {
          toast.success(
            result.message || "Support request updated successfully!"
          );
          setIsEditDialogOpen(false);
          setEditingRequest(null);
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          toast.error(result.message || "Failed to update support request");
        }
      } catch (error) {
        console.error("Error updating support request:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  // Update URL with new parameters
  const updateURL = (params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(params).some((key) => key !== "page")) {
      newSearchParams.set("page", "1");
    }

    startTransition(() => {
      router.push(`?${newSearchParams.toString()}`);
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ patientName: value });
  };

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateURL({ status: value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL({ sortBy: value });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSortBy("createdAt");
    startTransition(() => {
      router.push(window.location.pathname);
    });
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Support Requests
          </h1>
          <p className="text-muted-foreground">
            Manage patient support requests and queries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportRequests.filter(
                  (r) => r.status === SupportStatus.PENDING
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportRequests.filter(
                  (r) => r.status === SupportStatus.IN_PROGRESS
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                supportRequests.filter(
                  (r) => r.status === SupportStatus.RESOLVED
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest First</SelectItem>
                <SelectItem value="-createdAt">Oldest First</SelectItem>
                <SelectItem value="patientName">Name A-Z</SelectItem>
                <SelectItem value="-patientName">Name Z-A</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters & Clear Button */}
          {(searchTerm || selectedStatus || sortBy !== "createdAt") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary">Search: {searchTerm}</Badge>
                )}
                {selectedStatus && (
                  <Badge variant="secondary">Status: {selectedStatus}</Badge>
                )}
                {sortBy !== "createdAt" && (
                  <Badge variant="secondary">Sort: {sortBy}</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {supportRequests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{request.patientName}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={getQueryTypeColor(request.queryType)}
                  >
                    {request.queryType}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(request)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Support Request
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the support request.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(request.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletingId === request.id}
                          >
                            {deletingId === request.id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {request.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                {request.phone}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {request.issueDescription}
              </p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>All Support Requests</CardTitle>
          <CardDescription>
            A list of all patient support requests in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Query Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{request.patientName}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.phone}
                      </div>
                      {request.patientId && (
                        <div className="text-xs text-muted-foreground">
                          ID: {request.patientId}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getQueryTypeColor(request.queryType)}
                    >
                      {request.queryType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="text-sm line-clamp-2">
                        {request.issueDescription}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(request)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Support Request
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the support request.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(request.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={deletingId === request.id}
                              >
                                {deletingId === request.id && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              requests
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1 || isPending}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (meta.page <= 3) {
                    pageNum = i + 1;
                  } else if (meta.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = meta.page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === meta.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isPending}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= totalPages || isPending}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Support Request</DialogTitle>
            <DialogDescription>
              Update the status and add response notes for this support request.
            </DialogDescription>
          </DialogHeader>
          {editingRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <label className="text-sm font-medium">Patient Name</label>
                  <p className="text-sm">{editingRequest.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Query Type</label>
                  <p className="text-sm">{editingRequest.queryType}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">
                    Issue Description
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {editingRequest.issueDescription}
                  </p>
                </div>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onUpdateSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assignedToStaff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To Staff (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Staff member name or ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responseNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any response notes or resolution details..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Request
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {supportRequests.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No support requests found
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedStatus
                ? "Try adjusting your search or filter criteria."
                : "No support requests have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportCard;
