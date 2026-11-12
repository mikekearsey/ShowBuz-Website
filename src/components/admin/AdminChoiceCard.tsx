"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

export type AdminChoice = {
  id: string;
  /** One or two short words. */
  label: string;
  /** The way out: red words, and choosing it only closes the card. */
  cancel?: boolean;
};

/**
 * Pop-up choice card — the web version of PillChoiceCard in the iPhone app.
 * A title, short centred words, and a slim outline that slides to the row you
 * are on (pointer, Tab or arrow keys). Cancel is red words. Escape, or a click
 * outside the card, closes it. Styles: "Choice card" in src/app/admin/admin.css.
 *
 * Render it only while it is open: {open ? <AdminChoiceCard … /> : null}
 */
export function AdminChoiceCard({
  title,
  caption,
  choices,
  onChoose,
  onClose,
}: {
  title: string;
  caption?: string;
  choices: AdminChoice[];
  /** Called for a row that is not Cancel. The caller closes the card. */
  onChoose: (id: string) => void;
  onClose: () => void;
}) {
  const [at, setAt] = useState(0);
  const titleId = useId();
  const captionId = useId();
  const rowsRef = useRef<HTMLDivElement>(null);

  // Start on the first row, and give focus back to where it was on the way out.
  useEffect(() => {
    const before = document.activeElement;
    rowsRef.current?.querySelector("button")?.focus();
    return () => {
      if (before instanceof HTMLElement) before.focus();
    };
  }, []);

  function focusRow(index: number) {
    const rows = rowsRef.current?.querySelectorAll("button");
    if (!rows || rows.length === 0) return;
    rows[(index + rows.length) % rows.length].focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusRow(at + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusRow(at - 1);
    } else if (event.key === "Tab") {
      // Keep Tab inside the card while it is open.
      event.preventDefault();
      focusRow(at + (event.shiftKey ? -1 : 1));
    }
  }

  return createPortal(
    <div className="admin-choice-backdrop" role="presentation" onClick={onClose}>
      <div
        className="admin-choice-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={caption ? captionId : undefined}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <h2 id={titleId}>{title}</h2>
        {caption ? (
          <p id={captionId} className="admin-choice-caption">
            {caption}
          </p>
        ) : null}
        <div
          ref={rowsRef}
          className="admin-choice-rows"
          style={{ "--choice-at": at } as CSSProperties}
        >
          <span className="admin-choice-outline" aria-hidden="true" />
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              className={[
                "admin-choice-row",
                choice.cancel ? "cancel" : "",
                index === at ? "on" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => setAt(index)}
              onFocus={() => setAt(index)}
              onClick={() => (choice.cancel ? onClose() : onChoose(choice.id))}
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.querySelector(".admin-app") ?? document.body,
  );
}
