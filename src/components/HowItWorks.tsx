const steps = [
  {
    n: "1",
    title: "The show's already in your diary",
    body: "Day, week, month. You don't copy the schedule by hand.",
  },
  {
    n: "2",
    title: "Ask someone",
    body: "The app sends the WhatsApp. See who's covered for you, and when they last did it. Auto Book goes down your list.",
  },
  {
    n: "3",
    title: "They tap Available",
    body: "In the app or on WhatsApp. They don't have to download anything.",
  },
  {
    n: "4",
    title: "Look at the night",
    body: "Confirmed. Auto reconfirms at 9:00am on day of show, one tap for both shows. You can see it's in place — then stop thinking about it.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest text-buzz uppercase">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            The stress-free way to step away.
          </h2>
          <p className="mt-4 text-muted text-pretty">
            The app does the messaging. Your diary updates seamlessly.
          </p>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <p className="font-display text-3xl font-extrabold text-buzz">
                {step.n}
              </p>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
