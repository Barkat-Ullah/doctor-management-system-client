import DoctorPage from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/DoctorPage";
import { getAllDoctors } from "@/services/Doctors";
import type { DoctorQueryParams } from "@/types/doctor.type";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<DoctorQueryParams>;
}

const DoctorsManagement = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryParams: DoctorQueryParams = {
    searchTerm: resolvedSearchParams.searchTerm,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 10,
    sort: resolvedSearchParams.sort,
    doctorSpecialties: resolvedSearchParams.doctorSpecialties,
    gender: resolvedSearchParams.gender,
  };

  const { data: doctors, meta } = await getAllDoctors(queryParams);

  return (
    <div className="container mx-auto py-6 px-2">
      <DoctorPage doctors={doctors} meta={meta} />
    </div>
  );
};

export default DoctorsManagement;
