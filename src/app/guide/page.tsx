import type { Metadata } from "next";
import { AppGuide } from "@/components/AppGuide";
import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "How to use ShowBuz",
  description:
    "Instructions for using ShowBuz: adding a show in Settings, asking a dep from Diary, Auto Book, Auto reconfirm, and answering Available or Unavailable.",
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
