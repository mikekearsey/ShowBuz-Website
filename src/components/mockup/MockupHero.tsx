import { Logo } from "@/components/Logo";
import { SHOW_PRICING } from "./pricing";
import { GetStartedActions, ShotFrame } from "./MockupChrome";
import { dayShot } from "./shots";

export function MockupHero() {
  return (
    <section className="relative">
      <div className="hero-glow pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12] mix-blend-overlay" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-phi-34 px-phi-21 py-phi-55 sm:px-phi-34 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55 lg:py-phi-89">
        <div>
          <p className="mb-phi-13 inline-flex items-center gap-phi-8 rounded-full border border-line bg-surface px-phi-13 py-phi-8 text-xs font-medium tracking-wide text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-buzz-bright" />
            For chairs and deps · West End and UK touring
          </p>
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your diary.
            <span className="mt-phi-8 block bg-linear-to-r from-buzz to-buzz-bright bg-clip-text text-transparent">
              Fixed.
            </span>
          </h1>
          <p className="mt-phi-21 max-w-xl font-display text-xl font-bold tracking-tight text-pretty sm:text-2xl">
            Deps sorted. Drama optional.
          </p>
          <p className="mt-phi-13 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            ShowBuz is the diary and dep app made for theatre musicians, in the
            West End and on tour. It was built in tandem with theatre musicians
            who know the business inside-out. There&apos;s no more digging through WhatsApp
            threads, emails and paper diaries to check who said yes. Every ask,
            every reply and every booking is in one clear place.
          </p>
          <div className="mt-phi-34">
            <GetStartedActions />
          </div>
          <p className="mt-phi-21 max-w-xl text-sm text-muted">
            Free for deps, always.
            {SHOW_PRICING ? " Chairs get 30 days free." : null}
          </p>
        </div>
        <div className="relative mx-auto">
          <div className="stave pointer-events-none absolute inset-x-0 top-1/3 h-28 opacity-40" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/35 blur-3xl" />
          <Logo
            size={144}
            priority
            className="pointer-events-none absolute -top-phi-13 -right-phi-13 z-10 h-20 w-20 sm:-right-phi-21 sm:h-24 sm:w-24"
          />
          <ShotFrame shot={dayShot} priority />
        </div>
      </div>
    </section>
  );
}
