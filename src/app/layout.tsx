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
    default: "ShowBuz — Deps sorted. Drama optional.",
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
    title: "ShowBuz — Deps sorted. Drama optional.",
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
      className={`${outfit.variable} ${syne.variable} antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration="manual";
(function(){
  var html = document.documentElement;
  var hash = location.hash;
  if (hash === "#download" || hash === "#top") {
    history.replaceState(null, "", location.pathname + location.search);
    hash = "";
  }
  html.style.scrollBehavior = "auto";
  function pin(){
    if (!hash) scrollTo(0, 0);
  }
  pin();
  addEventListener("DOMContentLoaded", pin);
  addEventListener("pageshow", pin);
  addEventListener("load", function(){
    pin();
    html.style.scrollBehavior = "";
  });
})();`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
