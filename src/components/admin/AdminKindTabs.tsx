import Link from "next/link";

export function AdminKindTabs({
  active,
  reviewCount,
  tourTimesCount = null,
  residentHref,
  touringHref,
  lookHref = "/admin/look",
  venuesHref = "/admin/venues",
  tourTimesHref = "/admin/tour-times",
}: {
  active: "resident" | "touring" | "review" | "look" | "venues" | "tour-times";
  /** Null hides the tab (review column or RPCs are not deployed). */
  reviewCount: number | null;
  /** Null hides the count (RPC not deployed). Tab still shows. */
  tourTimesCount?: number | null;
  residentHref: string;
  touringHref: string;
  lookHref?: string;
  venuesHref?: string;
  tourTimesHref?: string;
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
      <Link
        href={tourTimesHref}
        className={active === "tour-times" ? "admin-kind-tab active" : "admin-kind-tab"}
      >
        Tour times
        {tourTimesCount === null ? null : (
          <span className="admin-kind-tab-count">{tourTimesCount}</span>
        )}
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
      <Link
        href={lookHref}
        className={active === "look" ? "admin-kind-tab active" : "admin-kind-tab"}
      >
        Needs a look
      </Link>
      <Link
        href={venuesHref}
        className={active === "venues" ? "admin-kind-tab active" : "admin-kind-tab"}
      >
        Venues
      </Link>
    </nav>
  );
}
