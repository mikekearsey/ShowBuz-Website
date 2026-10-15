import { ContactEmail } from "./ContactEmail";
import { Logo } from "./Logo";
import { StoreButtons } from "./StoreButtons";

export function DownloadCta() {
  return (
    <section id="download" className="relative scroll-mt-phi-89 border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="relative overflow-hidden rounded-3xl border border-buzz/25 bg-linear-to-br from-surface via-surface-2 to-black px-phi-21 py-phi-55 text-center sm:px-phi-55">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-violet-700/25 blur-3xl" />
          <div className="stave pointer-events-none absolute inset-x-8 top-10 h-20 opacity-30" />
          <Logo size={88} className="relative mx-auto mb-phi-21 h-[88px] w-[88px]" />
          <p className="relative text-sm font-semibold tracking-widest text-buzz-bright uppercase">
            Get the app
          </p>
          <h2 className="relative mx-auto mt-phi-13 max-w-full font-display text-3xl font-extrabold tracking-tight text-balance break-words sm:max-w-2xl sm:text-5xl">
            Your deps, your diary, one screen.
          </h2>
          <p className="relative mx-auto mt-phi-21 max-w-lg text-muted text-pretty">
            Peace of mind at a glance.
          </p>
          <div className="relative mx-auto mt-phi-34 max-w-xl">
            <StoreButtons size="lg" />
          </div>
          <p className="relative mx-auto mt-phi-21 max-w-lg text-sm text-muted">
            Need a hand?{" "}
            <ContactEmail className="inline-flex min-h-phi-55 items-center text-foreground underline decoration-white/35 underline-offset-4 hover:decoration-buzz" />
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-phi-21 px-phi-21 py-phi-34 text-sm text-muted sm:flex-row sm:px-phi-34">
        <div className="flex min-h-phi-55 items-center gap-phi-8">
          <Logo size={28} className="h-7 w-7 shadow-none" alt="" />
          <p>© 2026 Mike Kearsey Limited</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-phi-21 gap-y-phi-8">
          <ContactEmail className="inline-flex min-h-phi-55 items-center underline decoration-white/35 underline-offset-4 hover:text-foreground hover:decoration-buzz" />
          <a href="/guide" className="inline-flex min-h-phi-55 items-center hover:text-foreground">
            How to use
          </a>
          <a href="/privacy" className="inline-flex min-h-phi-55 items-center hover:text-foreground">
            Privacy Policy
          </a>
          <a href="/terms" className="inline-flex min-h-phi-55 items-center hover:text-foreground">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}
