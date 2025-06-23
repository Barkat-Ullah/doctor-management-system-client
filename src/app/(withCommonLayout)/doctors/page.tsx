import PublicDoctorPage from "@/components/module/Dashboard/RoleBased/doctor/PublicDoctor";
import { getAllDoctors, getAllSpecialties } from "@/services/Doctors";
import type { DoctorQueryParams } from "@/types/doctor.type";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<DoctorQueryParams>;
}

const DoctorsPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryParams: DoctorQueryParams = {
    searchTerm: resolvedSearchParams.searchTerm,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 4,
    sort: resolvedSearchParams.sort,
    doctorSpecialties: resolvedSearchParams.doctorSpecialties,
    gender: resolvedSearchParams.gender,
    experience: resolvedSearchParams.experience,
  };

  // Fetch doctors and specialties in parallel using existing service
  const [doctorsResult, specialties] = await Promise.all([
    getAllDoctors(queryParams),
    getAllSpecialties(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <PublicDoctorPage
        doctors={doctorsResult.data}
        meta={doctorsResult.meta}
        specialties={specialties}
      />
    </div>
  );
};

export default DoctorsPage;
