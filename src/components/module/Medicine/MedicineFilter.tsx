/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { MEDICINE_CATEGORIES } from "@/components/constants/medicine";

export default function MedicineFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get filters from URL
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : 0;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : 1000;

  // Local state for filters
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  // Update local state when URL params change
  useEffect(() => {
    setSelectedCategory(category);
    setPriceRange([
      searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : 1000,
    ]);
  }, [searchParams]);

  // Update URL with new params
  const updateUrlParams = (
    params: Record<string, string | number | undefined>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // Always reset to page 1 when filters change
    newParams.set("page", "1");

    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(newCategory);
    updateUrlParams({ category: newCategory });
  };

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  // Apply price filter
  const applyPriceFilter = () => {
    updateUrlParams({
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 1000]);
    router.push(pathname);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category filter */}
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {MEDICINE_CATEGORIES.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${cat.value}`}
                  checked={selectedCategory === cat.value}
                  onCheckedChange={() => handleCategoryChange(cat.value)}
                />
                <Label
                  htmlFor={`category-${cat.value}`}
                  className="text-sm cursor-pointer"
                >
                  {cat.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price range filter */}
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div className="space-y-6">
            <Slider
              defaultValue={[0, 1000]}
              value={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              className="py-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">{formatPrice(priceRange[0])}</span>
              <span className="text-sm">{formatPrice(priceRange[1])}</span>
            </div>
            <Button
              onClick={applyPriceFilter}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Apply Price Filter
            </Button>
          </div>
        </div>

        <Separator />

        {/* Reset filters */}
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
