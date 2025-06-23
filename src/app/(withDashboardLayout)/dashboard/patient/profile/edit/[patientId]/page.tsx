import UpdatePatient from "@/components/module/Dashboard/RoleBased/admin/patients/UpdatePatient";
import { getSinglePatient } from "@/services/Patients/index";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ patientId: string }>;
const EditPatientPage = async ({ params }: { params: Params }) => {
  const { patientId } = await params;
  const patient = await getSinglePatient(patientId);
  console.log(patient);

  if (!patient) {
    notFound();
  }
  return (
    <div className="container mx-auto py-6">
      <UpdatePatient />
    </div>
  );
};

export default EditPatientPage;
