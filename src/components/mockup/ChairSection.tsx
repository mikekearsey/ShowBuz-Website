import { FeatureList, type Feature } from "./MockupChrome";
import { SHOW_PRICING } from "./pricing";
import {
  clashShot,
  createShowShot,
  datesShot,
  holdShot,
  morningShot,
  sendCardShot,
  ticksShot,
} from "./shots";

const chairFeatures: Feature[] = [
  {
    title: "Your show's already in there.",
    body: 'Search for your show once and the full published schedule lands in your diary. It\'s kept up to date every day, in town or on tour. If a venue hasn\'t published a time yet, we say "times TBC" rather than guess.',
    shot: createShowShot,
  },
  {
    title: "See the whole run at once.",
    body: "The Dates grid puts every curtain and every dep on one screen. Blue means you're waiting to hear. Amber means they're holding it. Green means they're booked. Red means they can't do it.",
    shot: datesShot,
  },
  {
    title: "Check every message before it goes.",
    body: "ShowBuz writes the message and shows it to you first. Happy? Tap send. Changed your mind? Tap ✕.",
    shot: sendCardShot,
  },
  {
    title: "Know they've seen it.",
    body: "Grey ticks mean it's gone. Blue ticks mean they've read it.",
    shot: ticksShot,
  },
  {
    title: "Holds that stay put.",
    body: "A hold stays until you book them or let them go, with a counter showing how long they've been holding. If they're still on hold 48 hours before the show you get a reminder.",
    shot: holdShot,
  },
  {
    title: "Peace of mind on the day.",
    body: "In the morning, ShowBuz checks in with your dep. Once they've tapped to re-confirm, the app updates automatically. If they haven't replied by 11am, we'll let you know, so there's plenty of time to sort it.",
    shot: morningShot,
  },
  {
    title: "Works with the calendar you already use.",
    body: "Every show and every cover appears in Apple or Google Calendar. If something clashes, ShowBuz tells you.",
    shot: clashShot,
  },
];

const pricingFeature: Feature = {
  title: "Simple pricing.",
  body: "Try ShowBuz free for 30 days, then pay a small monthly fee for your chair. Deps never pay.",
};

export function ChairSection() {
  const features = SHOW_PRICING
    ? [...chairFeatures, pricingFeature]
    : chairFeatures;

  return (
    <section id="chairs" className="scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
          For chair-holders
        </p>
        <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Your diary keeps itself. See who&apos;s covering, at a glance.
        </h2>
        <FeatureList features={features} />
      </div>
    </section>
  );
}
