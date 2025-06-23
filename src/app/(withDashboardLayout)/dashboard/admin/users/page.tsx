import AllUser from "@/components/module/Dashboard/RoleBased/admin/AllUser";
import { getAllUser } from "@/services/Auth";
export const dynamic = "force-dynamic";
const AllUsersPage = async () => {
  const users = await getAllUser();

  return (
    <div className="container mx-auto py-4">
      <AllUser initialUsers={users} />
    </div>
  );
};

export default AllUsersPage;
