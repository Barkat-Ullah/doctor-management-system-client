"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validatePayment } from "@/services/Payment";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    const tranId = searchParams.get("tran_id");
    const doctorId = searchParams.get("doctorId");

    console.log("Payment Success Page - URL Params:", { tranId, doctorId });

    if (!doctorId || !tranId) {
      toast.error("Missing required payment parameters.");
      router.replace("/dashboard");
      return;
    }

    const confirmPayment = async () => {
      try {
        // ✅ Pass transaction ID as payload
        const payload = {
          tran_id: tranId,
          doctorId: doctorId,
          // Include all search params
          ...Object.fromEntries(searchParams.entries()),
        };

        console.log("Validating payment with payload:", payload);

        const result = await validatePayment(payload);

        if (result.success) {
          toast.success("Payment validated successfully!");
          setValidationComplete(true);

          setTimeout(() => {
            router.replace("/dashboard/patient/appointments");
          }, 2000);
        } else {
          toast.error(result.message || "Payment validation failed");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 3000);
        }
      } catch (error) {
        console.error("Payment validation error:", error);
        toast.error("Something went wrong during payment validation");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 3000);
      } finally {
        setIsValidating(false);
      }
    };

    // Add delay to ensure URL parameters are loaded
    const timer = setTimeout(() => {
      confirmPayment();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {isValidating ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Validating Payment</h3>
              <p className="text-muted-foreground text-center">
                Please wait while we confirm your payment...
              </p>
            </>
          ) : validationComplete ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                Payment Successful!
              </h3>
              <p className="text-muted-foreground text-center">
                Your appointment has been confirmed. Redirecting to your
                appointments...
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                Payment Validation Failed
              </h3>
              <p className="text-muted-foreground text-center">
                There was an issue validating your payment. Redirecting...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
