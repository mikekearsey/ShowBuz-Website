import Image from "next/image";
import { PhoneFrame } from "@/components/PhoneFrame";
import type { Shot } from "./shots";

/** No public App Store listing yet: scroll to the "Coming soon" section. Swap in the real link at launch. */
const GET_STARTED_HREF = "#download";

const pill =
  "inline-flex h-phi-55 w-full items-center justify-center gap-phi-13 rounded-full px-phi-34 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-buzz sm:flex-1";

export function GetStartedActions() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-phi-13 sm:flex-row">
      <a
        href={GET_STARTED_HREF}
        className={`${pill} bg-linear-to-r from-buzz to-buzz-bright text-black shadow-[0_0_24px_rgb(255_140_26_/_0.28)] hover:brightness-110`}
      >
        Get started
      </a>
      <a
        href={GET_STARTED_HREF}
        className={`${pill} bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-zinc-100`}
        aria-label="Download ShowBuz on the App Store"
      >
        <svg
          className="h-7 w-7 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-medium tracking-wider text-zinc-600 uppercase">
            Download on the
          </span>
          <span className="text-lg font-semibold tracking-tight">App Store</span>
        </span>
      </a>
    </div>
  );
}

export function ShotFrame({
  shot,
  priority = false,
}: {
  shot: Shot;
  priority?: boolean;
}) {
  if (shot.bare) {
    return (
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        priority={priority}
        sizes="(min-width: 1024px) 272px, (min-width: 640px) 248px, 228px"
        className="mx-auto h-auto w-[228px] rounded-[2.15rem] shadow-[0_40px_80px_rgb(0_0_0_/_0.55)] sm:w-[248px] lg:w-[272px]"
      />
    );
  }

  return (
    <PhoneFrame
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      priority={priority}
      screenColor={shot.screenColor}
    />
  );
}

export type Feature = {
  title: string;
  body: string;
  shot?: Shot;
};

export function FeatureList({ features }: { features: Feature[] }) {
  let pictured = 0;

  return (
    <div className="mt-phi-34 grid gap-phi-34 lg:mt-phi-55 lg:gap-phi-55">
      {features.map((feature) => {
        const flip = feature.shot ? pictured++ % 2 === 1 : false;
        return <FeatureRow key={feature.title} feature={feature} flip={flip} />;
      })}
    </div>
  );
}

function FeatureRow({ feature, flip }: { feature: Feature; flip: boolean }) {
  const words = (
    <div className="min-w-0 max-w-xl">
      <h3 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        {feature.title}
      </h3>
      <p className="mt-phi-13 text-base leading-relaxed text-pretty text-muted sm:text-lg">
        {feature.body}
      </p>
    </div>
  );

  if (!feature.shot) {
    return (
      <article className="rounded-2xl border border-line bg-surface p-phi-21 sm:p-phi-34">
        {words}
      </article>
    );
  }

  return (
    <article className="grid items-center gap-phi-21 lg:grid-cols-2 lg:gap-phi-55">
      <div className={flip ? "lg:order-2" : undefined}>{words}</div>
      <div className={flip ? "lg:order-1" : undefined}>
        <ShotFrame shot={feature.shot} />
      </div>
    </article>
  );
}
