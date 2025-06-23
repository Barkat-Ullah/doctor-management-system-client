import AllPatients from "@/components/module/Dashboard/RoleBased/admin/patients/AllPatients";
import { getAllPatients } from "@/services/Patients/index";
import type { PatientQueryParams } from "@/types/patient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<PatientQueryParams>;
}

const AdminPatientPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryParams: PatientQueryParams = {
    searchTerm: resolvedSearchParams.searchTerm,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 10,
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  };

  const { data: patients, meta } = await getAllPatients(queryParams);

  return (
    <div className="container mx-auto py-6">
      <AllPatients patients={patients} meta={meta} />
    </div>
  );
};

export default AdminPatientPage;
