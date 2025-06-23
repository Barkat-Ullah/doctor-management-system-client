"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Phone,
  Clock,
  HelpCircle,
  Laptop,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createSupport } from "@/services/supportForm/index";

const supportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  queryType: z.string().min(1, "Please select a query type"),
  patientId: z.string().optional(),
  issueDescription: z
    .string()
    .min(10, "Please provide more details about your issue"),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function PatientSupportForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Initialize the form
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      queryType: "",
      patientId: "",
      issueDescription: "",
    },
  });

  // Handle form submission
  function onSubmit(values: SupportFormValues) {
    console.log("Patient query submitted:", values);

    startTransition(async () => {
      try {
        const result = await createSupport(values);

        if (result.success) {
          toast.success(
            result.message || "Support request submitted successfully!"
          );
          setIsSubmitted(true);
          form.reset();

          // Reset success message after 5 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        } else {
          toast.error(result.message || "Failed to submit support request");
        }
      } catch (error) {
        console.error("Error submitting support request:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Patient Support Center
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need help with your treatment, appointment scheduling, or
            experiencing technical issues with our patient portal? Our dedicated
            support team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Information</CardTitle>
                <CardDescription>
                  How to reach our patient support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Patient Help Desk</h4>
                    <p className="text-gray-600">
                      For appointment scheduling, medication inquiries, and
                      general patient support
                    </p>
                    <p className="text-gray-600 font-medium mt-1">
                      help@hospital.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Laptop className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Technical Support</h4>
                    <p className="text-gray-600">
                      For issues with our patient portal, online appointments,
                      or digital services
                    </p>
                    <p className="text-gray-600 font-medium mt-1">
                      techsupport@hospital.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Support Hotline</h4>
                    <p className="text-gray-600 font-medium">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-gray-600 text-sm">
                      Available during working hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium">Support Hours</h4>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 8:00 PM
                    </p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">
                      Sunday: 10:00 AM - 2:00 PM (Emergency support only)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Medical Support</CardTitle>
                <CardDescription>For urgent medical assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="font-medium text-red-700 mb-1">
                    Emergency Hotline
                  </h4>
                  <p className="text-red-600 text-xl font-bold">
                    +1 (555) 911-0000
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Available 24/7 for medical emergencies
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>
                  Let us know how we can help you with your query or technical
                  issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-green-800 mb-2">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-green-700">
                      Thank you for contacting our Patient Support Center. We
                      will respond to your query as soon as possible.
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="patientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient ID (if available)</FormLabel>
                              <FormControl>
                                <Input placeholder="PAT12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your.email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1 (555) 123-4567"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="queryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type of Query</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select the nature of your query" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="appointment">
                                  Appointment Scheduling
                                </SelectItem>
                                <SelectItem value="treatment">
                                  Treatment Information
                                </SelectItem>
                                <SelectItem value="medication">
                                  Medication Queries
                                </SelectItem>
                                <SelectItem value="billing">
                                  Billing & Insurance
                                </SelectItem>
                                <SelectItem value="portal">
                                  Patient Portal Access
                                </SelectItem>
                                <SelectItem value="app">
                                  Mobile App Issues
                                </SelectItem>
                                <SelectItem value="website">
                                  Website Technical Problems
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="issueDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Describe Your Query or Issue</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please provide details about your query or the technical issue you're experiencing..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Our team typically responds within 24 hours
                        </p>
                        <Button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isPending}
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
