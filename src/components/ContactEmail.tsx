"use client";

const CONTACT_EMAIL = "admin@showbuz.app";
const MAILTO = `mailto:${CONTACT_EMAIL}`;

type ContactEmailProps = {
  className?: string;
};

export function ContactEmail({ className = "" }: ContactEmailProps) {
  return (
    <a
      href={MAILTO}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        window.location.assign(MAILTO);
      }}
    >
      {CONTACT_EMAIL}
    </a>
  );
}
