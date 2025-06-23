import type { Metadata } from "next";
import { getAllMedicine } from "@/services/medicine";
import MedicineFilters from "@/components/module/Medicine/MedicineFilter";
import MedicineList from "@/components/module/Medicine/MedicineList";

export const metadata: Metadata = {
  title: "Medicines | Health Portal",
  description: "Browse and purchase medicines from our online pharmacy",
};

export const dynamic = "force-dynamic";

export default async function MedicinePage() {
  // Fetch initial medicines
  const response = await getAllMedicine({
    page: 1,
    limit: 12,
    sortBy: "name",
    sortOrder: "asc",
  });

  const medicines = response.data;
  const meta = response.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Medicines</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full lg:w-1/4">
          <MedicineFilters />
        </div>

        {/* Medicine list */}
        <div className="w-full lg:w-3/4">
          <MedicineList initialMedicines={medicines} initialMeta={meta} />
        </div>
      </div>
    </div>
  );
}
