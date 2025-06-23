"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  Video,
  Users,
  Siren,
  FlaskConical,
  Stethoscope,
  Brain,
  Heart,
  Pill,
} from "lucide-react";

// Extended services data with more details
const extendedServices = [
  {
    id: "sv1",
    title: "Online Consultation",
    description:
      "Connect with doctors from the comfort of your home via video calls",
    icon: "Video",
    category: "consultation",
    features: [
      "24/7 doctor availability",
      "Video consultations",
      "Secure platform",
      "Digital prescriptions",
      "Follow-up messaging",
    ],

    image: "https://i.ibb.co/5gVCJxwM/10315317.jpg",
  },
  {
    id: "sv2",
    title: "In-Person Visits",
    description: "Schedule face-to-face appointments with our specialists",
    icon: "Users",
    category: "consultation",
    features: [
      "Physical examination",
      "Same-day appointments",
      "Direct specialist referrals",
      "Immediate treatment",
      "Comprehensive care",
    ],

    image: "https://i.ibb.co/d0T25pVT/3046744.jpg",
  },
  {
    id: "sv3",
    title: "Emergency Care",
    description: "24/7 emergency medical services for urgent health concerns",
    icon: "Siren",
    category: "emergency",
    features: [
      "Immediate attention",
      "Critical care specialists",
      "Advanced life support",
      "Trauma care",
      "Ambulance services",
    ],
    price: "Insurance covered",
    image:
      "https://i.ibb.co/B5F3vXWm/2302-q702-016-F-m005-c7-first-aid-color-set.jpg",
  },
  {
    id: "sv4",
    title: "Lab Tests",
    description: "Comprehensive diagnostic tests with quick results",
    icon: "FlaskConical",
    category: "diagnostics",
    features: [
      "Home sample collection",
      "Quick test results",
      "Digital reports",
      "Health screening packages",
      "Regular health monitoring",
    ],

    image: "https://i.ibb.co/VYN0QtD0/5449668.jpg",
  },
  {
    id: "sv5",
    title: "Health Check-ups",
    description: "Comprehensive health assessments and preventive screenings",
    icon: "Stethoscope",
    category: "preventive",
    features: [
      "Full body check-up",
      "Preventive screenings",
      "Personalized health reports",
      "Doctor consultation",
      "Follow-up recommendations",
    ],

    image: "https://i.ibb.co/qGmXMrd/9045622.jpg",
  },
  {
    id: "sv6",
    title: "Mental Health Services",
    description: "Professional support for mental health and wellbeing",
    icon: "Brain",
    category: "specialized",
    features: [
      "Psychiatric evaluation",
      "Therapy sessions",
      "Medication management",
      "Support groups",
      "Stress management",
    ],

    image:
      "https://i.ibb.co/F4nhkMpC/2210-i402-043-F-m004-c9-Open-mind-psychotherapy-flat-background.jpg",
  },
  {
    id: "sv7",
    title: "Cardiac Care",
    description:
      "Specialized care for heart conditions and cardiovascular health",
    icon: "Heart",
    category: "specialized",
    features: [
      "ECG and stress tests",
      "Cardiac imaging",
      "Heart disease management",
      "Rehabilitation programs",
      "Preventive cardiology",
    ],

    image: "https://i.ibb.co/SXFD0Bcg/5821152.jpg",
  },
  {
    id: "sv8",
    title: "Pharmacy Services",
    description: "Prescription fulfillment and medication management",
    icon: "Pill",
    category: "pharmacy",
    features: [
      "Prescription fulfillment",
      "Doorstep delivery",
      "Automatic refills",
      "Medication reminders",
      "Pharmacist consultation",
    ],
    price: "Varies",
    image: "https://i.ibb.co/Xrz6Q0nD/2557165.jpg",
  },
];

// Map of service icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serviceIcons: Record<string, any> = {
  Video: Video,
  Users: Users,
  Siren: Siren,
  FlaskConical: FlaskConical,
  Stethoscope: Stethoscope,
  Brain: Brain,
  Heart: Heart,
  Pill: Pill,
};

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleServiceDetails = (serviceId: string) => {
    router.push(`/services/${serviceId}`);
  };

  // Filter services based on search term and active tab
  const filteredServices = extendedServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeTab === "all" || service.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Our Healthcare Services
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your
              medical needs with quality and care
            </p>
            <div className="mt-8 max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="consultation">Consultation</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
                <TabsTrigger value="preventive">Preventive</TabsTrigger>
                <TabsTrigger value="specialized">Specialized</TabsTrigger>
                <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => {
                    const IconComponent = serviceIcons[service.icon] || Video;

                    return (
                      <Card
                        key={service.id}
                        className="border-2 hover:border-green-200 transition-all flex flex-col"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <CardTitle className="text-xl">
                              {service.title}
                            </CardTitle>
                          </div>
                          <CardDescription>
                            {service.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                            <Image
                              src={
                                service.image ||
                                "/placeholder.svg?height=200&width=300"
                              }
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          </div>
                          <ul className="space-y-2">
                            {service.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="font-bold text-green-600">
                              {service.price}
                            </span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 mt-auto">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleServiceDetails(service.id)}
                          >
                            Learn More
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Getting the healthcare you need is simple and straightforward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Choose a Service</h3>
                <p className="text-gray-600">
                  Browse our comprehensive range of healthcare services and
                  select the one that meets your needs
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Book an Appointment</h3>
                <p className="text-gray-600">
                  Schedule an appointment at your convenience, either online or
                  through our customer service
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Receive Quality Care</h3>
                <p className="text-gray-600">
                  Get professional healthcare services from our experienced
                  medical staff and specialists
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-green-600 text-white rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Need a Custom Healthcare Solution?
                  </h2>
                  <p className="mb-6">
                    Our team can create personalized healthcare plans tailored
                    to your specific needs. Contact us to discuss your
                    requirements.
                  </p>
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    Contact Us
                  </Button>
                </div>
                <div className="relative w-full h-[200px]">
                  <Image
                    src="https://i.ibb.co/qGmXMrd/9045622.jpg"
                    alt="Custom healthcare solutions"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
