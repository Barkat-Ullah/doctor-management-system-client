"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Users,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Award,
  GraduationCap,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Doctor, Specialty } from "@/types/doctor.type";

interface PublicDoctorPageProps {
  doctors: Doctor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  specialties: Specialty[];
}

const PublicDoctorPage: React.FC<PublicDoctorPageProps> = ({
  doctors,
  meta,
  specialties,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState(() => {
    const specialtyTitle = searchParams.get("doctorSpecialties") || "";
    // Find specialty ID from title for UI state
    const specialty = specialties.find((s) => s.title === specialtyTitle);
    return specialty?.id || "";
  });
  const [selectedGender, setSelectedGender] = useState(
    searchParams.get("gender") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt");

  // Update URL with new parameters
  const updateURL = (params: Record<string, string | number | undefined>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all") {
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
    // Send specialty title to backend, not ID
    const specialtyTitle =
      value === "all"
        ? ""
        : specialties.find((s) => s.id === value)?.title || "";
    updateURL({ doctorSpecialties: specialtyTitle });
  };

  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    updateURL({ gender: value === "all" ? "" : value });
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

  const handleViewDetails = (doctor: Doctor) => {
    router.push(`/doctors/${doctor.id}`);
  };

  const getPrimarySpecialty = (doctor: Doctor) => {
    return (
      doctor.doctorSpecialties?.[0]?.specialties?.title || "General Practice"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="text-center max-w-4xl mx-auto text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Trusted Healthcare Network
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Doctor
            </h1>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Connect with qualified healthcare professionals and book
              appointments with ease.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="h-5 w-5" />
                <span className="font-semibold">{meta.total}+ Doctors</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Stethoscope className="h-5 w-5" />
                <span className="font-semibold">
                  {specialties.length}+ Specialties
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="h-5 w-5" />
                <span className="font-semibold">Verified Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Specialties & Filters */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Search */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5 text-green-600" />
                  Search Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, qualification..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-2 focus:border-green-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-green-600" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender
                  </label>
                  <Select
                    value={selectedGender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger className="border-2 focus:border-green-500">
                      <SelectValue placeholder="All Genders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="border-2 focus:border-green-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Newest First</SelectItem>
                      <SelectItem value="-createdAt">Oldest First</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="-name">Name Z-A</SelectItem>
                      <SelectItem value="experience">
                        Experience Low-High
                      </SelectItem>
                      <SelectItem value="-experience">
                        Experience High-Low
                      </SelectItem>
                      <SelectItem value="appointmentFee">
                        Fee Low-High
                      </SelectItem>
                      <SelectItem value="-appointmentFee">
                        Fee High-Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {(searchTerm ||
                  selectedSpecialty ||
                  selectedGender ||
                  sortBy !== "createdAt") && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  Medical Specialties
                </CardTitle>
                <CardDescription>
                  Choose your preferred specialty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <Button
                    variant={selectedSpecialty === "" ? "default" : "ghost"}
                    onClick={() => handleSpecialtyChange("all")}
                    className="w-full justify-start text-left h-auto p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">All Specialties</div>
                        <div className="text-xs text-gray-500">
                          {meta.total} doctors
                        </div>
                      </div>
                    </div>
                  </Button>

                  {specialties.map((specialty) => (
                    <Button
                      key={specialty.id}
                      variant={
                        selectedSpecialty === specialty.id ? "default" : "ghost"
                      }
                      onClick={() => handleSpecialtyChange(specialty.id)}
                      className="w-full justify-start text-left h-auto p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                          {specialty.icon ? (
                            <Image
                              src={specialty.icon || "/placeholder.svg"}
                              alt={specialty.title}
                              width={16}
                              height={16}
                              className="w-4 h-4"
                            />
                          ) : (
                            <Stethoscope className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {specialty.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {
                              doctors.filter((d) =>
                                d.doctorSpecialties?.some(
                                  (ds) => ds.specialtiesId === specialty.id
                                )
                              ).length
                            }{" "}
                            doctors
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Doctors */}
          <div className="flex-1 space-y-6">
            {/* Active Filters */}
            {(searchTerm ||
              selectedSpecialty ||
              selectedGender ||
              sortBy !== "createdAt") && (
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Search: {searchTerm}
                      </Badge>
                    )}
                    {selectedSpecialty && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800"
                      >
                        Specialty:{" "}
                        {
                          specialties.find((s) => s.id === selectedSpecialty)
                            ?.title
                        }
                      </Badge>
                    )}
                    {selectedGender && (
                      <Badge
                        variant="secondary"
                        className="bg-teal-100 text-teal-800"
                      >
                        Gender: {selectedGender}
                      </Badge>
                    )}
                    {sortBy !== "createdAt" && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800"
                      >
                        Sort: {sortBy}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Doctors
                </h2>
                <p className="text-gray-600">
                  Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                  doctors
                </p>
              </div>
            </div>

            {/* Doctor Cards - Single Column */}
            {doctors.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Stethoscope className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No doctors found
                  </h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    {searchTerm || selectedSpecialty || selectedGender
                      ? "Try adjusting your search criteria or filters to find more doctors."
                      : "No doctors are currently available. Please check back later."}
                  </p>
                  {(searchTerm || selectedSpecialty || selectedGender) && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="hover:bg-green-50 hover:text-green-600"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {doctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Doctor Image */}
                          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden flex-shrink-0">
                            {doctor.profilePhoto ? (
                              <Image
                                src={doctor.profilePhoto || "/placeholder.svg"}
                                alt={doctor.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, 192px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                  <GraduationCap className="h-10 w-10 text-green-600" />
                                </div>
                              </div>
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg">
                                Available Today
                              </Badge>
                            </div>

                            {/* Experience Badge */}
                            <div className="absolute bottom-3 left-3">
                              <Badge
                                variant="secondary"
                                className="bg-white/90 text-gray-800 border-0 shadow-md"
                              >
                                {doctor.experience}+ years
                              </Badge>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex-1">
                                {/* Doctor Details */}
                                <div className="mb-4">
                                  <h3 className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                    {doctor.name}
                                  </h3>
                                  <p className="text-green-600 font-semibold text-base mb-2">
                                    {getPrimarySpecialty(doctor)}
                                  </p>
                                  <p className="text-gray-600 text-sm mb-3">
                                    {doctor.qualification}
                                  </p>

                                  {/* Rating */}
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < 4
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="truncate">
                                      {doctor.currentWorkingPlace}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="font-semibold">
                                      ${doctor.appointmentFee}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                    <span>Available Now</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Award className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                    <span>Verified Doctor</span>
                                  </div>
                                </div>

                                {/* Specialties */}
                                {doctor.doctorSpecialties &&
                                  doctor.doctorSpecialties.length > 0 && (
                                    <div className="mb-4">
                                      <div className="flex flex-wrap gap-2">
                                        {doctor.doctorSpecialties
                                          .slice(0, 3)
                                          .map((ds) => (
                                            <Badge
                                              key={ds.specialtiesId}
                                              variant="outline"
                                              className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                            >
                                              {ds.specialties?.title}
                                            </Badge>
                                          ))}
                                        {doctor.doctorSpecialties.length >
                                          3 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-gray-50 text-gray-600"
                                          >
                                            +
                                            {doctor.doctorSpecialties.length -
                                              3}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>

                              {/* Action Button */}
                              <div className="flex-shrink-0">
                                <Button
                                  onClick={() => handleViewDetails(doctor)}
                                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all px-8 py-3"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPage > 1 && (
                  <Card className="shadow-lg border-0 bg-white">
                    <CardContent className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                        {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                        {meta.total} doctors
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(meta.page - 1)}
                          disabled={meta.page <= 1 || isPending}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, meta.totalPage) },
                            (_, i) => {
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
                                  variant={
                                    pageNum === meta.page
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  disabled={isPending}
                                  className={`w-10 h-10 p-0 ${
                                    pageNum === meta.page
                                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0"
                                      : "hover:bg-green-50 hover:text-green-600"
                                  }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(meta.page + 1)}
                          disabled={meta.page >= meta.totalPage || isPending}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDoctorPage;
