import Link from "next/link";

export function AdminKindTabs({
  active,
  reviewCount,
  residentHref,
  touringHref,
}: {
  active: "resident" | "touring" | "review";
  /** Null hides the tab (review column or RPCs are not deployed). */
  reviewCount: number | null;
  residentHref: string;
  touringHref: string;
}) {
  return (
    <nav className="admin-kind-tabs" aria-label="Show kind">
      <Link
        href={residentHref}
        className={active === "resident" ? "admin-kind-tab active" : "admin-kind-tab"}
      >
        Resident
      </Link>
      <Link
        href={touringHref}
        className={active === "touring" ? "admin-kind-tab active" : "admin-kind-tab"}
      >
        Touring
      </Link>
      {reviewCount === null ? null : (
        <Link
          href="/admin/review"
          className={active === "review" ? "admin-kind-tab active" : "admin-kind-tab"}
        >
          Needs review
          <span className="admin-kind-tab-count">{reviewCount}</span>
        </Link>
      )}
    </nav>
  );
}
