"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createPrescription } from "@/services/Prescription";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  patientName: string;
  onPrescriptionCreated?: () => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  patientName,
  onPrescriptionCreated,
}) => {
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (instructions.trim().length < 10) {
      toast.error(
        "Please provide detailed instructions (at least 10 characters)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData = {
        appointmentId,
        instructions: instructions.trim(),
        ...(followUpDate && {
          followUpDate: new Date(followUpDate).toISOString(),
        }),
      };

      const result = await createPrescription(prescriptionData);

      if (result.success) {
        toast.success("Prescription created successfully!");
        onPrescriptionCreated?.();
        handleClose();
      } else {
        toast.error(result.message || "Failed to create prescription");
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInstructions("");
    setFollowUpDate("");
    setIsSubmitting(false);
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Prescription
          </DialogTitle>
          <DialogDescription>
            Create a prescription for <strong>{patientName}</strong>. Provide
            detailed instructions and medication details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">
              Medical Instructions & Prescription Details{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="instructions"
              placeholder="Enter detailed medical instructions, medications, dosage, and any other relevant information..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              maxLength={2000}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {instructions.length}/2000 characters
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUpDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-up Date (Optional)
            </Label>
            <Input
              id="followUpDate"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              min={today}
            />
            <p className="text-xs text-muted-foreground">
              Set a follow-up date if the patient needs to return for a
              check-up.
            </p>
          </div>

          {/* Appointment Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Appointment Information
            </h4>
            <div className="text-sm text-blue-700">
              <p>
                <strong>Patient:</strong> {patientName}
              </p>
              <p>
                <strong>Appointment ID:</strong> {appointmentId}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || instructions.trim().length < 10}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;
