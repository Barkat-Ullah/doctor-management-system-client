/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { getAllMedicine, deleteMedicine } from "@/services/medicine";
import type {
  Medicine,
  MedicineQueryParams,
  MedicineCategory,
} from "@/types/medicine";
import {
  MEDICINE_CATEGORIES,
  formatMedicineCategory,
} from "@/components/constants/medicine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Plus, Search, Edit, Trash2 } from "lucide-react";
import MedicineFormModal from "./MedicineModal";

export default function MedicineTable() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [params, setParams] = useState<MedicineQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch medicines
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await getAllMedicine(params);
      if (response.success) {
        setMedicines(response.data);
        setMeta(
          response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 }
        );
      } else {
        toast.error(response.message || "Failed to fetch medicines");
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("An error occurred while fetching medicines");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when params change
  useEffect(() => {
    fetchMedicines();
  }, [params]);

  // Handle search
  const handleSearch = () => {
    setParams((prev) => ({ ...prev, searchTerm: searchQuery, page: 1 }));
  };

  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    setParams((prev) => ({
      ...prev,
      category: category === "ALL" ? undefined : (category as MedicineCategory),
      page: 1,
    }));
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Handle delete medicine
  const handleDeleteMedicine = async () => {
    if (!selectedMedicine) return;

    try {
      const response = await deleteMedicine(selectedMedicine.id);
      if (response.success) {
        toast.success("Medicine deleted successfully");
        fetchMedicines();
      } else {
        toast.error(response.message || "Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast.error("An error occurred while deleting the medicine");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedMedicine(null);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
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
          <Select onValueChange={handleCategoryChange} defaultValue="ALL">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {MEDICINE_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Medicine
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("name")}
              >
                Name
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("price")}
              >
                Price
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("inStock")}
              >
                Stock
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  </div>
                </TableCell>
              </TableRow>
            ) : medicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>
                    {formatMedicineCategory(medicine.category)}
                  </TableCell>
                  <TableCell>{medicine.manufacturer}</TableCell>
                  <TableCell>{formatPrice(medicine.price)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        medicine.inStock <= 5
                          ? "bg-red-100 text-red-800"
                          : medicine.inStock <= 20
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {medicine.inStock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          setSelectedMedicine(medicine);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && medicines.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (meta.page > 1) {
                    setParams((prev) => ({ ...prev, page: meta.page - 1 }));
                  }
                }}
                className={
                  meta.page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setParams((prev) => ({ ...prev, page }))}
                    isActive={meta.page === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (meta.page < meta.totalPages) {
                    setParams((prev) => ({ ...prev, page: meta.page + 1 }));
                  }
                }}
                className={
                  meta.page === meta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Create/Edit Modal */}
      <MedicineFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedMedicine(null);
        }}
        medicine={selectedMedicine}
        isEditing={isEditModalOpen}
        onSuccess={() => {
          fetchMedicines();
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedMedicine(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the medicine &quot;{selectedMedicine?.name}
              &quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedMedicine(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMedicine}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
