import { MessageShot } from "./MessageShot";
import { screens } from "./screens";

export function DayOfCheck() {
  const morning = screens.morning;

  return (
    <section aria-label="On the day" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-phi-21 py-phi-55 sm:px-phi-34 lg:py-phi-89">
        <div className="grid items-center gap-phi-34 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-phi-55">
          <div className="min-w-0 max-w-2xl">
            <p className="mb-phi-13 text-sm font-semibold tracking-widest text-buzz uppercase">
              On the day
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
              Peace of mind on the day.
            </h2>
            <p className="mt-phi-21 text-lg leading-relaxed text-muted text-pretty">
              On the morning of the show, your dep gets a message to confirm
              they&apos;re on. If they haven&apos;t confirmed in two hours,
              you&apos;ll know, with time to spare.
            </p>
          </div>
          <div>
            <MessageShot
              src={morning.src}
              alt={morning.alt}
              width={morning.width}
              height={morning.height}
              screenColor={morning.screenColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
