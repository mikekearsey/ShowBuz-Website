import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShowBuz — Diary for musicians and covers",
    template: "%s · ShowBuz",
  },
  description:
    "ShowBuz is the diary for chairs and deps, designed by musicians. Every booking has a traceable path — requested, available, confirmed — instead of a yes buried in email, a call, or WhatsApp.",
  keywords: [
    "musician diary",
    "deputy booking",
    "chair holder",
    "West End",
    "session musician",
    "ShowBuz",
  ],
  openGraph: {
    title: "ShowBuz — Designed by musicians, for musicians",
    description:
      "A clear, traceable path for every booking. Not a yes lost in email, a phone call, or a WhatsApp thread.",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${outfit.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
