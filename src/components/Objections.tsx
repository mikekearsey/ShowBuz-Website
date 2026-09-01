const objections = [
  {
    they: "My deps won't download an app",
    we: "They don't have to. WhatsApp's fine. You still open the diary and see the night is covered.",
  },
  {
    they: "What about Android?",
    we: "The app is iPhone for now. If they're on Android, they answer on WhatsApp. That works.",
  },
  {
    they: "What if I need someone in forty minutes?",
    we: "Phone them. This is so a night off isn't a scramble — not for a forty-minute dash.",
  },
  {
    they: "Is this the band chat?",
    we: "No. Keep that on WhatsApp.",
  },
];

export function Objections() {
  return (
    <section id="faq" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-buzz uppercase">
            Honest answers
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Go on then.
          </h2>
        </div>
        <dl className="mt-12 grid gap-4 sm:grid-cols-2">
          {objections.map((item) => (
            <div
              key={item.they}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <dt className="font-display text-lg font-bold tracking-tight">
                {item.they}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                {item.we}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
