"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createMedicine, updateMedicine } from "@/services/medicine";
import {
  type Medicine,
  type CreateMedicineData,
  MedicineCategory,
  DosageForm,
} from "@/types/medicine";
import {
  MEDICINE_CATEGORIES,
  DOSAGE_FORMS,
} from "@/components/constants/medicine";

interface MedicineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
  isEditing: boolean;
  onSuccess: () => void;
}

export default function MedicineFormModal({
  isOpen,
  onClose,
  medicine,
  isEditing,
  onSuccess,
}: MedicineFormModalProps) {
  const [formData, setFormData] = useState<CreateMedicineData>(
    medicine
      ? {
          name: medicine.name,
          description: medicine.description,
          price: medicine.price,
          inStock: medicine.inStock,
          category: medicine.category,
          manufacturer: medicine.manufacturer,
          dosageForm: medicine.dosageForm,
          strength: medicine.strength,
          isActive: medicine.isActive,
        }
      : {
          name: "",
          description: "",
          price: 0,
          inStock: 0,
          category: MedicineCategory.ANTIBIOTIC,
          manufacturer: "",
          dosageForm: DosageForm.TABLET,
          strength: "",
          isActive: true,
        }
  );
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Convert numeric values
    if (type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.manufacturer || !formData.price) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate numeric fields
      if (formData.price <= 0) {
        toast.error("Price must be greater than zero");
        setLoading(false);
        return;
      }

      if (formData.inStock < 0) {
        toast.error("Stock cannot be negative");
        setLoading(false);
        return;
      }

      let response;
      if (isEditing && medicine) {
        response = await updateMedicine(medicine.id, formData);
      } else {
        response = await createMedicine(formData);
      }

      if (response.success) {
        toast.success(
          isEditing
            ? "Medicine updated successfully"
            : "Medicine created successfully"
        );
        onSuccess();
      } else {
        toast.error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Medicine" : "Add New Medicine"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MEDICINE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosageForm">Dosage Form *</Label>
              <Select
                value={formData.dosageForm}
                onValueChange={(value) =>
                  handleSelectChange("dosageForm", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dosage form" />
                </SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map((form) => (
                    <SelectItem key={form.value} value={form.value}>
                      {form.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strength">Strength</Label>
              <Input
                id="strength"
                name="strength"
                value={formData.strength || ""}
                onChange={handleChange}
                placeholder="e.g., 500mg, 10ml"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inStock">Stock Quantity *</Label>
            <Input
              id="inStock"
              name="inStock"
              type="number"
              min="0"
              step="1"
              value={formData.inStock}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Medicine"
              ) : (
                "Add Medicine"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
