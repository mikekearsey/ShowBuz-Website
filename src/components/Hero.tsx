import { Logo } from "./Logo";
import { PhoneFrame } from "./PhoneFrame";
import { screens } from "./screens";
import { StoreButtons } from "./StoreButtons";

export function Hero() {
  const diary = screens.diary;

  return (
    <section className="relative">
      <div className="hero-glow pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12] mix-blend-overlay" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-phi-34 px-phi-21 py-phi-55 sm:px-phi-34 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55 lg:py-phi-89">
        <div>
          <p className="mb-phi-13 inline-flex items-center gap-phi-8 rounded-full border border-line bg-surface px-phi-13 py-phi-8 text-xs font-medium tracking-wide text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-buzz-bright" />
            For chairs and deps
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
          <p className="mt-phi-13 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            Need a night off? Pick the show, pick your dep, and ShowBuz sends
            the message for you. They reply in the app or on WhatsApp, and it
            shows up in both your diaries. No more scrolling back through chats
            to check who said yes.
          </p>
          <div className="mt-phi-21 grid max-w-xl grid-cols-2 grid-rows-[auto_auto_auto] gap-x-phi-13 gap-y-phi-8">
            <a
              href="#chairs"
              className="col-start-1 row-span-3 grid min-h-phi-55 grid-rows-subgrid rounded-2xl border border-line bg-surface p-phi-21 transition hover:border-buzz/40"
            >
              <p className="text-[11px] font-semibold tracking-widest text-buzz uppercase">
                For Chair-Holders
              </p>
              <p className="text-sm font-semibold leading-snug">
                Your diary keeps itself.
              </p>
              <p className="text-sm font-semibold leading-snug">
                See who&apos;s covering, at a glance.
              </p>
            </a>
            <a
              href="#deps"
              className="col-start-2 row-span-3 grid min-h-phi-55 grid-rows-subgrid rounded-2xl border border-line bg-surface p-phi-21 transition hover:border-buzz/40"
            >
              <p className="text-[11px] font-semibold tracking-widest text-buzz uppercase">
                For deps
              </p>
              <p className="text-sm font-semibold leading-snug">
                All your bookings in one place.
              </p>
              <p className="text-sm font-semibold leading-snug">
                Never miss a show.
              </p>
            </a>
          </div>
          <div className="mt-phi-34 max-w-xl">
            <StoreButtons size="lg" />
          </div>
        </div>
        <div className="relative mx-auto">
          <div className="stave pointer-events-none absolute inset-x-0 top-1/3 h-28 opacity-40" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/35 blur-3xl" />
          <Logo
            size={144}
            priority
            className="pointer-events-none absolute -top-phi-13 -right-phi-13 z-10 h-20 w-20 sm:-right-phi-21 sm:h-24 sm:w-24"
          />
          <PhoneFrame
            src={diary.src}
            alt={diary.alt}
            width={diary.width}
            height={diary.height}
            priority
          />
        </div>
      </div>
    </section>
  );
}
