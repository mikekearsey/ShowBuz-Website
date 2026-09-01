import Image from "next/image";
import { Logo } from "./Logo";
import { StoreButtons } from "./StoreButtons";

/** iPhone 15/16 logical aspect: 393 × 852 */
export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[228px] sm:w-[248px] lg:w-[272px]">
      <div className="relative rounded-[2.65rem] bg-[#1a1a1c] p-[9px] shadow-[0_40px_80px_rgb(0_0_0_/_0.55),inset_0_0_0_1px_rgb(255_255_255_/_0.08)]">
        <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[28%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[38%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[30%] -right-[3px] h-16 w-[3px] rounded-r-sm bg-[#2a2a2c]" />

        <div className="relative aspect-[393/852] overflow-hidden rounded-[2.15rem] bg-black">
          <Image
            src="/app-screen.png"
            alt="ShowBuz day view for West Side Story at Theatre Royal, with Confirmed on the night"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 272px, (min-width: 640px) 248px, 228px"
            className="object-contain object-top"
          />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative">
      <div className="hero-glow pointer-events-none absolute inset-0 overflow-hidden" />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12] mix-blend-overlay" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:gap-12 lg:py-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium tracking-wide text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-buzz-bright" />
            For chairs and deps
          </p>
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your diary.
            <span className="mt-1 block bg-linear-to-r from-buzz to-buzz-bright bg-clip-text text-transparent">
              Fixed.
            </span>
          </h1>
          <p className="mt-5 max-w-xl font-display text-xl font-bold tracking-tight text-pretty sm:text-2xl">
            Deps sorted. Drama optional.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            The app messages your deps for you. They tap Available and it shows
            up in both of your diaries in perfect synch - always! One glance
            and you know everything&apos;s sorted.
          </p>
          <div className="mt-6 grid max-w-xl grid-cols-2 grid-rows-[auto_auto_auto] gap-x-3 gap-y-1">
            <a
              href="#chairs"
              className="col-start-1 row-span-3 grid grid-rows-subgrid rounded-2xl border border-line bg-surface p-4 transition hover:border-buzz/40"
            >
              <p className="text-[11px] font-semibold tracking-widest text-buzz uppercase">
                For Chair-Holders
              </p>
              <p className="text-sm font-semibold leading-snug">
                The diary organises itself.
              </p>
              <p className="text-sm font-semibold leading-snug">
                A night off, at a glance.
              </p>
            </a>
            <a
              href="#deps"
              className="col-start-2 row-span-3 grid grid-rows-subgrid rounded-2xl border border-line bg-surface p-4 transition hover:border-buzz/40"
            >
              <p className="text-[11px] font-semibold tracking-widest text-buzz uppercase">
                For deps
              </p>
              <p className="text-sm font-semibold leading-snug">
                See everything in one place.
              </p>
              <p className="text-sm font-semibold leading-snug">
                Never miss a beat or a booking.
              </p>
            </a>
          </div>
          <div className="mt-8">
            <StoreButtons size="lg" />
          </div>
        </div>
        <div className="relative mx-auto">
          <div className="stave pointer-events-none absolute inset-x-0 top-1/3 h-28 opacity-40" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/35 blur-3xl" />
          <Logo
            size={144}
            priority
            className="pointer-events-none absolute -top-3 -right-3 z-10 h-20 w-20 sm:-right-5 sm:h-24 sm:w-24"
          />
          <PhonePreview />
        </div>
      </div>
    </section>
  );
}
