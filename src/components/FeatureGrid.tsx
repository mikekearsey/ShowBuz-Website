import type { ReactNode } from "react";

type Feature = {
  title: string;
  body: string;
  icon: () => ReactNode;
};

const chairFeatures: Feature[] = [
  {
    title: "No more typing the PDF",
    body: "West End times drop into day, week and month. The diary is just there.",
    icon: CalendarIcon,
  },
  {
    title: "Who should I ask?",
    body: "See who's covered for you, and when they last did it. Auto Book works down your list.",
    icon: StatusIcon,
  },
  {
    title: "One message, a run of dates",
    body: "The app sends the WhatsApp. They tap yes in the app or on the message. It lands on the night, so you can see the week is in place.",
    icon: TrailIcon,
  },
  {
    title: "Email yourself the week",
    body: "Nights, who's confirmed, who's been paid. Save it or send it.",
    icon: ExportIcon,
  },
];

const depFeatures: Feature[] = [
  {
    title: "All the requests in one place",
    body: "Every chair, one list. You can see what's on.",
    icon: InviteIcon,
  },
  {
    title: "Don't fancy another app?",
    body: "Stay on WhatsApp. Available and Unavailable still go through.",
    icon: TapIcon,
  },
  {
    title: "You have your own show?",
    body: "Same login. Same app.",
    icon: DualIcon,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-widest text-buzz uppercase">
            Same app
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Booked, backed up, and handled.
          </h2>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
          <FeatureColumn
            id="chairs"
            label="For Chair-Holders"
            features={chairFeatures}
            footnote="Show morning, Auto reconfirm at nine — one tap, both shows. You know before you go. Stick a widget on your Home Screen, or put it in your calendar."
          />
          <FeatureColumn
            id="deps"
            label="For deps"
            features={depFeatures}
            footnote="Thanks and meetups stay on WhatsApp. This is just the diary."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureColumn({
  id,
  label,
  features,
  footnote,
}: {
  id: string;
  label: string;
  features: Feature[];
  footnote: string;
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
      <p className="mt-4 px-1 text-sm leading-relaxed text-muted">{footnote}</p>
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

function ExportIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12M8 7l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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

function DualIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 19c.4-2.8 2.6-4.5 5-4.5s4.6 1.7 5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.5 14.8c1.6-.4 3.4.4 4.5 2.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
