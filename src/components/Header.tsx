import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo size={40} className="h-10 w-10 shadow-none" priority alt="" />
          <span className="font-display text-lg font-bold tracking-tight">
            ShowBuz
          </span>
        </a>
        <nav
          className="flex items-center gap-6 text-sm font-medium text-muted"
          aria-label="Primary"
        >
          <a href="#features" className="hidden transition hover:text-foreground sm:inline">
            Features
          </a>
          <a
            href="#download"
            className="rounded-full bg-linear-to-r from-buzz to-buzz-bright px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_rgb(255_140_26_/_0.28)] transition hover:brightness-110"
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
