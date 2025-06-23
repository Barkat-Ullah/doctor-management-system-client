import DoctorDetails from "@/components/module/Dashboard/RoleBased/admin/DoctorRelated/DoctorDetails";
import { getMyProfile } from "@/services/Auth";
import React from "react";

export const dynamic = "force-dynamic";
const DoctorsProfile = async () => {
  const doctor = await getMyProfile();
  console.log(doctor);
  return (
    <div>
      <DoctorDetails doctor={doctor} showActions={true} />
    </div>
  );
};

export default DoctorsProfile;
