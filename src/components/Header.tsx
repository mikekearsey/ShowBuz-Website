import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-phi-89 max-w-6xl items-center justify-between px-phi-21 sm:px-phi-34">
        <a href="/" className="inline-flex h-phi-55 items-center gap-phi-8">
          <Logo size={40} className="h-10 w-10 shadow-none" priority alt="" />
          <span className="font-display text-lg font-bold tracking-tight">
            ShowBuz
          </span>
        </a>
        <nav
          className="flex items-center gap-phi-8 text-sm font-medium text-muted sm:gap-phi-13"
          aria-label="Primary"
        >
          <a href="/#how" className="hidden h-phi-55 items-center transition hover:text-foreground sm:inline-flex">
            How it works
          </a>
          <a href="/guide" className="hidden h-phi-55 items-center transition hover:text-foreground sm:inline-flex">
            Guide
          </a>
          <a href="/#features" className="hidden h-phi-55 items-center transition hover:text-foreground lg:inline-flex">
            Features
          </a>
          <a href="/#faq" className="hidden h-phi-55 items-center transition hover:text-foreground lg:inline-flex">
            Questions
          </a>
          <a
            href="/#download"
            className="inline-flex h-phi-55 items-center rounded-full bg-linear-to-r from-buzz to-buzz-bright px-phi-21 text-sm font-semibold text-black shadow-[0_0_24px_rgb(255_140_26_/_0.28)] transition hover:brightness-110"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
