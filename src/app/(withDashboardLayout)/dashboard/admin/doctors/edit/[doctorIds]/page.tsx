import EditDoctorForm from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/UpdateDoctor";
import { getSingleDoctorById } from "@/services/Doctors";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

type Params = Promise<{ doctorIds: string }>;

const EditDoctorPage = async ({ params }: { params: Params }) => {
  const { doctorIds } = await params;
  const doctor = await getSingleDoctorById(doctorIds);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-2">
      <EditDoctorForm doctor={doctor} />
    </div>
  );
};

export default EditDoctorPage;
