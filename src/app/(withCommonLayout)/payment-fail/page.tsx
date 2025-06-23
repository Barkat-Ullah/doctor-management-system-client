/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";

const PaymentFailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const doctorId = searchParams.get("doctorId");
  const tranId = searchParams.get("tran_id");
  const failReason = searchParams.get("reason") || "Payment processing failed";

  useEffect(() => {
    // Show error toast
    toast.error("Payment failed! Please try again.");

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
          {/* Error Icon */}
          <div className="bg-red-100 p-4 rounded-full mb-6">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-red-600 mb-2 text-center">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            We're sorry, but your payment could not be processed at this time.
            Please try again or contact support if the problem persists.
          </p>

          {/* Failure Details */}
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-800 mb-1">
                  Payment Details
                </h3>
                <div className="text-sm text-red-700 space-y-1">
                  {tranId && <p>Transaction ID: {tranId}</p>}
                  <p>Reason: {failReason}</p>
                  <p>Time: {new Date().toLocaleString()}</p>
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
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Payment Again
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
              <span className="font-semibold text-red-600">{countdown}</span>{" "}
              seconds
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Need Help?</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Check your internet connection</p>
              <p>• Verify your payment method details</p>
              <p>• Contact our support team if issue persists</p>
            </div>
            <Button variant="link" className="p-0 h-auto mt-2 text- green-600">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailPage;
