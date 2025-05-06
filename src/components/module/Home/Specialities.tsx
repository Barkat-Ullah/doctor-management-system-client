import { Button } from "@/components/ui/button";
import {
  Heart,
  Brain,
  Droplets,
  Bone,
  SmileIcon as Tooth,
  Eye,
} from "lucide-react";

export default function SpecialtiesSection() {
  const specialties = [
    { name: "Cardiology", icon: Heart, color: "text-red-500" },
    { name: "Neurology", icon: Brain, color: "text-purple-500" },
    { name: "Urology", icon: Droplets, color: "text-green-500" },
    { name: "Orthopedics", icon: Bone, color: "text-amber-500" },
    { name: "Dental", icon: Tooth, color: "text-cyan-500" },
    { name: "Ophthalmology", icon: Eye, color: "text-indigo-500" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Explore Treatments across specialties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find specialized doctors across all specialties to address your
            health concerns
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {specialties.map((specialty) => (
            <div
              key={specialty.name}
              className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`mb-3 ${specialty.color}`}>
                <specialty.icon size={32} />
              </div>
              <h3 className="font-medium text-sm text-center">
                {specialty.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}
