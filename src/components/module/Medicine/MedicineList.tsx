/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getAllMedicine } from "@/services/medicine";
import type { Medicine, MedicineQueryParams } from "@/types/medicine";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MedicineCard from "./MedicineCard";

interface MedicineListProps {
  initialMedicines: Medicine[];
  initialMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MedicineList({
  initialMedicines,
  initialMeta,
}: MedicineListProps) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(initialMeta);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current params from URL
  const getCurrentParams = (): Required<
    Pick<MedicineQueryParams, "page" | "limit" | "sortBy" | "sortOrder">
  > &
    Omit<MedicineQueryParams, "page" | "limit" | "sortBy" | "sortOrder"> => ({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
    sortBy: searchParams.get("sortBy") || "name",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    category: searchParams.get("category") as any,
    searchTerm: searchParams.get("searchTerm") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  });

  // Fetch medicines when URL params change
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const params = getCurrentParams();
        const response = await getAllMedicine(params);
        if (response.success) {
          setMedicines(response.data);
          setMeta(response.meta || initialMeta);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
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

    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Handle search
  const handleSearch = () => {
    updateUrlParams({ searchTerm: searchQuery, page: 1 });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    updateUrlParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder as "asc" | "desc",
      page: 1,
    });
  };

  const currentParams = getCurrentParams();
  const currentPage = currentParams.page || 1;

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-8"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={`${currentParams.sortBy}-${currentParams.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {medicines.length} of {meta.total} medicines
      </div>

      {/* Medicine cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No medicines found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && updateUrlParams({ page: currentPage - 1 })
                }
                className={
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 ||
                  p === meta.totalPages ||
                  Math.abs(p - currentPage) <= 1
                );
              })
              .map((p, i, arr) => {
                // Add ellipsis if there are gaps
                if (i > 0 && p - arr[i - 1] > 1) {
                  return (
                    <PaginationItem key={`ellipsis-${p}`}>
                      <span className="px-2">...</span>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => updateUrlParams({ page: p })}
                      isActive={currentPage === p}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < meta.totalPages &&
                  updateUrlParams({ page: currentPage + 1 })
                }
                className={
                  currentPage >= meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
