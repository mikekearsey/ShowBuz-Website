import { ContactEmail } from "./ContactEmail";
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
            Open the diary. See the show&apos;s covered.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted text-pretty">
            Peace of mind at a glance.
          </p>
          <div className="relative mt-8 flex justify-center">
            <StoreButtons size="lg" />
          </div>
          <p className="relative mx-auto mt-6 max-w-lg text-sm text-muted">
            Need a hand?{" "}
            <ContactEmail className="text-foreground underline decoration-white/35 underline-offset-4 hover:decoration-buzz" />
          </p>
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
          <a href="/#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="/#features" className="hover:text-foreground">
            Features
          </a>
          <a href="/#download" className="hover:text-foreground">
            Download
          </a>
          <ContactEmail className="underline decoration-white/35 underline-offset-4 hover:text-foreground hover:decoration-buzz" />
          <a href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  );
}
