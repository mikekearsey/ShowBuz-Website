import { PhoneFrame } from "./PhoneFrame";
import { screens } from "./screens";

const steps = [
  {
    n: "1",
    title: "Find your show.",
    body: "Search for it once. Every evening show and matinee goes straight into your diary.",
  },
  {
    n: "2",
    title: "Ask a dep.",
    body: "Tap the night and pick who you'd like. Ask if they're free, ask them to hold it, or book them. You'll see the message before it goes.",
  },
  {
    n: "3",
    title: "They reply however suits them.",
    body: "In the app, or straight from WhatsApp. Nobody has to download anything.",
  },
];

export function HowItWorks() {
  const relax = screens.relax;

  return (
    <section id="how" className="relative scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="max-w-2xl">
          <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
            How it works
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            The stress-free way to step away.
          </h2>
          <p className="mt-phi-21 text-muted text-pretty">
            The app does the messaging. Your diary updates seamlessly.
          </p>
          <p className="mt-phi-13">
            <a
              href="/guide"
              className="inline-flex min-h-phi-55 items-center text-sm font-semibold text-buzz-bright underline decoration-buzz/40 underline-offset-4 transition hover:decoration-buzz"
            >
              How to use the app
            </a>
          </p>
        </div>
        <div className="mt-phi-34 grid items-stretch gap-phi-34 lg:mt-phi-55 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55">
          <div className="flex h-full min-w-0 flex-col gap-phi-34">
            <ol className="grid gap-phi-21 md:grid-cols-3">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="h-full rounded-2xl border border-line bg-surface p-phi-21"
                >
                  <p className="font-display text-3xl font-extrabold text-buzz">
                    {step.n}
                  </p>
                  <h3 className="mt-phi-13 font-display text-lg font-bold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-phi-8 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
            <article className="flex flex-col justify-center rounded-2xl border border-line bg-surface p-phi-21 lg:min-h-0 lg:flex-1">
              <p className="font-display text-3xl font-extrabold text-buzz">4</p>
              <h3 className="mt-phi-13 font-display text-lg font-bold tracking-tight">
                Relax.
              </h3>
              <p className="mt-phi-8 text-sm leading-relaxed text-muted">
                The night turns green when it&apos;s sorted. If someone&apos;s
                holding a date for you, it stays held until you decide. We&apos;ll
                nudge you 48 hours before, so nobody&apos;s left hanging.
              </p>
            </article>
          </div>
          <div className="lg:self-center">
            <PhoneFrame
              src={relax.src}
              alt={relax.alt}
              width={relax.width}
              height={relax.height}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
