import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Service() {
  const services = [
    {
      title: "Consultation",
      description:
        "Book appointments with our expert doctors for in-person or virtual consultations",
      features: [
        "24/7 doctor availability",
        "Video consultations",
        "In-person appointments",
        "Follow-up care",
        "Specialist referrals",
      ],
      link: "/consultation",
    },
    {
      title: "Health Plans",
      description:
        "Comprehensive health plans for individuals and families with premium benefits",
      features: [
        "Preventive care coverage",
        "Specialist consultations",
        "Emergency services",
        "Hospitalization coverage",
        "Wellness programs",
      ],
      link: "/health-plans",
    },
    {
      title: "Medicine",
      description:
        "Order prescription and over-the-counter medications with doorstep delivery",
      features: [
        "Prescription fulfillment",
        "Doorstep delivery",
        "Automatic refills",
        "Medication reminders",
        "Pharmacist consultation",
      ],
      link: "/medicine",
    },
    {
      title: "Diagnostics",
      description:
        "Comprehensive lab tests and diagnostic services with home sample collection",
      features: [
        "Home sample collection",
        "Quick test results",
        "Digital reports",
        "Health screening packages",
        "Regular health monitoring",
      ],
      link: "/diagnostics",
    },
    {
      title: "SOPs",
      description:
        "Standard Operating Procedures for healthcare professionals and facilities",
      features: [
        "Clinical guidelines",
        "Safety protocols",
        "Quality assurance",
        "Regulatory compliance",
        "Staff training materials",
      ],
      link: "/sops",
    },
    {
      title: "Special Treatment",
      description:
        "Standard Operating Procedures for healthcare professionals and facilities",
      features: [
        "Ophthalmology",
        "Dental",
        "Orthopedics",
        "Neurology",
        "Cardiology",
      ],
      link: "/",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-6 md:py-12 bg-green-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Our Healthcare Services
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed to meet all your
              medical needs with quality and care
            </p>
          </div>
        </section>

        <section className="py-6 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card
                  key={service.title}
                  className="border-2 hover:border-green-200 transition-all"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href={service.link} className="w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Learn More
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
