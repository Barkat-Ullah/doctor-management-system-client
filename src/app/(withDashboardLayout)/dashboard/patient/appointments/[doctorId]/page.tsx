import PatientAppointmentBooking from "@/components/module/Dashboard/RoleBased/admin/patients/PatientAppointmentBooking";
import { getSingleDoctorById } from "@/services/Doctors";
import React from "react";
export const dynamic = "force-dynamic";

type Params = Promise<{ doctorId: string }>;
const PatientAppointments = async ({ params }: { params: Params }) => {
  const { doctorId } = await params;
  const doctor = await getSingleDoctorById(doctorId);
  console.log(doctor);

  return (
    <div className="container mx-auto py-6">
      <PatientAppointmentBooking doctor={doctor} />
    </div>
  );
};

export default PatientAppointments;
