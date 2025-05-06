import Image from "next/image";
import { Award } from "lucide-react";

export default function WhyChooseUsSection() {
  const reasons = [
    {
      title: "Expert Technicians",
      description:
        "Our team includes certified experts dedicated to quality service and customer satisfaction.",
    },
    {
      title: "Quick Turnaround",
      description:
        "We value your time and ensure fast and efficient servicing for your bike.",
    },
    {
      title: "Genuine Parts",
      description:
        "We only use manufacturer-approved genuine parts for repairs and replacements.",
    },
    {
      title: "Customer Support",
      description:
        "Our dedicated support team is here to help you at every step, online or offline.",
    },
  ];

  return (
    <section className="py-12 md:py-16 container mx-auto px-4 md:px-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
        Why Choose Us
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex items-start gap-4"
            >
              <div className="bg-white p-2 rounded-lg text-green-600">
                <Award size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{reason.title}</h3>
                <p className="text-gray-600 text-sm">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative h-[400px] bg-green-100 rounded-lg overflow-hidden">
          <div className="absolute right-0 bottom-0 w-full h-full">
            <Image
              src="https://i.ibb.co.com/rR0WwsnK/why-choose-us.jpg"
              alt="Healthcare professional"
              width={500}
              height={400}
              className="object-contain object-bottom h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
