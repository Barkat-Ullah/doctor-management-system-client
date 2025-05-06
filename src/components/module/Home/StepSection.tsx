import Image from "next/image";
import { Search, UserCheck, Calendar, CheckCircle } from "lucide-react";

export default function StepsSection() {
  const steps = [
    {
      icon: Search,
      title: "Search Doctor",
      description:
        "Find your doctor with filters based on your health concerns",
    },
    {
      icon: UserCheck,
      title: "Check Doctor Profile",
      description: "Check doctor experience, patient reviews, and success rate",
    },
    {
      icon: Calendar,
      title: "Schedule Appointment",
      description: "Select your convenient date and time for appointment",
    },
    {
      icon: CheckCircle,
      title: "Get Your Solution",
      description: "Get proper treatment and prescriptions for your health",
    },
  ];

  return (
    <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
      <div className="text-center mb-10">
        <h3 className="text-green-600 font-medium mb-2">How It Works</h3>
        <h2 className="text-2xl md:text-3xl font-bold">
          4 Easy Steps to Get Your Solution
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          We provide the most efficient process to get your health solutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative h-[350px] order-2 lg:order-1">
          <div className="absolute left-0 bottom-0 w-full h-full">
            <Image
              src="https://i.ibb.co.com/WvyW5bhG/how-it-works-img.png"
              alt="Doctor with medical equipment"
              width={450}
              height={350}
              className="object-contain object-bottom"
            />
          </div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-green-500 rounded-full"></div>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="bg-green-100 rounded-lg p-3 h-12 w-12 flex items-center justify-center text-green-600 shrink-0">
                <step.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
