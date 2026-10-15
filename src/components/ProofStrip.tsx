import { MessageShot } from "./MessageShot";
import { screens } from "./screens";

const facts = [
  {
    title: "Your show's already in there.",
    body: 'Search for your show and the whole schedule lands in your diary, whether you\'re in the West End or on tour. If a venue hasn\'t published a time yet, we\'ll say "times TBC" rather than guess.',
  },
  {
    title: "One look and you know.",
    body: "Blue means you're waiting to hear. Amber means they're holding it for you. Green means they're booked. Red means they're not available.",
  },
];

export function ProofStrip() {
  const sendCard = screens.sendCard;

  return (
    <section aria-label="What ShowBuz is" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="grid items-stretch gap-phi-34 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55">
          <div className="flex h-full min-w-0 flex-col gap-phi-34">
            <div className="grid gap-phi-34 sm:grid-cols-2">
              {facts.map((fact) => (
                <article
                  key={fact.title}
                  className="h-full rounded-2xl border border-line bg-surface p-phi-21"
                >
                  <h2 className="font-display text-lg font-bold tracking-tight">
                    {fact.title}
                  </h2>
                  <p className="mt-phi-13 text-sm leading-relaxed text-muted">
                    {fact.body}
                  </p>
                </article>
              ))}
            </div>
            <article className="flex flex-col justify-center rounded-2xl border border-line bg-surface p-phi-21 lg:min-h-0 lg:flex-1">
              <h2 className="font-display text-lg font-bold tracking-tight">
                No more typing out dozens of messages.
              </h2>
              <p className="mt-phi-13 text-sm leading-relaxed text-muted">
                Pick your dates and your deps, and ShowBuz writes and sends every
                message for you. You check each one before it goes. Afterwards
                you can see that it went and what they said back. Every step is
                simple, clear and easy to look back on.
              </p>
            </article>
          </div>
          <div className="lg:self-center">
            <MessageShot
              src={sendCard.src}
              alt={sendCard.alt}
              width={sendCard.width}
              height={sendCard.height}
              screenColor={sendCard.screenColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
