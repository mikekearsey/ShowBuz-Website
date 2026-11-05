import type { Metadata } from "next";
import { AppGuide } from "@/components/AppGuide";
import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "How to use ShowBuz",
  description:
    "How to use the ShowBuz iPhone app: bring in what you already have, book a dep, the 09:00 check, and the home screen widget.",
};

export default function GuidePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <AppGuide />
      </main>
      <Footer />
    </div>
  );
}
