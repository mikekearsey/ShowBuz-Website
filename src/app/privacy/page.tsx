import type { Metadata } from "next";
import { Footer } from "@/components/DownloadCta";
import { Header } from "@/components/Header";
import { PrivacyPolicyDocument } from "@/components/PrivacyPolicyDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ShowBuz collects, uses, and protects personal data for chairs, deps, and other performers.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <PrivacyPolicyDocument />
      </main>
      <Footer />
    </div>
  );
}
