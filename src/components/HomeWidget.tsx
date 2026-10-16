import Image from "next/image";
import { screens } from "./screens";

export function HomeWidget() {
  const widget = screens.widget;

  return (
    <section aria-label="Home screen widget" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="grid items-center gap-phi-34 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55">
          <div className="min-w-0 max-w-2xl">
            <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
              Home screen widget
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              Tonight&apos;s show, on your home screen.
            </h2>
            <p className="mt-phi-21 text-lg leading-relaxed text-muted text-pretty">
              Add the ShowBuz widget and you&apos;ll see your next show, its
              curtain times and who&apos;s covering, all without opening the
              app.
            </p>
          </div>
          <div>
            <Image
              src={widget.src}
              alt={widget.alt}
              width={widget.width}
              height={widget.height}
              loading="lazy"
              sizes="(min-width: 1024px) 240px, 220px"
              className="mx-auto h-auto w-[220px] drop-shadow-[0_30px_50px_rgb(0_0_0_/_0.55)] lg:w-[240px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
