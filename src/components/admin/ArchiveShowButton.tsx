"use client";

import { setCatalogArchivedAction } from "@/app/admin/actions";

export function ArchiveShowButton({
  productionId,
  name,
  listingKind,
  archived,
}: {
  productionId: string;
  name: string;
  listingKind: "resident" | "touring";
  archived: boolean;
}) {
  return (
    <form
      action={setCatalogArchivedAction}
      onSubmit={(event) => {
        if (archived) {
          if (!window.confirm(`Unarchive ${name}? It returns to the active list and nightly checks.`)) {
            event.preventDefault();
          }
          return;
        }
        if (
          !window.confirm(
            `Archive ${name}? It stops nightly checks and hides it from chair search. Chairs who already have it are not affected.`,
          )
        ) {
          event.preventDefault();
        }
      }}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="productionId" value={productionId} />
      <input type="hidden" name="listingKind" value={listingKind} />
      <input type="hidden" name="archived" value={archived ? "false" : "true"} />
      <button type="submit" className="admin-tour-times-pill admin-archive-pill">
        {archived ? "Unarchive" : "Archive"}
      </button>
    </form>
  );
}
