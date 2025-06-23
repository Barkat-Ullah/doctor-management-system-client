import PatientDetails from "@/components/module/Dashboard/RoleBased/admin/patients/PatientDetails";
import { getMyPatientProfile } from "@/services/Patients";
import React from "react";

export const dynamic = "force-dynamic";
const PatientProfile = async () => {
  const patient = await getMyPatientProfile();

  return (
    <PatientDetails patient={patient} userRole="PATIENT" showActions={true} />
  );
};

export default PatientProfile;
