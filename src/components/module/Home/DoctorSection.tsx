"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle } from "lucide-react";
import { doctors } from "@/lib/mockData";

export default function DoctorsSection() {
  const router = useRouter();

  const handleBookNow = (doctorId: string) => {
    router.push(`/doctors/${doctorId}/book`);
  };

  const handleViewProfile = (doctorId: string) => {
    router.push(`/doctors/${doctorId}`);
  };

  const handleViewAllDoctors = () => {
    router.push("/doctors");
  };

  // Display only the first 3 doctors for the homepage
  const displayDoctors = doctors.slice(0, 3);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-60 w-full relative">
              <Image
                src={
                  doctor.profilePhoto || "/placeholder.svg?height=200&width=400"
                }
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{doctor.name}</h3>
              <p className="text-gray-600 text-sm">{doctor.designation}</p>

              <div className="flex items-center mt-2 mb-4">
                <div className="flex items-center text-amber-500 mr-3">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1 text-sm font-medium">
                    {doctor.averageRating.toFixed(1)}
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

              <div className="flex gap-2 mt-3">
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
    </section>
  );
}
