import SupportCard from "@/components/module/Dashboard/RoleBased/admin/SupportSystem/SupportCard";
import { getSupport } from "@/services/supportForm/index";
import type { SupportQueryParams } from "@/types/support";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<SupportQueryParams>;
}

const SupportPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;

  const queryParams: SupportQueryParams = {
    status: resolvedSearchParams.status,
    patientName: resolvedSearchParams.patientName,
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
    limit: resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 10,
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  };

  const { data: supportRequests, meta } = await getSupport(queryParams);

  return (
    <div className="container mx-auto py-6">
      <SupportCard supportRequests={supportRequests} meta={meta} />
    </div>
  );
};

export default SupportPage;
