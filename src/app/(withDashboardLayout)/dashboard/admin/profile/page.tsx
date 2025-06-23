import AdminProfile from "@/components/module/Dashboard/RoleBased/admin/AdminProfile";
import { getMyProfile } from "@/services/Auth";
import React from "react";

const UserProfilePage = async () => {
  const profile = await getMyProfile();
  return (
    <div>
      <AdminProfile profile={profile} />
    </div>
  );
};

export default UserProfilePage;
