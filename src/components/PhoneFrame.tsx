import Image from "next/image";

/** iPhone 15/16 logical aspect: 393 × 852 */
export function PhoneFrame({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  quiet = false,
  guide = false,
  screenColor = "#050208",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  quiet?: boolean;
  /** Guide page: about 300px on a desktop, smaller on a phone. */
  guide?: boolean;
  /** Fills the screen around a short shot; match the shot's edge. */
  screenColor?: string;
}) {
  const sized = width != null && height != null;
  const frameClass = guide
    ? "w-[220px] sm:w-[260px] lg:w-[300px]"
    : quiet
      ? "w-[200px] sm:w-[220px]"
      : "w-[228px] sm:w-[248px] lg:w-[272px]";
  const soft = quiet || guide;
  const sizes = guide
    ? "(min-width: 1024px) 300px, (min-width: 640px) 260px, 220px"
    : quiet
      ? "220px"
      : "(min-width: 1024px) 272px, (min-width: 640px) 248px, 228px";

  return (
    <div className={`relative mx-auto ${frameClass} ${className}`}>
      <div
        className={`relative rounded-[2.65rem] bg-[#1a1a1c] p-[9px] ${
          soft
            ? "shadow-[0_8px_24px_rgb(0_0_0_/_0.18)]"
            : "shadow-[0_40px_80px_rgb(0_0_0_/_0.55),inset_0_0_0_1px_rgb(255_255_255_/_0.08)]"
        }`}
      >
        <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[28%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[38%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[30%] -right-[3px] h-16 w-[3px] rounded-r-sm bg-[#2a2a2c]" />

        <div className="relative overflow-hidden rounded-[2.15rem] bg-black">
          {sized ? (
            <div
              className="aspect-[393/852]"
              style={{ backgroundColor: screenColor }}
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                loading={priority ? undefined : "lazy"}
                sizes={sizes}
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div className="relative aspect-[393/852]">
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                unoptimized
                sizes={sizes}
                className="object-contain object-top"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
