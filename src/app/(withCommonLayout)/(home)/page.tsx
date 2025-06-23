import BmiCalculator from "@/components/module/Home/Bmi";
import WhyChooseUsSection from "@/components/module/Home/ChooseUs";
import DoctorsSection from "@/components/module/Home/DoctorSection";
import FAQSection from "@/components/module/Home/Faq";
import FeaturedBlogs from "@/components/module/Home/FeaturedBlogs";
import HeroSection from "@/components/module/Home/HeroSection";
import SpecialtiesSection from "@/components/module/Home/Specialities";
import StatsSection from "@/components/module/Home/StateSection";
import StepsSection from "@/components/module/Home/StepSection";
import TestimonialSlider from "@/components/module/Home/Testimonial";
// import VideoSection from "@/components/module/Home/Video";
import NMContainer from "@/components/ui/core/NContainer";
import React from "react";

const HomePage = () => {
  return (
    <NMContainer>
      <HeroSection />
      <SpecialtiesSection />
      <DoctorsSection />
      <BmiCalculator />
      <WhyChooseUsSection />
      <StepsSection />
      {/* <VideoSection /> */}
      <FeaturedBlogs />
      <StatsSection />
      <FAQSection />
      <TestimonialSlider />
    </NMContainer>
  );
};

export default HomePage;
