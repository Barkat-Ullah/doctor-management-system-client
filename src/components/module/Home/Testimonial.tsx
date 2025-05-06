"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Dummy testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    image: "https://i.ibb.co.com/Xrx7FQR4/team.jpg",
    comment:
      "The doctors here are incredibly knowledgeable and caring. I've never felt more comfortable discussing my health concerns. The online appointment system is also very convenient.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Patient",
    image: "https://i.ibb.co.com/Xrx7FQR4/team.jpg",
    comment:
      "I had a great experience with the telemedicine service. The doctor was attentive, listened to all my concerns, and provided clear explanations. The follow-up was also excellent.",
    rating: 4,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Patient",
    image: "https://i.ibb.co.com/Xrx7FQR4/team.jpg",
    comment:
      "The staff is friendly and professional. I appreciate how thorough the doctors are with their examinations and explanations. They take the time to answer all my questions.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Patient",
    image: "https://i.ibb.co.com/Xrx7FQR4/team.jpg",
    comment:
      "I've been a patient here for years and have always received excellent care. The new online portal makes managing appointments and viewing test results so much easier.",
    rating: 5,
  },
  {
    id: 5,
    name: "Sophia Patel",
    role: "Patient",
    image: "https://i.ibb.co.com/Xrx7FQR4/team.jpg",
    comment:
      "The pediatric care here is outstanding. The doctors are patient with my children and explain everything in a way that makes them comfortable. Highly recommended for families.",
    rating: 4,
  },
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoplay]);

  // Pause autoplay when user interacts with the slider
  const pauseAutoplay = () => {
    setIsAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const goToPrevious = () => {
    pauseAutoplay();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    pauseAutoplay();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    pauseAutoplay();
    setCurrentIndex(index);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious();
    }
  };

  // Calculate visible testimonials (current + next two for desktop view)
  const visibleTestimonials = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            What Our Patients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read testimonials from our patients about their experiences with our
            healthcare services
          </p>
        </div>

        {/* Mobile Slider (Single Testimonial) */}
        <div
          className="md:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Card className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-4 border-green-300 mb-4">
                  <AvatarImage
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                  />
                  <AvatarFallback>
                    {testimonials[currentIndex].name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonials[currentIndex].rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">
                  &quot;{testimonials[currentIndex].comment}&quot;
                </p>
                <h3 className="font-bold">{testimonials[currentIndex].name}</h3>
                <p className="text-sm text-gray-600">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full ${
                    currentIndex === index ? "bg-green-600" : "bg-gray-300"
                  } transition-colors`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Desktop Slider (Multiple Testimonials) */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={`border-none shadow-md transition-all duration-300 ${
                  index === 0
                    ? "opacity-100 scale-100"
                    : "opacity-80 scale-95 hover:opacity-100 hover:scale-100"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-16 w-16 border-4 border-green-300 mb-4">
                      <AvatarImage
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-4 line-clamp-4">
                      &quot;{testimonial.comment}&quot;
                    </p>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-8 rounded-full ${
                  currentIndex === index ? "bg-green-600" : "bg-gray-300"
                } transition-colors`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
