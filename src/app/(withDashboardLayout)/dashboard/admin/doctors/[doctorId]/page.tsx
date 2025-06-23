import DoctorDetails from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/DoctorDetails";
import { getSingleDoctorById } from "@/services/Doctors";
export const dynamic = "force-dynamic";

type Params = Promise<{ doctorId: string }>;

const DoctorDetailsSection = async ({ params }: { params: Params }) => {
  const { doctorId } = await params;
  const doctor = await getSingleDoctorById(doctorId);

  return (
    <div className="container mx-auto py-6 px-2">
      <DoctorDetails doctor={doctor} showActions={true} />
    </div>
  );
};

export default DoctorDetailsSection;
