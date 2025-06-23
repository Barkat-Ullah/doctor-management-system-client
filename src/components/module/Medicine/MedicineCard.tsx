"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Medicine } from "@/types/medicine";
import { useUser } from "@/context/UserContext";

import {
  formatDosageForm,
  formatMedicineCategory,
} from "@/components/constants/medicine";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { user } = useUser();

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < medicine.inStock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    dispatch(addToCart({ medicine, quantity }));
    setQuantity(1);
    toast.success("Successfully added product ! check on your cart 🛒");
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
            {medicine.name}
          </h3>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 ml-2 shrink-0"
          >
            {formatMedicineCategory(medicine.category)}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {medicine.description ||
            `${formatDosageForm(medicine.dosageForm)} - ${
              medicine.strength || "N/A"
            }`}
        </p>

        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-medium text-gray-700">Manufacturer:</span>
            <span className="text-gray-600 ml-1">{medicine.manufacturer}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Form:</span>
            <span className="text-gray-600 ml-1">
              {formatDosageForm(medicine.dosageForm)}
              {medicine.strength && ` - ${medicine.strength}`}
            </span>
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-700">
            {formatPrice(medicine.price)}
          </span>
          <Badge
            variant="secondary"
            className={`${
              medicine.inStock <= 5
                ? "bg-red-100 text-red-800 hover:bg-red-200"
                : medicine.inStock <= 20
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {medicine.inStock > 0
              ? `${medicine.inStock} in stock`
              : "Out of stock"}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Only show add to cart if user is logged in */}
        {user ? (
          medicine.inStock > 0 ? (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-lg rounded-r-none"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium border-x py-1">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-lg rounded-l-none"
                    onClick={increaseQuantity}
                    disabled={quantity >= medicine.inStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <Button className="w-full" disabled variant="secondary">
              Out of Stock
            </Button>
          )
        ) : (
          <div className="w-full text-center">
            <p className="text-sm text-gray-500 mb-2">
              Please login to add items to cart
            </p>
            <Button className="w-full" disabled variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Login Required
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
