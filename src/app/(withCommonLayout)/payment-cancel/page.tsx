/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home, ArrowLeft, Clock } from "lucide-react";

const PaymentCancelPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(15);

  const doctorId = searchParams.get("doctorId");
  const tranId = searchParams.get("tran_id");

  useEffect(() => {
    // Show info toast
    toast.info("Payment was cancelled by user.");

    // Countdown timer for auto redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRetryPayment = () => {
    if (doctorId) {
      router.push(`/dashboard/patient/doctors/${doctorId}`);
    } else {
      router.push("/dashboard/patient/doctors");
    }
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          {/* Cancel Icon */}
          <div className="bg-orange-100 p-4 rounded-full mb-6">
            <AlertCircle className="h-16 w-16 text-orange-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-orange-600 mb-2 text-center">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            Your payment has been cancelled. No charges have been made to your
            account. You can try again whenever you're ready.
          </p>

          {/* Cancellation Details */}
          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-orange-800 mb-1">
                  Cancellation Details
                </h3>
                <div className="text-sm text-orange-700 space-y-1">
                  {tranId && <p>Transaction ID: {tranId}</p>}
                  <p>Status: Cancelled by user</p>
                  <p>Time: {new Date().toLocaleString()}</p>
                  <p className="font-medium">No charges applied</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Button
              onClick={handleRetryPayment}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Complete Payment Now
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>

          {/* Auto Redirect Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Automatically redirecting to dashboard in{" "}
              <span className="font-semibold text-orange-600">{countdown}</span>{" "}
              seconds
            </p>
          </div>

          {/* Information Section */}
          <div className="mt-6 w-full bg- green-50 border border- green-200 rounded-lg p-4">
            <h4 className="font-medium text- green-800 mb-2">
              💡 What happens next?
            </h4>
            <div className="text-sm text- green-700 space-y-1">
              <p>• Your appointment slot is still available</p>
              <p>• You can complete payment anytime</p>
              <p>• No cancellation fees applied</p>
              <p>• Your booking will expire in 30 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
