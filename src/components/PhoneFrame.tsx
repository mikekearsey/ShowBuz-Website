import Image from "next/image";

/** iPhone 15/16 logical aspect: 393 × 852 */
export function PhoneFrame({
  src,
  alt,
  priority = false,
  className = "",
  quiet = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  quiet?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto ${quiet ? "w-[200px] sm:w-[220px]" : "w-[228px] sm:w-[248px] lg:w-[272px]"} ${className}`}
    >
      <div
        className={`relative rounded-[2.65rem] bg-[#1a1a1c] p-[9px] ${
          quiet
            ? "shadow-[0_8px_24px_rgb(0_0_0_/_0.18)]"
            : "shadow-[0_40px_80px_rgb(0_0_0_/_0.55),inset_0_0_0_1px_rgb(255_255_255_/_0.08)]"
        }`}
      >
        <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[28%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[38%] -left-[3px] h-12 w-[3px] rounded-l-sm bg-[#2a2a2c]" />
        <span className="absolute top-[30%] -right-[3px] h-16 w-[3px] rounded-r-sm bg-[#2a2a2c]" />

        <div className="relative aspect-[393/852] overflow-hidden rounded-[2.15rem] bg-black">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            unoptimized
            sizes="(min-width: 1024px) 272px, (min-width: 640px) 248px, 228px"
            className="object-contain object-top"
          />
        </div>
      </div>
    </div>
  );
}
