import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/admin/admin-access";

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminAccess();

  const query = await searchParams;
  const status = query.status?.trim();
  if (status) {
    redirect(`/admin/resident?status=${encodeURIComponent(status)}`);
  }
  redirect("/admin/resident");
}
