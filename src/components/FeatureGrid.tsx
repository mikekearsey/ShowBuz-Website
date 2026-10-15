import type { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { screens, type ScreenShot } from "./screens";

type Feature = {
  title: string;
  body: string;
  icon: () => ReactNode;
  shot?: ScreenShot;
};

const chairFeatures: Feature[] = [
  {
    title: "Keeps your show diary updated.",
    body: "Your show's diary is kept up to date every day, in town or on tour.",
    icon: CalendarIcon,
  },
  {
    title: "See the whole run at once.",
    body: "The Dates grid puts every show and every dep on one screen. Spot the gaps, tap a square, ask someone.",
    icon: GridIcon,
    shot: screens.dates,
  },
  {
    title: "Reliable and clear messaging.",
    body: "Every message shows up for you to check first. Happy? Tap send. Changed your mind? Tap ✕.",
    icon: MessageIcon,
  },
  {
    title: "Holds that stay put.",
    body: "If a dep is holding a date for you, it stays until you book them or let them go, with a counter of how long they've been holding. One reminder 48 hours before the show, so no-one's left hanging.",
    icon: HoldIcon,
  },
  {
    title: "Works with the calendar you already use.",
    body: "Every show and every cover appears in your Apple or Google Calendar on its own. And if something in your own calendar clashes with a show, ShowBuz lets you know.",
    icon: CalendarLinkIcon,
  },
];

/** Beside the deps list so the two columns finish near the same height on desktop. */
const receiptFeature: Feature = {
  title: "Send/Read receipts.",
  body: "Grey ticks mean your message has gone. Blue ticks mean they've read it.",
  icon: TicksIcon,
  shot: screens.receipts,
};

const depFeatures: Feature[] = [
  {
    title: "All your work in one place.",
    body: "Every chair who books you, in one list. No more hunting through chats.",
    icon: InviteIcon,
  },
  {
    title: "Happy on WhatsApp?",
    body: "Stay there. Say yes, no, or hold it, right from the message.",
    icon: TapIcon,
    shot: screens.whatsapp,
  },
  {
    title: "Got your own chair too?",
    body: "Same login, same app. Book your deps and take your own bookings.",
    icon: DualIcon,
  },
  {
    title: "Your covers, in your own calendar.",
    body: "Every booking lands in your Apple or Google Calendar. You can also choose to let chairs see when you're already busy, so they don't ask you for a night you can't do.",
    icon: CalendarIcon,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="relative scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
            Same app
          </p>
          <h2 className="mx-auto max-w-full font-display text-3xl font-extrabold tracking-tight text-balance break-words sm:text-4xl">
            Booked, backed up, and handled.
          </h2>
        </div>
        <div className="mt-phi-34 grid gap-phi-34 lg:mt-phi-55 lg:grid-cols-2 lg:gap-phi-55">
          <FeatureColumn
            id="chairs"
            label="For Chair-Holders"
            features={chairFeatures}
          />
          <FeatureColumn
            id="deps"
            label="For deps"
            features={[...depFeatures, receiptFeature]}
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
}: {
  id: string;
  label: string;
  features: Feature[];
}) {
  return (
    <div id={id} className="scroll-mt-phi-89">
      <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
        {label}
      </p>
      <div className="grid gap-phi-21">
        {features.map((feature) => (
          <FeatureRow key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  );
}

function FeatureRow({ feature }: { feature: Feature }) {
  const card = (
    <article className="group flex h-full flex-col justify-center rounded-2xl border border-line bg-surface p-phi-21 transition hover:border-buzz/40 hover:bg-surface-2">
      <div className="mb-phi-13 flex size-phi-55 items-center justify-center rounded-xl bg-buzz/12 text-buzz-bright transition group-hover:bg-buzz/20">
        <feature.icon />
      </div>
      <h3 className="font-display text-lg font-bold tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-phi-8 text-sm leading-relaxed text-muted">{feature.body}</p>
    </article>
  );

  if (!feature.shot) return card;

  return (
    <div className="grid min-w-0 items-stretch gap-phi-21 sm:grid-cols-[minmax(0,1fr)_auto]">
      {card}
      <div className="sm:self-center">
        <PhoneFrame
          quiet
          src={feature.shot.src}
          alt={feature.shot.alt}
          width={feature.shot.width}
          height={feature.shot.height}
          screenColor={feature.shot.screenColor}
        />
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

function GridIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 16.5 3.5 20l3.8-1.2A8.5 8.5 0 1 0 5 16.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TicksIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 12 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11 13 2 2 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HoldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarLinkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h12M7 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 14h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" />
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
