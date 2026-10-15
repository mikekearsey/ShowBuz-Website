const objections = [
  {
    they: "My deps won't download another app.",
    we: "They don't need to. They can answer on WhatsApp, and you'll still see the night sorted in your diary.",
  },
  {
    they: "What about Android?",
    we: "It's iPhone only for now. Friends on Android can answer on WhatsApp, and it all works the same.",
  },
  {
    they: "I need someone in forty minutes!",
    we: "Pick up the phone! ShowBuz is for planning ahead, not a mad dash before the half.",
  },
  {
    they: "Is this replacing the band chat?",
    we: "No. Keep that on WhatsApp.",
  },
];

export function Objections() {
  return (
    <section id="faq" className="relative scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="max-w-2xl">
          <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
            Honest answers
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Go on then.
          </h2>
        </div>
        <dl className="mt-phi-34 grid gap-phi-21 sm:grid-cols-2 lg:mt-phi-55 lg:gap-phi-34">
          {objections.map((item) => (
            <div
              key={item.they}
              className="h-full rounded-2xl border border-line bg-surface p-phi-21"
            >
              <dt className="font-display text-lg font-bold tracking-tight">
                {item.they}
              </dt>
              <dd className="mt-phi-13 text-sm leading-relaxed text-muted">
                {item.we}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
