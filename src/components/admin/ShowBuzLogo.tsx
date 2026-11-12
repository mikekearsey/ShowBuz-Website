import Image from "next/image";

type LogoLayout = "stacked" | "inline";

type ShowBuzLogoProps = {
  layout?: LogoLayout;
  /** CSS length (number = px). Scales the whole mark from one viewBox. */
  width?: number | string;
  className?: string;
};

const ORANGE_TOP = "#FF9A1A";
const ORANGE_MID = "#F88800";
const ORANGE_BOT = "#E07000";

/**
 * Live ShowBuz logo, same drawing as Chair (`apps/web`) and Fixer
 * (`apps/web-master`): the bee on its own — no stave lines through it — beside
 * (inline) or above (stacked) the "ShowBuz" wordmark, which sits on a five-line
 * stave. Colours come from admin.css, so it follows House lights / Stage.
 */
export function ShowBuzLogo({
  layout = "inline",
  width,
  className = "",
}: ShowBuzLogoProps) {
  // One instance per layout on a page, so the SVG ids stay unique.
  const uid = `sbz-${layout}`;

  if (layout === "inline") {
    const w = width ?? 189;
    return (
      <span
        role="img"
        aria-label="ShowBuz"
        className={`showbuz-logo showbuz-logo--inline ${className}`.trim()}
        style={{ width: typeof w === "number" ? `${w}px` : w }}
      >
        <span className="showbuz-logo__bee-wrap showbuz-logo__bee-wrap--inline">
          <BeeImage box={37} sizes="37px" />
        </span>
        <svg
          viewBox="0 0 160 44"
          width="100%"
          height="auto"
          aria-hidden
          className="showbuz-logo__svg"
        >
          <WordmarkDefs uid={uid} strokeWidth={5} />
          <g mask={`url(#${uid}-stave-mask)`} className="showbuz-logo__stave">
            {[12, 18, 24, 30, 36].map((y) => (
              <line
                key={y}
                x1="2"
                x2="158"
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
          </g>
          <text
            x="4"
            y="32"
            className="showbuz-logo__word showbuz-logo__word--inline"
          >
            <tspan fill={`url(#${uid}-orange)`}>Show</tspan>
            <tspan className="showbuz-logo__buz">Buz</tspan>
          </text>
        </svg>
      </span>
    );
  }

  // stacked — sign-in stage
  const w = width ?? 440;
  return (
    <span
      role="img"
      aria-label="ShowBuz"
      className={`showbuz-logo showbuz-logo--stacked ${className}`.trim()}
      style={{ width: typeof w === "number" ? `${w}px` : w }}
    >
      <span className="showbuz-logo__bee-wrap showbuz-logo__bee-wrap--stacked">
        <BeeImage box={440} />
      </span>
      <svg
        viewBox="0 0 440 120"
        width="100%"
        height="auto"
        aria-hidden
        className="showbuz-logo__svg"
      >
        <WordmarkDefs uid={uid} strokeWidth={14} hero />
        <g mask={`url(#${uid}-stave-mask)`} className="showbuz-logo__stave">
          {[28, 46, 64, 82, 100].map((y) => (
            <line
              key={y}
              x1="24"
              x2="416"
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeWidth="1.25"
            />
          ))}
        </g>
        <text
          x="220"
          y="88"
          textAnchor="middle"
          className="showbuz-logo__word showbuz-logo__word--hero"
        >
          <tspan fill={`url(#${uid}-orange)`}>Show</tspan>
          <tspan className="showbuz-logo__buz">Buz</tspan>
        </text>
      </svg>
    </span>
  );
}

/** Orange gradient for "Show", and a mask that lifts the stave off the letters. */
function WordmarkDefs({
  uid,
  strokeWidth,
  hero = false,
}: {
  uid: string;
  strokeWidth: number;
  hero?: boolean;
}) {
  const textProps = hero
    ? {
        x: 220,
        y: 88,
        textAnchor: "middle" as const,
        className: "showbuz-logo__word showbuz-logo__word--hero",
      }
    : {
        x: 4,
        y: 32,
        className: "showbuz-logo__word showbuz-logo__word--inline",
      };

  return (
    <defs>
      <linearGradient id={`${uid}-orange`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={ORANGE_TOP} />
        <stop offset="55%" stopColor={ORANGE_MID} />
        <stop offset="100%" stopColor={ORANGE_BOT} />
      </linearGradient>
      <mask id={`${uid}-stave-mask`} maskUnits="userSpaceOnUse">
        <rect width={hero ? 440 : 160} height={hero ? 120 : 44} fill="#fff" />
        <text
          {...textProps}
          stroke="#000"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          fill="#000"
        >
          ShowBuz
        </text>
      </mask>
    </defs>
  );
}

function BeeImage({ box, sizes }: { box: number; sizes?: string }) {
  return (
    <Image
      src="/brand/showbuz-bee-live.png"
      alt=""
      width={box}
      height={box}
      sizes={sizes ?? `(max-width: 640px) 86vw, ${Math.min(box, 440)}px`}
      className="showbuz-logo__bee"
    />
  );
}
