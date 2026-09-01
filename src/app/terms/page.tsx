import type { Metadata } from "next";
import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";
import { TermsOfUseDocument } from "@/components/TermsOfUseDocument";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for ShowBuz, the diary and dep booking tool for chairs and covers.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <TermsOfUseDocument />
      </main>
      <Footer />
    </div>
  );
}
