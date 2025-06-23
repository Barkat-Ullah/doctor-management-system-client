"use client";

import type React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// FAQ data
const faqs = [
  {
    question: "How do I schedule an appointment?",
    answer:
      "You can schedule an appointment through our website by logging into your account and selecting your preferred doctor, date, and time. Alternatively, you can call our customer service at (123) 456-7890 for assistance.",
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept most major insurance plans including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact our billing department for specific questions about your insurance coverage.",
  },
  {
    question: "How do I access my medical records?",
    answer:
      "You can access your medical records by logging into your patient portal. If you haven't set up your portal account yet, please contact our office or register on our website. For assistance, call our support team.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer:
      "Please bring your government-issued photo ID, insurance card, list of current medications, medical history information, and any relevant medical records or test results from previous healthcare providers.",
  },
  {
    question: "Do you offer telehealth services?",
    answer:
      "Yes, we offer telehealth services for many types of appointments. You can schedule a virtual visit through our website or by calling our office. Telehealth visits are conducted through our secure video platform.",
  },
  {
    question: "How do I refill my prescription?",
    answer:
      "You can request prescription refills through your patient portal, by calling our pharmacy line at (123) 456-7891, or by contacting your pharmacy directly. Please allow 48-72 hours for processing.",
  },
  {
    question: "What are your office hours?",
    answer:
      "Our standard office hours are Monday through Friday from 8:00 AM to 5:00 PM. Some locations offer extended hours and weekend appointments. Please check your specific location's hours on our website.",
  },
  {
    question: "How do I pay my bill?",
    answer:
      "You can pay your bill online through our patient portal, by mail, or in person at any of our locations. We accept credit cards, checks, and cash payments. Payment plans are also available.",
  },
];

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredFaqs(faqs);
      return;
    }

    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredFaqs(filtered);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our healthcare services
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search questions..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Search
            </Button>
          </form>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-green-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No matching questions found. Please try a different search term.
              </p>
            </div>
          )}
        </div>

        {/* Contact section */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">
            Can&apos;t find what you&apos;re looking for? Contact our support
            team.
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
}
