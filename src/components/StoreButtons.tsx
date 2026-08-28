type StoreButtonsProps = {
  size?: "md" | "lg";
};

export function StoreButtons({ size = "md" }: StoreButtonsProps) {
  const padding = size === "lg" ? "px-5 py-3.5" : "px-4 py-2.5";
  const icon = size === "lg" ? "h-8 w-8" : "h-7 w-7";
  const title = size === "lg" ? "text-[10px]" : "text-[9px]";
  const name = size === "lg" ? "text-lg" : "text-base";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href="#download"
        className={`inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition hover:bg-zinc-100 sm:w-auto ${padding}`}
        aria-label="Download ShowBuz on the App Store"
      >
        <svg
          className={icon}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className={`${title} font-medium uppercase tracking-wider text-zinc-600`}>
            Download on the
          </span>
          <span className={`${name} font-semibold tracking-tight`}>App Store</span>
        </span>
      </a>
      <a
        href="#download"
        className={`inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition hover:bg-zinc-100 sm:w-auto ${padding}`}
        aria-label="Get ShowBuz on Google Play"
      >
        <svg
          className={icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M3.18 21.13 13.05 12 3.18 2.87A2.25 2.25 0 0 0 3 4.12v15.76c0 .5.07.97.18 1.25"
          />
          <path
            fill="#34A853"
            d="m3.18 21.13 9.87-9.13 3.4 3.15-11.3 6.53A2.2 2.2 0 0 1 3.18 21.13"
          />
          <path
            fill="#FBBC04"
            d="m16.45 15.15-3.4-3.15 3.4-3.15 3.37 1.95c.9.52.9 1.88 0 2.4l-3.37 1.95"
          />
          <path
            fill="#EA4335"
            d="M3.18 2.87 16.45 8.85 13.05 12 3.18 2.87z"
          />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className={`${title} font-medium uppercase tracking-wider text-zinc-600`}>
            Get it on
          </span>
          <span className={`${name} font-semibold tracking-tight`}>Google Play</span>
        </span>
      </a>
    </div>
  );
}
