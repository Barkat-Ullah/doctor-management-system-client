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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Phone,
  MapPin,
  GraduationCap,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Building,
  Shield,
  Loader2,
} from "lucide-react";
import type { Doctor, DoctorPageProps } from "@/types/doctor.type";
import { softDeleteDoctor, deleteDoctor } from "@/services/Doctors";

const DoctorPage: React.FC<DoctorPageProps> = ({ doctors, meta }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"soft" | "hard" | null>(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get("doctorSpecialties") || ""
  );
  const [selectedGender, setSelectedGender] = useState(
    searchParams.get("gender") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt");

  // Get unique specialties for filter dropdown
  const specialties = Array.from(
    new Set(
      doctors.flatMap(
        (doctor) =>
          doctor.doctorSpecialties?.map((ds) => ds.specialties.title) || []
      )
    )
  );

  const handleViewDetails = (doctor: Doctor) => {
    router.push(`/dashboard/admin/doctors/${doctor.id}`);
  };

  const handleDelete = async (doctorId: string, type: "soft" | "hard") => {
    setDeletingId(doctorId);
    setDeleteType(type);
    startTransition(async () => {
      try {
        const result =
          type === "soft"
            ? await softDeleteDoctor(doctorId)
            : await deleteDoctor(doctorId);

        if (result.success) {
          toast.success(result.message);
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setDeletingId(null);
        setDeleteType(null);
      }
    });
  };

  const handleCreateDoctor = () => {
    router.push("/dashboard/admin/doctors/create-doctor");
  };

  const getSpecialties = (doctor: Doctor) => {
    return (
      doctor.doctorSpecialties?.map((ds) => ds.specialties.title).join(", ") ||
      "N/A"
    );
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
    updateURL({ searchTerm: value });
  };

  // Handle filter changes
  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    updateURL({ doctorSpecialties: value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURL({ sort: value });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("");
    setSelectedGender("");
    setSortBy("createdAt");
    startTransition(() => {
      router.push(window.location.pathname);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Doctor Management
          </h1>
          <p className="text-muted-foreground">
            Manage doctors and their information
          </p>
        </div>
        <Button onClick={handleCreateDoctor} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Doctor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Doctors
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doctors.filter((d) => !d.isDeleted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {meta.page} of {meta.totalPage}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or qualification..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <Select
              value={selectedSpecialty}
              onValueChange={handleSpecialtyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
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
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="-name">Name Z-A</SelectItem>
                <SelectItem value="experience">Experience Low-High</SelectItem>
                <SelectItem value="-experience">Experience High-Low</SelectItem>
                <SelectItem value="appointmentFee">Fee Low-High</SelectItem>
                <SelectItem value="-appointmentFee">Fee High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters & Clear Button */}
          {(searchTerm ||
            selectedSpecialty ||
            selectedGender ||
            sortBy !== "createdAt") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary">Search: {searchTerm}</Badge>
                )}
                {selectedSpecialty && (
                  <Badge variant="secondary">
                    Specialty: {selectedSpecialty}
                  </Badge>
                )}
                {selectedGender && (
                  <Badge variant="secondary">Gender: {selectedGender}</Badge>
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
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.designation}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(doctor)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Shield className="mr-2 h-4 w-4" />
                          Soft Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Soft Delete Doctor
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will deactivate the doctor account. This action
                            can be reversed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(doctor.id, "soft")}
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={
                              deletingId === doctor.id && deleteType === "soft"
                            }
                          >
                            {deletingId === doctor.id &&
                              deleteType === "soft" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                            Soft Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Permanently
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Permanently Delete Doctor
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the doctor account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(doctor.id, "hard")}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={
                              deletingId === doctor.id && deleteType === "hard"
                            }
                          >
                            {deletingId === doctor.id &&
                              deleteType === "hard" && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                            Delete Permanently
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
                <Phone className="mr-2 h-4 w-4" />
                {doctor.contactNumber}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {doctor.currentWorkingPlace}
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {doctor.experience} years exp.
                </Badge>
                <span className="text-sm font-medium">
                  ${doctor.appointmentFee}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Specialties: </span>
                {getSpecialties(doctor)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>A list of all doctors in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={doctor.profilePhoto}
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
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doctor.designation}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {doctor.currentWorkingPlace}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{doctor.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {doctor.contactNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <span className="text-sm">{getSpecialties(doctor)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{doctor.experience} years</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${doctor.appointmentFee}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={doctor.isDeleted ? "destructive" : "default"}
                    >
                      {doctor.isDeleted ? "Inactive" : "Active"}
                    </Badge>
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
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(doctor)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Soft Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Soft Delete Doctor
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will deactivate the doctor account. This
                                action can be reversed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(doctor.id, "soft")}
                                className="bg-orange-600 hover:bg-orange-700"
                                disabled={
                                  deletingId === doctor.id &&
                                  deleteType === "soft"
                                }
                              >
                                {deletingId === doctor.id &&
                                  deleteType === "soft" && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                Soft Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Permanently
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Permanently Delete Doctor
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the doctor account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(doctor.id, "hard")}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={
                                  deletingId === doctor.id &&
                                  deleteType === "hard"
                                }
                              >
                                {deletingId === doctor.id &&
                                  deleteType === "hard" && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                Delete Permanently
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
      {meta.totalPage > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              doctors
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
                {Array.from({ length: Math.min(5, meta.totalPage) }, (_, i) => {
                  let pageNum;
                  if (meta.totalPage <= 5) {
                    pageNum = i + 1;
                  } else if (meta.page <= 3) {
                    pageNum = i + 1;
                  } else if (meta.page >= meta.totalPage - 2) {
                    pageNum = meta.totalPage - 4 + i;
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
                disabled={meta.page >= meta.totalPage || isPending}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {doctors.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedSpecialty || selectedGender
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first doctor profile."}
            </p>
            {!(searchTerm || selectedSpecialty || selectedGender) && (
              <Button onClick={handleCreateDoctor}>
                <Plus className="mr-2 h-4 w-4" />
                Create Doctor
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorPage;
