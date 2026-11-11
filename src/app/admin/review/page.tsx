import { CatalogReviewQueue } from "@/components/admin/CatalogReviewQueue";
import { requireAdminAccess } from "@/lib/admin/admin-access";
import { loadCatalogReview } from "@/lib/admin/catalog-review";
import { loadTourTimesTabCount } from "@/lib/admin/tour-times";

export default async function AdminReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { email } = await requireAdminAccess();

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
  const tourTimesCount = await loadTourTimesTabCount();

  return (
    <CatalogReviewQueue
      email={email}
      queue={review.queue}
      rejected={review.rejected}
      notice={notice}
      tourTimesCount={tourTimesCount}
    />
  );
}
