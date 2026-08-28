import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function Logo({
  size = 40,
  className = "",
  priority = false,
  alt = "ShowBuz",
}: LogoProps) {
  return (
    <Image
      src="/showbuz-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`rounded-[22%] shadow-[0_8px_32px_rgb(80_20_120_/_0.45)] ${className}`}
      priority={priority}
    />
  );
}
