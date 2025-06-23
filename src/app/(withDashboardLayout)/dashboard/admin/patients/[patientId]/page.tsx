import PatientDetails from "@/components/module/Dashboard/RoleBased/admin/patients/PatientDetails";
import { getSinglePatient } from "@/services/Patients/index";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ patientId: string }>;

const PatientDetailsPage = async ({ params }: { params: Params }) => {
  const { patientId } = await params;
  const patient = await getSinglePatient(patientId);

  if (!patient) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <PatientDetails patient={patient} userRole="ADMIN" showActions={true} />
    </div>
  );
};

export default PatientDetailsPage;
