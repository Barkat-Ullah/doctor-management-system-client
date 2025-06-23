import CreateDoctorPage from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/CreateDoctorPage";
import { getAllSpecialties } from "@/services/Doctors";
import React from "react";

export const dynamic = "force-dynamic";

const CreateDoctor = async () => {
  const specialties = await getAllSpecialties();
  return (
    <div className="container mx-auto py-6 px-2">
      <CreateDoctorPage specialties={specialties} />
    </div>
  );
};

export default CreateDoctor;
