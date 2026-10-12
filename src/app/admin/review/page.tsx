import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CatalogReviewQueue } from "@/components/admin/CatalogReviewQueue";
import { loadCatalogReview } from "@/lib/admin/catalog-review";
import { adminCookieName, readAdminEmail } from "@/lib/admin/session";

export default async function AdminReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const jar = await cookies();
  const email = await readAdminEmail(jar.get(adminCookieName)?.value);
  if (!email) redirect("/admin/login");

  let review: Awaited<ReturnType<typeof loadCatalogReview>>;
  try {
    review = await loadCatalogReview();
  } catch {
    return null;
  }
  if (!review.available || !review.rpc) return null;

  const query = await searchParams;
  const notice =
    query.ok === "review" ? "saved" : query.error === "review" ? "failed" : undefined;

  return (
    <CatalogReviewQueue
      email={email}
      queue={review.queue}
      rejected={review.rejected}
      notice={notice}
    />
  );
}
