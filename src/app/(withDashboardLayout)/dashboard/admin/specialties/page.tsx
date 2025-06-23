import Specialties from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/Specialties";
import { getAllSpecialties } from "@/services/Doctors";
import React from "react";

export const dynamic = "force-dynamic";

const SpecialtiesPage = async () => {
  const specialties = await getAllSpecialties();
  return (
    <div className="container mx-auto py-4">
      <Specialties specialties={specialties} />
    </div>
  );
};

export default SpecialtiesPage;
