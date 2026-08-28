import { Logo } from "./Logo";
import { StoreButtons } from "./StoreButtons";

export function DownloadCta() {
  return (
    <section id="download" className="relative scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl border border-buzz/25 bg-linear-to-br from-surface via-surface-2 to-black px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-80 -translate-x-1/2 rounded-full bg-violet-700/25 blur-3xl" />
          <div className="stave pointer-events-none absolute inset-x-8 top-10 h-20 opacity-30" />
          <Logo size={88} className="relative mx-auto mb-5 h-[88px] w-[88px]" />
          <p className="relative text-sm font-semibold tracking-widest text-buzz-bright uppercase">
            Get the app
          </p>
          <h2 className="relative mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Put ShowBuz in your pocket.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted text-pretty">
            Designed by musicians, for musicians. Every booking leaves a trail
            — not a message buried in email, a phone call, or a WhatsApp thread.
          </p>
          <div className="relative mt-8 flex justify-center">
            <StoreButtons size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Logo size={28} className="h-7 w-7 shadow-none" alt="" />
          <p>© 2026 Mike Kearsey Limited</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#download" className="hover:text-foreground">
            Download
          </a>
          <a href="mailto:admin@showbuz.app" className="hover:text-foreground">
            admin@showbuz.app
          </a>
        </div>
      </div>
    </footer>
  );
}
