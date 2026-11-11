"use client";

import { useLayoutEffect, useRef, useState } from "react";

type PasswordInputProps = {
  autoComplete: string;
  name?: string;
  required?: boolean;
  minLength?: number;
  id?: string;
  className?: string;
  defaultValue?: string;
};

export function PasswordInput({
  autoComplete,
  name,
  required,
  minLength,
  id,
  className,
  defaultValue,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const input = inputRef.current;
    const selection = selectionRef.current;
    if (!input || !selection) return;
    input.focus();
    input.setSelectionRange(selection.start, selection.end);
    selectionRef.current = null;
  }, [visible]);

  function toggleVisible() {
    const input = inputRef.current;
    if (input) {
      const len = input.value.length;
      selectionRef.current = {
        start: input.selectionStart ?? len,
        end: input.selectionEnd ?? len,
      };
    }
    setVisible((v) => !v);
  }

  return (
    <div className="admin-password-wrap">
      <input
        ref={inputRef}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        name={name}
        required={required}
        minLength={minLength}
        id={id}
        defaultValue={defaultValue}
        className={className}
      />
      <button
        type="button"
        onClick={toggleVisible}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="admin-password-toggle"
      >
        {visible ? <EyeSlashIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="admin-password-icon"
      aria-hidden="true"
    >
      <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="admin-password-icon"
      aria-hidden="true"
    >
      <path d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12s3.75 6.75 9.75 6.75c1.563 0 3.029-.35 4.314-.965" />
      <path d="M6.228 6.228A10.45 10.45 0 0 1 12 5.25c6 0 9.75 6.75 9.75 6.75a17.8 17.8 0 0 1-2.458 3.272" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="m3 3 18 18" />
    </svg>
  );
}
