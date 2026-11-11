import { CatalogShowsList } from "@/components/admin/CatalogShowsList";
import { requireAdminAccess } from "@/lib/admin/admin-access";

export default async function AdminTouringPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; rejected?: string }>;
}) {
  const { email } = await requireAdminAccess();

  const query = await searchParams;
  return (
    <CatalogShowsList
      kind="touring"
      status={query.status}
      showRejected={query.rejected === "show"}
      email={email}
    />
  );
}
