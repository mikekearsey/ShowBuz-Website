import { Logo } from "@/components/Logo";

export function FinalCall() {
  return (
    <section id="download" className="relative scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="relative overflow-hidden rounded-3xl border border-buzz/25 bg-linear-to-br from-surface via-surface-2 to-black px-phi-21 py-phi-55 text-center sm:px-phi-55">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-violet-700/25 blur-3xl" />
          <div className="stave pointer-events-none absolute inset-x-8 top-10 h-20 opacity-30" />
          <Logo size={88} className="relative mx-auto mb-phi-21 h-[88px] w-[88px]" />
          <h2 className="relative mx-auto max-w-full font-display text-3xl font-extrabold tracking-tight text-balance break-words sm:max-w-2xl sm:text-5xl">
            Your deps. Your diary. One screen.
          </h2>
          <p className="relative mx-auto mt-phi-21 max-w-lg text-lg text-pretty text-muted">
            Designed by musicians, for musicians.
          </p>
          <p className="relative mx-auto mt-phi-34 inline-flex h-phi-55 items-center justify-center rounded-full border border-buzz/40 px-phi-55 text-base font-semibold whitespace-nowrap text-buzz-bright">
            Coming soon to the App Store
          </p>
        </div>
      </div>
    </section>
  );
}
