"use client";

import { useRef, useState } from "react";
import { setCatalogArchivedAction } from "@/app/admin/actions";
import { AdminChoiceCard } from "@/components/admin/AdminChoiceCard";

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
  const [asking, setAsking] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const verb = archived ? "Unarchive" : "Archive";

  return (
    <form
      ref={formRef}
      action={setCatalogArchivedAction}
      style={{ display: "inline" }}
    >
      <input type="hidden" name="productionId" value={productionId} />
      <input type="hidden" name="listingKind" value={listingKind} />
      <input type="hidden" name="archived" value={archived ? "false" : "true"} />
      {/* Asks first. The form is only sent from the choice card. */}
      <button
        type="button"
        className="admin-tour-times-pill admin-archive-pill"
        aria-haspopup="dialog"
        onClick={() => setAsking(true)}
      >
        {verb}
      </button>
      {asking ? (
        <AdminChoiceCard
          title={`${verb} ${name}?`}
          caption={
            archived
              ? "It returns to the active list and nightly checks."
              : "It stops nightly checks and hides it from chair search. Chairs who already have it are not affected."
          }
          choices={[
            { id: "go", label: verb },
            { id: "cancel", label: "Cancel", cancel: true },
          ]}
          onChoose={() => {
            setAsking(false);
            formRef.current?.requestSubmit();
          }}
          onClose={() => setAsking(false)}
        />
      ) : null}
    </form>
  );
}
