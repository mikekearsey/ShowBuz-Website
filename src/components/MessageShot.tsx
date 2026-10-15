import Image from "next/image";

/** A short message screenshot shown on its own, wider than a phone. */
export function MessageShot({
  src,
  alt,
  width,
  height,
  screenColor = "#050208",
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  screenColor?: string;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-[330px] max-w-full overflow-hidden rounded-[1.75rem] p-phi-8 shadow-[0_40px_80px_rgb(0_0_0_/_0.55),inset_0_0_0_1px_rgb(255_255_255_/_0.08)] lg:w-[380px] ${className}`}
      style={{ backgroundColor: screenColor }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        sizes="(min-width: 1024px) 380px, 330px"
        className="h-auto w-full"
      />
    </div>
  );
}
