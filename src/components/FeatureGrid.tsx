import type { ReactNode } from "react";

type Feature = {
  title: string;
  body: string;
  icon: () => ReactNode;
};

const chairFeatures: Feature[] = [
  {
    title: "The published diary, not a copied PDF",
    body: "Official listings load into day, week, and month. Curtain times come from the listing — you are not retyping a schedule into Notes.",
    icon: CalendarIcon,
  },
  {
    title: "Status instead of a buried thread",
    body: "Each night shows Requested, Available, Confirmed, or Unavailable. You do not reconstruct who said yes from email, a call, or a WhatsApp scroll.",
    icon: StatusIcon,
  },
  {
    title: "One ask, a trail you can follow",
    body: "Select a dep or Auto Book the list. Multi-date asks live on the night. Day-of reminders lock the booking in — not a message you have to hunt for later.",
    icon: TrailIcon,
  },
];

const depFeatures: Feature[] = [
  {
    title: "Every ask in one diary",
    body: "Cover requests land in Covers — not scattered across emails, calls, and WhatsApp threads with different chairs and no shared status.",
    icon: InviteIcon,
  },
  {
    title: "Tap Available or Unavailable",
    body: "No composing a reply. The chair is notified. The status is the record — not whether they saw the tick.",
    icon: TapIcon,
  },
  {
    title: "Pencilled versus confirmed is clear",
    body: "Available means you are free and waiting. Confirmed means you are booked. Reconfirm on the morning of the show so the night is not assumed.",
    icon: ReconfirmIcon,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-buzz uppercase">
            Built for the pit
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            A trail for every booking.
          </h2>
          <p className="mt-4 text-muted text-pretty">
            Designed by musicians, for musicians. The path from ask to confirmed
            lives on the night — not buried in email, a phone call, or a
            WhatsApp thread.
          </p>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
          <FeatureColumn id="chairs" label="For chairs" features={chairFeatures} />
          <FeatureColumn id="deps" label="For deps" features={depFeatures} />
        </div>
      </div>
    </section>
  );
}

function FeatureColumn({
  id,
  label,
  features,
}: {
  id: string;
  label: string;
  features: Feature[];
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <p className="mb-4 text-sm font-semibold tracking-widest text-buzz uppercase">
        {label}
      </p>
      <div className="grid gap-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-2xl border border-line bg-surface p-6 transition hover:border-buzz/40 hover:bg-surface-2"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-buzz/12 text-buzz-bright transition group-hover:bg-buzz/20">
              <feature.icon />
            </div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {feature.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="17" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 7h10M10 12h10M10 17h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 6h6a4 4 0 0 1 4 4v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m12 15 3 3 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

function InviteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5 12 13l8-5.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ReconfirmIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 12a8 8 0 1 1-2.2-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
