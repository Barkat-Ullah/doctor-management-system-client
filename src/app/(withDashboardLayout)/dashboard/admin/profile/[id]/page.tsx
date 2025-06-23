import AdminProfile from "@/components/module/Dashboard/RoleBased/admin/UpdateAdmin";
import { getUserById } from "@/services/Auth";
type Params = Promise<{ id: string }>;
const UpdateAdminProfile = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const profile = await getUserById(id);

  return (
    <div>
      <AdminProfile profile={profile} />
    </div>
  );
};

export default UpdateAdminProfile;
