"use client";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function HeroSection() {
  return (
    <section className="py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse md:flex-row gap-10 items-center">
          {/* Text Content */}
          <div className="space-y-6 w-full md:w-1/2 text-left">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Healthier Hearts <br />
              Come From <br />
              <span className="text-green-500">Preventive Care</span>
            </h1>
            <p className="text-gray-600 max-w-full sm:max-w-md text-base sm:text-lg">
              Empower your healthcare facility with an all-in-one doctor
              management system. Schedule appointments, manage patient records,
              and streamline your clinic operations with ease and security.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                Make Appointment
              </Button>
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Animation */}
          <div className="relative w-full md:w-1/2 h-[300px] sm:h-[400px] md:h-[480px] flex justify-center">
            <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] rounded-full bg-gray-100 overflow-hidden">
              <DotLottieReact
                className="h-full w-full"
                src="https://lottie.host/0fc3a300-0252-4f5c-9fbf-9f2031b1b9e5/HAVscCxv14.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
