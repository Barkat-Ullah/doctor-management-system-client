"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Activity, Info } from "lucide-react";

const bmiFormSchema = z.object({
  feet: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Please enter a valid number",
  }),
  inches: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 12,
      {
        message: "Please enter a valid number between 0-11",
      }
    ),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid weight",
  }),
});

type BmiFormValues = z.infer<typeof bmiFormSchema>;

export default function BmiCalculator() {
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    color: string;
  } | null>(null);

  const form = useForm<BmiFormValues>({
    resolver: zodResolver(bmiFormSchema),
    defaultValues: {
      feet: "",
      inches: "",
      weight: "",
    },
  });

  function calculateBMI(
    heightFeet: number,
    heightInches: number,
    weightKg: number
  ) {
    // Convert height to meters
    const heightMeters = (heightFeet * 12 + heightInches) * 0.0254;

    // Calculate BMI
    const bmi = weightKg / (heightMeters * heightMeters);

    // Determine BMI category
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-600";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      color = "text-green-600";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      color = "text-yellow-600";
    } else {
      category = "Obesity";
      color = "text-red-600";
    }

    return { bmi: Number.parseFloat(bmi.toFixed(1)), category, color };
  }

  function onSubmit(data: BmiFormValues) {
    const feet = Number(data.feet);
    const inches = Number(data.inches);
    const weight = Number(data.weight);

    const result = calculateBMI(feet, inches, weight);
    form.reset();
    setBmiResult(result);
  }

  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">BMI Calculator</h2>
          <p className="text-gray-600 mt-2">
            Check your Body Mass Index (BMI) to assess your weight relative to
            height
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-green-100 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-white p-6 md:p-8">
                  <div className="flex items-center mb-6">
                    <Activity className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold">Calculate Your BMI</h3>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="feet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (feet)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="5"
                                  {...field}
                                  type="number"
                                  min="0"
                                  className="focus-visible:ring-green-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="inches"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (inches)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10"
                                  {...field}
                                  type="number"
                                  min="0"
                                  max="11"
                                  className="focus-visible:ring-green-500"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="70"
                                {...field}
                                type="number"
                                min="1"
                                className="focus-visible:ring-green-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 mt-2"
                      >
                        Calculate BMI
                      </Button>
                    </form>
                  </Form>
                </div>

                <div className="bg-green-600 text-white p-6 md:p-8 flex flex-col">
                  <h3 className="text-xl font-bold mb-4">Your Results</h3>

                  {bmiResult ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">
                          {bmiResult.bmi}
                        </div>
                        <div
                          className={`text-xl font-medium ${bmiResult.color} bg-white px-3 py-1 rounded-full inline-block`}
                        >
                          {bmiResult.category}
                        </div>

                        <div className="mt-6 text-left">
                          <h4 className="font-medium mb-2">BMI Categories:</h4>
                          <ul className="space-y-1 text-sm">
                            <li>Underweight: Less than 18.5</li>
                            <li>Normal weight: 18.5 - 24.9</li>
                            <li>Overweight: 25 - 29.9</li>
                            <li>Obesity: 30 or greater</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <Info className="h-12 w-12 mb-4 opacity-75" />
                      <p className="text-lg">
                        Enter your height and weight to calculate your BMI
                      </p>
                      <p className="mt-2 text-green-200">
                        BMI is a measurement of a person&apos;s weight with
                        respect to their height
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-green-500 text-sm">
                    <p>
                      Note: BMI is a screening tool, not a diagnostic of body
                      fatness or health. Consult with a healthcare provider for
                      a complete health assessment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
