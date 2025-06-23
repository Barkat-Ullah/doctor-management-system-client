import MedicineTable from "@/components/module/Medicine/MedicineTable";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Medicine Management | Admin Dashboard",
  description: "Manage medicines in the pharmacy system",
};

export default function MedicineManagementPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medicine Management</h1>
      </div>
      <MedicineTable />
    </div>
  );
}
