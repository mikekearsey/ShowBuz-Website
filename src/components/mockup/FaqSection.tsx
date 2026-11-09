const answers = [
  {
    q: "Do deps have to pay?",
    a: "No. ShowBuz is free for deps, always.",
  },
  {
    q: "My deps won't download another app.",
    a: "They don't need to. They can answer on WhatsApp, and you'll still see the curtain sorted in your diary.",
  },
  {
    q: "What about Android?",
    a: "It's iPhone only for now. Friends on Android can answer on WhatsApp, and it all works the same.",
  },
  {
    q: "I need someone in forty minutes!",
    a: "Pick up the phone! ShowBuz is for planning ahead, not a mad dash before the half.",
  },
  {
    q: "Is this replacing the band chat?",
    a: "No. Keep that on WhatsApp for the chat and the jokes. ShowBuz keeps the bookings straight.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your details are stored securely, and only the people you work with on your shows can see them.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          FAQs
        </h2>
        <dl className="mt-phi-34 grid gap-phi-13 lg:mt-phi-55 lg:grid-cols-2 lg:gap-phi-21">
          {answers.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-line bg-surface p-phi-21"
            >
              <dt className="font-display text-xl font-bold tracking-tight text-balance">
                {item.q}
              </dt>
              <dd className="mt-phi-13 text-base leading-relaxed text-pretty text-muted">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
