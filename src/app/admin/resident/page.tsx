import { CatalogShowsList } from "@/components/admin/CatalogShowsList";
import { requireAdminAccess } from "@/lib/admin/admin-access";

export default async function AdminResidentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; rejected?: string }>;
}) {
  const { email } = await requireAdminAccess();

  const query = await searchParams;
  return (
    <CatalogShowsList
      kind="resident"
      status={query.status}
      showRejected={query.rejected === "show"}
      email={email}
    />
  );
}
