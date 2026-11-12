import type { Metadata } from "next";
import { DM_Sans, Fraunces, Great_Vibes, IBM_Plex_Mono } from "next/font/google";
import { AdminIdleSessionGuard } from "@/components/admin/AdminIdleSessionGuard";
import { ShowBuzLogo } from "@/components/admin/ShowBuzLogo";
import "./admin.css";

// Same four faces as Chair (apps/web) and Fixer (apps/web-master).
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`admin-app ${dmSans.variable} ${fraunces.variable} ${greatVibes.variable} ${ibmPlexMono.variable}`}
    >
      <AdminIdleSessionGuard />
      <div className="admin-shell">
        {/*
          Brand, once, for every Admin page. admin.css shows the inline mark on
          signed-in pages and the stacked one on the sign-in stage.
        */}
        <div className="admin-brand">
          <span className="admin-brand-inline">
            <ShowBuzLogo layout="inline" width={189} />
          </span>
          <span className="admin-brand-stacked">
            <ShowBuzLogo layout="stacked" width="100%" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
