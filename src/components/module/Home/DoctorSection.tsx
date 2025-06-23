"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Loader2 } from "lucide-react";
import { getAllDoctors } from "@/services/Doctors";
import type { Doctor } from "@/types/doctor.type";

export default function DoctorsSection() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    try {
      setLoading(true);
      const result = await getAllDoctors({
        limit: 3, // Only fetch 3 doctors for homepage
        sort: "-averageRating", // Sort by highest rating first
      });

      if (result.data) {
        setDoctors(result.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (doctorId: string) => {
    router.push(`/dashboard/patient/appointments/${doctorId}`);
  };

  const handleViewProfile = (doctorId: string) => {
    router.push(`/doctors/${doctorId}`);
  };

  const handleViewAllDoctors = () => {
    router.push("/doctors");
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Our Top Rated Doctors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access to the best doctors, surgeons, and specialists in the country
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Loading top doctors...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Our Top Rated Doctors
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access to the best doctors, surgeons, and specialists in the country
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No doctors available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border flex flex-col h-full"
              >
                <div className="h-60 w-full relative flex-shrink-0">
                  <Image
                    src={
                      doctor.profilePhoto ||
                      "/placeholder.svg?height=200&width=400"
                    }
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  {/* Fixed height content section */}
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg line-clamp-1">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-1">
                      {doctor.designation}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                      {doctor.qualification}
                    </p>

                    {/* Specialties - Fixed height */}
                    <div className="mt-2 h-8">
                      {doctor.doctorSpecialties &&
                        doctor.doctorSpecialties.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doctor.doctorSpecialties
                              .slice(0, 2)
                              .map((specialty, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {specialty.specialties.title}
                                </span>
                              ))}
                            {doctor.doctorSpecialties.length > 2 && (
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                +{doctor.doctorSpecialties.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Rating and Experience - Fixed height */}
                    <div className="flex items-center mt-3 mb-3 h-6">
                      <div className="flex items-center text-amber-500 mr-3">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-sm font-medium">
                          {doctor.averageRating
                            ? doctor.averageRating.toFixed(1)
                            : "0.0"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MessageCircle size={16} />
                        <span className="ml-1 text-sm">Reviews</span>
                      </div>
                      <div className="ml-auto text-sm text-gray-600">
                        {doctor.experience}+ Years
                      </div>
                    </div>

                    {/* Appointment Fee - Fixed height */}
                    <div className="mb-3 h-6">
                      <span className="text-lg font-bold text-green-600">
                        ${doctor.appointmentFee}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        consultation fee
                      </span>
                    </div>
                  </div>

                  {/* Buttons - Always at bottom */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-sm h-9"
                      onClick={() => handleBookNow(doctor.id)}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-green-600 text-green-600 hover:bg-green-50 text-sm h-9"
                      onClick={() => handleViewProfile(doctor.id)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={handleViewAllDoctors}
            >
              View All Doctors
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
