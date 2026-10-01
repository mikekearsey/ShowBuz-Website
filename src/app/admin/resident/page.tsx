import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CatalogShowsList } from "@/components/admin/CatalogShowsList";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

export default async function AdminResidentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  const query = await searchParams;
  return (
    <CatalogShowsList kind="resident" status={query.status} email={email} />
  );
}
