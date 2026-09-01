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
    default: "ShowBuz — See at a glance that your night off is covered",
    template: "%s · ShowBuz",
  },
  description:
    "The app messages your deps for you. They tap Available and it shows up in both of your diaries in perfect synch - always!",
  keywords: [
    "ShowBuz",
    "West End",
    "chair",
    "dep",
    "deputy",
    "musician diary",
  ],
  openGraph: {
    title: "ShowBuz — See at a glance that your night off is covered",
    description:
      "Look at the diary, know the night is sorted, and stop thinking about it.",
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
