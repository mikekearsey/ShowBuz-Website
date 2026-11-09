import { FeatureList, type Feature } from "./MockupChrome";
import {
  invoicesShot,
  requestsShot,
  whatsappShot,
  widgetShot,
} from "./shots";

const depFeatures: Feature[] = [
  {
    title: "Happy on WhatsApp? Stay there.",
    body: "Say yes, no or hold it with the buttons in the message. You don't need to download anything.",
    shot: whatsappShot,
  },
  {
    title: "All your work in one list.",
    body: "Every chair who books you is in one place.",
    shot: requestsShot,
  },
  {
    title: "All of the show details to hand.",
    body: "Once the chair has invited you as a dep, the pad, audio links and invoicing details for the show are right there in the app.",
  },
  {
    title: "Keep track of your invoices.",
    body: "Past shows are listed for you, so you can tick off the ones you've invoiced.",
    shot: invoicesShot,
  },
  {
    title: "Home screen widget.",
    body: "See your next show, the curtain time and the venue without opening the app.",
    shot: widgetShot,
  },
  {
    title: "Got your own chair too?",
    body: "It's the same app and the same login. Book your deps and take your own bookings.",
  },
];

export function DepSection() {
  return (
    <section id="deps" className="scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
          For deps
        </p>
        <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          All your bookings in one place. Never miss a show.
        </h2>
        <p className="mt-phi-21 max-w-xl text-lg leading-relaxed text-pretty">
          Free for deps, always. No catches.
        </p>
        <FeatureList features={depFeatures} />
      </div>
    </section>
  );
}
