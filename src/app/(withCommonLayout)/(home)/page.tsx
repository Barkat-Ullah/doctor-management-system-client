import WhyChooseUsSection from "@/components/module/Home/ChooseUs";
import DoctorsSection from "@/components/module/Home/DoctorSection";
import HeroSection from "@/components/module/Home/HeroSection";
import SpecialtiesSection from "@/components/module/Home/Specialities";
import StatsSection from "@/components/module/Home/StateSection";
import StepsSection from "@/components/module/Home/StepSection";
import TestimonialSlider from "@/components/module/Home/Testimonial";
import NMContainer from "@/components/ui/core/NContainer";
import React from "react";

const HomePage = () => {
  return (
    <NMContainer>
      <HeroSection />
      <SpecialtiesSection />
      <DoctorsSection />
      <WhyChooseUsSection />
      <StepsSection />
      <StatsSection />
      <TestimonialSlider />
    </NMContainer>
  );
};

export default HomePage;
