/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
// Extended services data with more details (same as in services/page.tsx)
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
    longDescription:
      "Our online consultation service allows you to connect with qualified healthcare professionals from the comfort of your home. Through secure video calls, you can discuss your health concerns, receive diagnoses, and get prescriptions without the need to visit a clinic in person. This service is ideal for non-emergency medical issues, follow-up appointments, and routine consultations.",
    benefits: [
      "Save time and avoid travel",
      "Access healthcare from anywhere",
      "Reduce exposure to other illnesses",
      "Convenient scheduling options",
      "Same quality care as in-person visits",
    ],
    faqs: [
      {
        question: "How do I schedule an online consultation?",
        answer:
          "You can schedule an online consultation through our website or mobile app. Simply select the service, choose a doctor, and pick an available time slot that works for you.",
      },
      {
        question: "What technology do I need for a video consultation?",
        answer:
          "You'll need a device with a camera and microphone (smartphone, tablet, or computer) and a stable internet connection. Our platform works on most modern web browsers without requiring additional software.",
      },
      {
        question:
          "Can doctors prescribe medication during online consultations?",
        answer:
          "Yes, doctors can prescribe medications during online consultations when appropriate. Prescriptions will be sent electronically to your preferred pharmacy or delivered to your home.",
      },
    ],
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
    longDescription:
      "Our in-person visits provide comprehensive face-to-face consultations with healthcare specialists. These appointments allow for thorough physical examinations, immediate treatments, and personalized care plans. Our modern facilities are equipped with the latest medical technology to ensure accurate diagnoses and effective treatments.",
    benefits: [
      "Thorough physical examinations",
      "Immediate medical attention",
      "Access to advanced medical equipment",
      "Direct interaction with healthcare providers",
      "Comprehensive treatment plans",
    ],
    faqs: [
      {
        question: "How quickly can I get an in-person appointment?",
        answer:
          "We offer same-day appointments for urgent cases and typically can schedule routine appointments within 1-3 days.",
      },
      {
        question: "What should I bring to my in-person appointment?",
        answer:
          "Please bring your ID, insurance information, a list of current medications, and any relevant medical records or test results.",
      },
      {
        question: "How long do in-person appointments typically last?",
        answer:
          "Initial consultations usually last 30-45 minutes, while follow-up appointments are typically 15-30 minutes depending on the complexity of your case.",
      },
    ],
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
    longDescription:
      "Our emergency care services provide immediate medical attention for urgent and life-threatening conditions. Available 24/7, our emergency department is staffed with experienced physicians, nurses, and specialists trained to handle all types of medical emergencies. We use state-of-the-art equipment and follow the latest protocols to deliver the highest standard of emergency care.",
    benefits: [
      "24/7 availability",
      "Rapid response times",
      "Highly trained emergency specialists",
      "Advanced medical equipment",
      "Seamless transition to inpatient care when needed",
    ],
    faqs: [
      {
        question: "When should I seek emergency care versus urgent care?",
        answer:
          "Seek emergency care for life-threatening conditions such as chest pain, severe bleeding, difficulty breathing, or major injuries. Urgent care is appropriate for non-life-threatening conditions that still require prompt attention.",
      },
      {
        question: "Does insurance cover emergency care?",
        answer:
          "Most insurance plans cover emergency care. We accept most major insurance providers and work with patients on payment options regardless of insurance status.",
      },
      {
        question: "Can I call ahead before coming to the emergency department?",
        answer:
          "While you can call ahead, if you're experiencing a true emergency, don't delay seeking care. Call 911 or have someone bring you to the emergency department immediately.",
      },
    ],
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
    longDescription:
      "Our diagnostic laboratory services offer a wide range of tests to help diagnose conditions and monitor health. From routine blood work to specialized genetic testing, our state-of-the-art lab facilities ensure accurate results with quick turnaround times. We offer both in-clinic testing and convenient home sample collection options.",
    benefits: [
      "Accurate and reliable results",
      "Quick turnaround times",
      "Convenient home sample collection",
      "Digital reports accessible online",
      "Expert interpretation of results",
    ],
    faqs: [
      {
        question: "How long does it take to get lab test results?",
        answer:
          "Most routine tests results are available within 24-48 hours. Specialized tests may take 3-5 days. Urgent tests can be expedited when medically necessary.",
      },
      {
        question: "Do I need to fast before my lab tests?",
        answer:
          "Some tests require fasting, while others don't. When you schedule your test, you'll receive specific preparation instructions. Common tests like lipid profiles and glucose tests typically require 8-12 hours of fasting.",
      },
      {
        question: "How can I access my test results?",
        answer:
          "Test results are available through our secure patient portal. You'll receive a notification when your results are ready. Your doctor will also review the results and contact you if any follow-up is needed.",
      },
    ],
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
    price: "From $150",
    image: "https://i.ibb.co/qGmXMrd/9045622.jpg",
    longDescription:
      "Our comprehensive health check-up packages are designed to assess your overall health status and detect potential health issues before they become serious. These preventive screenings include a range of tests and examinations tailored to your age, gender, family history, and risk factors. Each check-up concludes with a detailed consultation to discuss findings and recommendations.",
    benefits: [
      "Early detection of health issues",
      "Comprehensive assessment of body systems",
      "Personalized health recommendations",
      "Establishment of health baselines",
      "Peace of mind about your health status",
    ],
    faqs: [
      {
        question: "How often should I get a comprehensive health check-up?",
        answer:
          "We recommend annual health check-ups for most adults. However, the frequency may vary based on your age, existing health conditions, and risk factors. Your doctor can provide personalized recommendations.",
      },
      {
        question: "What's included in a standard health check-up?",
        answer:
          "A standard health check-up typically includes vital signs assessment, physical examination, blood tests (complete blood count, lipid profile, blood glucose), urine analysis, ECG, and a doctor consultation. Additional tests may be recommended based on individual needs.",
      },
      {
        question: "How should I prepare for a health check-up?",
        answer:
          "For most comprehensive check-ups, you should fast for 8-12 hours before the appointment, wear comfortable clothing, bring a list of current medications, and have your medical history information ready. Specific instructions will be provided when you schedule your appointment.",
      },
    ],
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
    longDescription:
      "Our mental health services provide comprehensive care for a wide range of psychological and emotional concerns. Our team of psychiatrists, psychologists, and therapists offer evidence-based treatments in a supportive and confidential environment. We believe in a holistic approach to mental health that addresses biological, psychological, and social factors affecting wellbeing.",
    benefits: [
      "Confidential and non-judgmental care",
      "Personalized treatment plans",
      "Integration with physical health services",
      "Evidence-based therapeutic approaches",
      "Ongoing support and follow-up",
    ],
    faqs: [
      {
        question:
          "What's the difference between a psychiatrist and a psychologist?",
        answer:
          "Psychiatrists are medical doctors who can prescribe medications and diagnose mental health conditions. Psychologists typically have doctoral degrees in psychology and provide therapy and psychological testing but usually cannot prescribe medication.",
      },
      {
        question: "Is therapy covered by insurance?",
        answer:
          "Many insurance plans provide coverage for mental health services. The extent of coverage varies by plan. We can help verify your benefits before your first appointment.",
      },
      {
        question: "How long does therapy typically last?",
        answer:
          "The duration of therapy depends on your specific needs and goals. Some people benefit from short-term therapy (8-12 sessions), while others may continue therapy for longer periods. Your provider will discuss recommendations during your initial assessment.",
      },
    ],
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
    price: "From $200",
    image: "https://i.ibb.co/SXFD0Bcg/5821152.jpg",
    longDescription:
      "Our cardiac care services provide comprehensive diagnosis, treatment, and management of heart conditions. Our team of cardiologists and cardiac specialists use advanced diagnostic tools and treatments to address a wide range of cardiovascular issues, from common conditions like hypertension to complex heart diseases. We emphasize both interventional treatments and preventive approaches to heart health.",
    benefits: [
      "Advanced cardiac diagnostic technology",
      "Experienced cardiologists and specialists",
      "Comprehensive treatment options",
      "Cardiac rehabilitation programs",
      "Focus on prevention and heart health education",
    ],
    faqs: [
      {
        question: "What symptoms should prompt me to seek cardiac care?",
        answer:
          "You should seek cardiac evaluation if you experience chest pain, shortness of breath, palpitations, dizziness, fatigue, swelling in the legs, or if you have risk factors like high blood pressure, high cholesterol, diabetes, or a family history of heart disease.",
      },
      {
        question: "What tests are used to diagnose heart conditions?",
        answer:
          "Common cardiac diagnostic tests include electrocardiogram (ECG), echocardiogram, stress tests, cardiac CT or MRI, coronary angiogram, and blood tests. The specific tests recommended will depend on your symptoms and risk factors.",
      },
      {
        question: "What lifestyle changes can improve heart health?",
        answer:
          "Key lifestyle factors for heart health include regular physical activity, a heart-healthy diet low in saturated fats and sodium, maintaining a healthy weight, not smoking, limiting alcohol, managing stress, and controlling conditions like high blood pressure, high cholesterol, and diabetes.",
      },
    ],
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
    longDescription:
      "Our pharmacy services provide convenient access to prescription medications and over-the-counter products. Our licensed pharmacists ensure accurate dispensing and offer expert advice on medication use, potential interactions, and side effects. We offer both in-store pickup and home delivery options to make managing your medications as convenient as possible.",
    benefits: [
      "Convenient prescription fulfillment",
      "Expert pharmacist consultations",
      "Medication therapy management",
      "Home delivery options",
      "Automatic refill programs",
    ],
    faqs: [
      {
        question: "How do I transfer my prescriptions to your pharmacy?",
        answer:
          "You can transfer prescriptions by providing our pharmacy with your current pharmacy's information and the names of your medications. We'll handle the transfer process for you. You can initiate this in person, by phone, or through our online portal.",
      },
      {
        question: "Do you offer automatic prescription refills?",
        answer:
          "Yes, we offer an automatic refill program for maintenance medications. You'll receive a notification when your refill is ready, and you can choose between pickup or delivery.",
      },
      {
        question: "Can your pharmacists help me understand my medications?",
        answer:
          "Absolutely. Our pharmacists are available for consultation about your medications, including proper usage, potential side effects, and interactions with other medications or supplements. We encourage you to ask questions about your prescriptions.",
      },
    ],
  },
];

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    // Find the service based on the ID from the URL
    const foundService = extendedServices.find((s) => s.id === params.id);
    if (foundService) {
      setService(foundService);
    } else {
      // Redirect to services page if service not found
      router.push("/services");
    }
  }, [params.id, router]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-green-50">
          <div className="container mx-auto px-4 md:px-6">
            <Button
              variant="ghost"
              className="mb-6 flex items-center gap-2"
              onClick={() => router.push("/services")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {service.title}
                </h1>
                <p className="text-gray-600 mb-6">{service.longDescription}</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <Link href="/doctors">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Book This Service
                  </Button>
                </Link>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue="features">
              <TabsList className="mb-6">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="features">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Service Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.features.map((feature: string) => (
                        <div key={feature} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Key Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit: string) => (
                        <div key={benefit} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faqs">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                      {service.faqs.map(
                        (
                          faq: { question: string; answer: string },
                          index: number
                        ) => (
                          <div key={index}>
                            <h3 className="font-bold mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8 text-center">
              How to Book This Service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Select Appointment Time
                </h3>
                <p className="text-gray-600">
                  Choose a convenient date and time from our available slots
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Provide Your Details</h3>
                <p className="text-gray-600">
                  Fill in your information and any specific requirements you may
                  have
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Confirm and Pay</h3>
                <p className="text-gray-600">
                  Review your booking details, make payment, and receive
                  confirmation
                </p>
              </div>
            </div>

            {/* <div className="mt-8 text-center">
              <Button className="bg-green-600 hover:bg-green-700">
                Book Now
              </Button>
            </div> */}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Related Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {extendedServices
                .filter(
                  (s) => s.category === service.category && s.id !== service.id
                )
                .slice(0, 3)
                .map((relatedService) => (
                  <Card
                    key={relatedService.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {relatedService.description}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() =>
                          router.push(`/services/${relatedService.id}`)
                        }
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
