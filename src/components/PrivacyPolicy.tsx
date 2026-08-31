"use client";

import { useEffect, useRef } from "react";

const PRIVACY_PDF = "/showbuz-privacy.pdf";

export function PrivacyPolicy() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.body.style.overflow = "";
    };
  }, []);

  function open() {
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="hover:text-foreground"
      >
        Privacy Policy
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="privacy-policy-title"
        className="m-auto h-[min(90dvh,52rem)] w-[min(56rem,calc(100vw-1.5rem))] max-w-none flex-col overflow-hidden rounded-2xl border border-line bg-surface p-0 text-foreground shadow-[0_40px_80px_rgb(0_0_0_/_0.55)] open:flex backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2
            id="privacy-policy-title"
            className="font-display text-base font-bold tracking-tight"
          >
            Privacy Policy
          </h2>
          <div className="flex items-center gap-3">
            <a
              href={PRIVACY_PDF}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted hover:text-foreground"
            >
              Open PDF
            </a>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-line px-3 py-1 text-sm hover:border-buzz/40 hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
        <iframe
          src={PRIVACY_PDF}
          title="ShowBuz Privacy Policy"
          className="min-h-0 w-full flex-1 bg-white"
        />
      </dialog>
    </>
  );
}
